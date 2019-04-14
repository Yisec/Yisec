import { EventAlias, VirtualDOM, ASTNode, Props } from "./d";
import {
    getType,
    YisecElement,
    isPromise,
    getComponent,
    getParentCtx,
    resortArr,
    isComponent,
} from './util'

import { observer, addObserve } from './autorun'
import { execExpr } from "./execExpr";
import render from './render'

import eventAlias from "./event/alias";
import { unmountNode } from "./unmount"
import handleClass from "./property/handleClass";
import handleStyle from "./property/handleStyle";

import handleFor from "./directive/for";
import handleIf from "./directive/if";

import { DIRECTIVE_PREV, DIRECTIVE_EXPR } from "./config";

// 需要优先处理的props key
const NEED_RESET_KEY = [':key', `${DIRECTIVE_PREV}if`, `${DIRECTIVE_PREV}show`, `${DIRECTIVE_PREV}for`]

// key发生变化后，组件重新选案
function handleKeyChange(vdom: VirtualDOM) {
    unmountNode(vdom)
    vdom.reRender && vdom.reRender()
}

// 处理innerHTML
function handleDangerousHTML(vdom: VirtualDOM, ctxs:any[] = [], key = '') :boolean {
    const { dom } = vdom;
    if (dom instanceof HTMLElement) {
        if (key === 'dangerousHTML') {
            dom.innerHTML = vdom.ast.props[key]
        } else if (key === ':dangerousHTML') {
            execExpr(vdom.ast.props[key], ctxs, (newValue, oldValue) => {
                dom.innerHTML = newValue
            })
        }
    }
    return false
}

/**
 * 添加属性
 *
 * @param {HTMLElement} element
 * @param {any} node
 * @param {array} ctxs
 * @returns
 */
function addProperties(element: HTMLElement|SVGElement, vdom: VirtualDOM, ctxs: any[]) {
    const {ast: node} = vdom
    const info = {
        transformChildren: true, // 是否渲染子节点
    }

    resortArr(
        Object.keys(node.props),
        NEED_RESET_KEY
    ).forEach(key => {
        const value = node.props[key]
        // 处理class
        if (handleClass(vdom, ctxs, key)) return

        // 处理html
        if (handleDangerousHTML(vdom, ctxs, key)) return

        const KEY = key.slice(1)
        // 处理事件绑定
        if (key.startsWith('@') && element instanceof HTMLElement) {
            let aliasListeners: EventAlias[] = []
            vdom.exprs.push(
                execExpr(value, ctxs, (newValue, oldValue) => {
                    if (eventAlias[KEY]) {
                        // 使用事件别名
                        aliasListeners.forEach(aliasListener => {
                            vdom.events.off(element, aliasListener.eventName, aliasListener.listener)
                        })
                        aliasListeners = eventAlias[KEY](newValue)
                        aliasListeners.forEach(aliasListener => {
                            vdom.events.on(element, aliasListener.eventName, aliasListener.listener)
                        })
                    } else {
                        vdom.events.off(element, KEY, oldValue)
                        vdom.events.on(element, KEY, newValue)
                    }
                })
            )
        }
        // 处理属性表达式
        else if (key.startsWith(':')) {
            vdom.exprs.push(
                execExpr(value, ctxs, (newValue, oldValue, execTime) => {
                    if ( ['checked', 'value'].includes(KEY) ) {
                        element[KEY] = newValue
                    }
                    // 处理style
                    else if (KEY === 'style') {
                        newValue = handleStyle(newValue)
                    }
                    // 处理key变化
                    else if (KEY === 'key' && oldValue !== newValue && execTime > 1) {
                        // 如果key发生变化，会卸载原有vdom，重新渲染
                        handleKeyChange(vdom)
                        return
                    }
                    element.setAttribute(KEY, newValue)
                })
            )
        }
        // 处理指令
        else if (key.startsWith(DIRECTIVE_PREV)) {
            const directive = key.slice(DIRECTIVE_PREV.length)
            // 显示
            if (directive === 'show') {
                vdom.exprs.push(
                    execExpr(value, ctxs, (newValue, oldValue) => {
                        element.style.cssText += `;display: ${newValue ? 'block' : 'none' };`
                    })
                )
            }
            // 循环
            else if (directive === 'for') {
                info.transformChildren = false
                handleFor(value, element, ctxs, vdom, node)
            }
            // backgroundImage
            else if (directive === 'bgd') {
                vdom.exprs.push(
                    execExpr(value, ctxs, (newValue, oldValue) => {
                        element.style.cssText += `;background: url(${newValue});`
                    })
                )
            }
            // 处理innerHTML
            else if (directive === 'html') {
                info.transformChildren = false
                vdom.exprs.push(
                    execExpr(value, ctxs, (newValue, oldValue) => {
                        element.innerHTML = newValue
                    })
                )
            }
            // 处理表达式，表达式不会对依赖进行watch
            else if (directive.startsWith(DIRECTIVE_EXPR)) {
                const KEY = directive.slice(DIRECTIVE_EXPR.length)
                execExpr(value, ctxs, (newValue, oldValue) => {
                    element.setAttribute(KEY, newValue)
                })()
            }
        }
        // 添加处理ref
        else if (key === 'ref') {
            switch (getType(value)) {
                case 'string': {
                    ctxs[0].refs[value] = element
                    break
                }
                case 'function': {
                    value(vdom.dom)
                    break
                }
            }
        }
        else {
            element.setAttribute(key, node.props[key])
        }
    })

    return info
}

/**
 * 获取自定义组件属性
 */
function getProps(vdom: VirtualDOM, ctxs: any[]) {
    const { ast: node } = vdom
    let newProps: Props = {}

    resortArr(
        Object.keys(node.props),
        NEED_RESET_KEY
    ).forEach(key => {
        const value = node.props[key]
        if (/^@|:|ys:expr:/.test(key)) {
            const KEY = key.replace(/^@|:|ys:expr:/, '')
            vdom.exprs.push(
                execExpr(value, ctxs, (newValue, oldValue, execTime) => {
                    // 如果key为props，则对props进行rest操作，方便子组件对数据的获取
                    if (KEY === 'props') {
                        Object.entries(newValue).forEach(([k, v]) => {
                            addObserve(newProps, k, v)
                        })
                    } else {
                        newProps[KEY] = newValue
                    }

                    if (KEY === 'key' && oldValue !== newValue && execTime > 1) {
                        // 如果key发生变化，会卸载原有vdom，重新渲染
                        handleKeyChange(vdom)
                    }
                })
            )
        } else {
            newProps[key] = value
        }
    })
    // 元素传递
    newProps['children'] = {
        node,
        ctxs,
    }
    newProps = observer(newProps)
    return newProps
}

/**
 * 添加元素
 */
export function addElement(appendFn, ast: ASTNode, ctxs: any[], parentVdom: VirtualDOM) :VirtualDOM {
    const vdom = new VirtualDOM(parentVdom)
    vdom.ast = ast
    vdom.ctxs = ctxs
    // 方便dom卸载后，重新渲染
    vdom.reRender = () => {
        addElement(appendFn, ast, ctxs, parentVdom)
    }

    if (/^[A-Z]/.test(ast.tagName)) {
        // 处理子组件
        const Com = getComponent(ast.tagName, ctxs)
        // 判断是否是Component的子类
        if (isComponent(Com, ast)) {
            appendFn(undefined, vdom)
            function renderComponent(Com) {
                // 因为有可能是异步获取组件，因此这里对vdom进行判断，vdom是否已经被卸载
                if (vdom.unmounted) {
                    console.log('vdom已被卸载，不执行渲染')
                    return
                }
                // 通过创建一个Comment占位节点，可实无root渲染
                const parentCtx = getParentCtx(ctxs)
                const com = render(Com, getProps(vdom, ctxs), {
                    appendChild: appendFn,
                }, {
                    parent: parentCtx,
                    context: parentCtx.context,
                })
                com.parent.children.push(com)
                vdom.component = com
                // 添加ref
                if (ast.props.ref) {
                    ctxs[0].refs[ast.props.ref] = com
                }
            }
            // 如果是Promise，可执行懒加载
            if (isPromise(Com)) {
                Com.then(Com => {
                    renderComponent(Com)
                })
            } else {
                renderComponent(Com)
            }
        }

    } else if (ast.tagName === 'slot') {
        // 处理slot，获取children后，并不监听变化
        execExpr('props.children', ctxs, (newValue) => {
            transform(newValue.node, {
                appendChild: appendFn,
            }, [getProps(vdom, ctxs) , ...newValue.ctxs], parentVdom)
        })()
    }
    // template作为特殊的不被渲染的节点
    else if (ast.tagName === 'template') {
        appendFn(null, vdom) // 添加vdom
        transform(ast, {
            appendChild: appendFn,
        }, ctxs, vdom)
    }
    else {
        let createE = vdom.ast.isSVG
            ? document.createElementNS('http://www.w3.org/2000/svg', ast.tagName) // 添加svg支持
            : document.createElement(ast.tagName)
        vdom.dom = createE
        appendFn(createE, vdom)
        const result = addProperties(createE, vdom, ctxs)
        vdom.oncreate()
        result.transformChildren && ast.children && ast.children.length && transform(ast, createE, ctxs, vdom)
    }

    return vdom
}

/**
 * ast transform to node
 *
 * @param {any} ast
 * @param {HTMLElement} element
 * @param {anray} ctxs
 */
function transform(ast: ASTNode, element: YisecElement, ctxs: any[], parentVdom: VirtualDOM = new VirtualDOM() ) {
    const vdoms = ast.children.map(node => {
        if (node.type === 'element' || node.type === 'component') {
            // 处理ys:if指令
            if (node.props[`${DIRECTIVE_PREV}if`]) {
                handleIf(element, node, ctxs, parentVdom)
            } else {
                return addElement((createE) => {
                    createE && element.appendChild(createE)
                }, node, ctxs, parentVdom)
            }
        } else {
            const vdom = new VirtualDOM(parentVdom)
            vdom.ast = ast
            vdom.ctxs = ctxs
            let createE: Node
            if (node.type === 'expr') {
                createE = document.createTextNode('')
                element.appendChild(createE)
                vdom.exprs.push(
                    execExpr(node.value, ctxs, (newValue) => {
                        createE.textContent = newValue
                    })
                )
            } else {
                createE = document.createTextNode(node.value)
                element.appendChild(createE)
            }
            vdom.dom = createE
            parentVdom.children.push(vdom)
            return vdom
        }
    }).filter(i => i)
    return {
        children: vdoms
    }
}

export default transform
