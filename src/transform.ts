import { EventAlias, VirtualDOM, ASTNode, Props } from "./d";

import ast from './ast'
import { registerComponents } from "./register";
import { autorun, observer, addObserve } from './autorun'
import { execExpr } from "./execExpr";
import { toClassNames, getType, FElement, isPromise, isObject, getComponent, getParentCtx } from './util'
import diff from './diff'
import render from './render'

import handleClass from "./handleClass";
import eventAlias from "./eventAlias";
import FVEvents from "./FVEvents";
import Component from "./Component";
import { unmountChildren, unmountNode } from "./unmount"
import handleStyle from "./handleStyle";

import { handleEnter } from "./domLifeCycle";

function handleVFor(value, element, ctxs, vdom, node) {
    const [itemIndex ,arrName] = value.split(' in ').map(i => i.trim())
    const [itemName, indexName] = itemIndex.replace(/(^\s*\()|(\)\s*$)/g, '').split(',').map(i => i.trim())
    
    let isExeced = false // 是否执行过
    let cacheKeys = []
    let cacheKeyVdom = {}
    vdom.exprs.push(
        execExpr(arrName, ctxs, (newValue, oldValue = []) => {
            // console.log('数组发生变化', arrName, newValue.length, oldValue.length)
            // v-for只应该含有一个子元素
            if (node.children.length > 1) {
                console.error(`v-for just should have one child`)
            }
            // diff cache key
            const keyValue = node.children[0] && (node.children[0].props['key'] || node.children[0].props[':key'])
            const newKeyValue = newValue.map((item, index) => {
                let key
                execExpr(
                    keyValue, 
                    [
                        ...ctxs, 
                        {
                            [itemName]: item,
                            [indexName]: index,
                        }
                    ], 
                    (newValue, oldValue) => {
                        key = newValue
                    }
                )()
                return {
                    key,
                    item,
                }
            })

            const newKyes = newKeyValue.map(i => i.key)
            const { add, del } = diff(cacheKeys, newKyes, keyValue)
            // console.log('数组更新:', newValue, add, del)
            if (isExeced) {
                // 存在key，卸载需要删除的key对应的vdom，否则整体卸载
                keyValue 
                ? del.arr.forEach(key => {
                    unmountChildren(cacheKeyVdom[key].vdom)
                    delete cacheKeyVdom[key] // 删除缓存
                })
                : unmountChildren(vdom)
            }

            cacheKeys = newKyes
            isExeced = true
            
            // 我们只处理 移除 + 头尾新增的情况
            // key不发生变化的需要更新index
            // key新增的还是需要新增 
            const childNode = element.childNodes && element.childNodes[0]
            newKeyValue.forEach((keyItem, index) => {
                const { key, item } = keyItem
                // 不存在就新增，存在就更新
                if (!cacheKeyVdom[key]) {
                    const observeIndexItem = observer({
                        [itemName]: item,
                        [indexName]: index,
                    })

                    const PE = add.before.arr.includes(key) ? {
                        appendChild: (newNode) => {
                            childNode ? element.insertBefore(newNode, childNode) : element.appendChild(newNode)
                            return newNode
                        }
                    } : element;

                    const result = transform(
                        node, 
                        PE, 
                        [...ctxs, observeIndexItem],
                        vdom,
                    )
                    // 如果没有key就不要加入缓存了
                    if (keyValue) {
                        cacheKeyVdom[key] = {
                            vdom: result,
                            observeIndexItem,
                        }
                    }
                } else {
                    cacheKeyVdom[key].observeIndexItem[indexName] = index
                    cacheKeyVdom[key].observeIndexItem[itemName] = item
                }
            })
        })
    )
}

/**
 * 添加属性
 * 
 * @param {HTMLElement} element 
 * @param {any} node 
 * @param {array} ctxs 
 * @returns 
 */
function addProperties(element: HTMLElement, vdom: VirtualDOM, ctxs: any[]) {
    const {ast: node} = vdom
    const info = {
        transformChildren: true,
    }
    Object.keys(node.props).forEach(key => {
        const value = node.props[key]
        // 处理class
        if (handleClass(vdom, ctxs, key)) return

        // 处理事件绑定
        if (key.startsWith('@')) {
            const KEY = key.slice(1)
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
                execExpr(value, ctxs, (newValue, oldValue) => {
                    const KEY = key.slice(1)
                    if (node.tagName == 'input' && KEY == 'checked') {
                        element[KEY] = newValue
                        return
                    } 

                    if (KEY === 'style') {
                        newValue = handleStyle(newValue)
                    }
                    element.setAttribute(KEY, newValue)
                })
            )
        }
        // 处理指令
        else if (key.startsWith('v-')) {
            // 显示
            if (key === 'v-show') {
                vdom.exprs.push(
                    execExpr(value, ctxs, (newValue, oldValue) => {
                        element.style.cssText += `;display: ${newValue ? 'block' : 'none' };`
                    })
                )
            }
            // 循环
            else if (key === 'v-for') {
                info.transformChildren = false
                handleVFor(value, element, ctxs, vdom, node)
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
                    value()
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
 * 处理v-if命令
 * 
 * @param {HTMLElement} parent 
 * @param {any} node 
 * @param {array} ctxs 
 */
function handleVIf(parent, node, ctxs: any[], parentVdom: VirtualDOM) {
    let commentHook = document.createComment('v-if 占位')
    parent.appendChild(commentHook)
    let collect:VirtualDOM[] = []
    const destroy = parentVdom.exprs.push( 
        execExpr(node.props['v-if'], ctxs, (newValue, oldValue) => {
            if (newValue) {
                addElement((ele, vdom) => {
                    vdom && collect.push(vdom)
                    ele && commentHook.parentElement && commentHook.parentElement.insertBefore(ele, commentHook)
                }, node, ctxs, parentVdom)
            } else {
                // 如果node
                collect.forEach(i => unmountNode(i))
                collect = []
            }
        })
    )
}

/**
 * 获取自定义组件属性
 * @param node 
 * @param vdom 
 * @param ctxs 
 */
function getProps(vdom: VirtualDOM, ctxs: any[]) {
    const { ast: node } = vdom
    let newProps: Props = {}
    Object.keys(node.props).forEach(key => {
        const value = node.props[key]
        if (/^[@:]/.test(key)) {
            const KEY = key.slice(1)
            vdom.exprs.push(
                execExpr(value, ctxs, (newValue, oldValue) => {
                    // 如果key为props，则对props进行rest操作，方便子组件对数据的获取
                    if (KEY === 'props') {
                        Object.entries(newValue).forEach(([k, v]) => {
                            addObserve(newProps, k, v)
                        })
                    } else {
                        newProps[KEY] = newValue
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

export function isComponent(component, ast: ASTNode) {
    if (component && (component.prototype instanceof Component || isPromise(component))  )  {
        return true
    }
    console.error(component, `${ast.tagName} should be a Component!!! 您可以在组件的Components属性中添加子组件，或者通过Fv.register注册全局组件`)
    return false
}

/**
 * 添加元素
 * 
 * @param {function} appendFn 
 * @param {any} node 
 * @param {array} ctxs 
 * @returns 
 */
function addElement(appendFn, ast: ASTNode, ctxs: any[], parentVdom: VirtualDOM) :VirtualDOM {
    const vdom = new VirtualDOM(parentVdom)
    vdom.ast = ast
    vdom.ctxs = ctxs

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
                const com = render(Com, getProps(vdom, ctxs), {
                    appendChild: appendFn,
                }, vdom)
                com.parent = getParentCtx(ctxs)
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
        
    } else if (ast.tagName == 'slot') {
        // 处理slot，获取children后，并不监听变化
        execExpr('props.children', ctxs, (newValue) => {
            transform(newValue.node, {
                appendChild: appendFn,
            }, [getProps(vdom, ctxs) , ...newValue.ctxs], parentVdom)
        })()
    } else {
        let createE = document.createElement(ast.tagName)
        vdom.dom = createE
        appendFn(createE, vdom)
        const result = addProperties(createE, vdom, ctxs)
        handleEnter(vdom) // 处理enter-class
        result.transformChildren && ast.children && ast.children.length && transform(ast, createE, ctxs, vdom)
    }

    return vdom
}

// 

/**
 * ast transform to node
 * 
 * @param {any} ast 
 * @param {HTMLElement} element 
 * @param {anray} ctxs 
 */
function transform(ast: ASTNode, element: FElement, ctxs: any[], parentVdom: VirtualDOM = new VirtualDOM() ) {
    const vdoms = ast.children.map(node => {
        if (node.type === 'element' || node.type === 'component') {
            // 处理v-if指令
            if (node.props['v-if']) {
                handleVIf(element, node, ctxs, parentVdom)
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

