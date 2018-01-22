import Component from "./Component";
import YSEvents from "./event/index";
import { handleEnter, handleLeave } from "./domLifeCycle";
import { execExpr, execExprOnce } from "./execExpr";
import { DIRECTIVE_EXPR } from "./config";

export interface EventAlias {
    eventName: string
    listener: any
}

export interface Props {
    [propName: string]: any
}

export type exprDestroyFn = ()=>void

export interface DOMLifeCycle {
    // dom被创建
    oncreate(): void
    // dom将要被卸载，可返回一个Promise
    onunmount(): void
}

// sssdddd
export class VirtualDOM implements DOMLifeCycle {
    exprs: exprDestroyFn[] = []
    events = new YSEvents()
    parent: VirtualDOM
    children: VirtualDOM[] = []
    ctxs: any[] = []
    component: Component
    unmounted = false
    classNames = {}
    dom: Node
    ast: ASTNode
    reRender: any // 用来重新执行render任务
    constructor(parent?: VirtualDOM) {
        if (parent) {
            this.parent = parent
            this.parent.children.push(this)
        }
    }
    // dom create 回调
    oncreate() {
        const { dom } = this;
        if (dom) {
            const { [`${DIRECTIVE_EXPR}oncreate`]: fnExpr = '' } = this.ast.props
            const fn = execExprOnce(fnExpr, this.ctxs)
            // add enter class
            handleEnter(this)
            fn && fn(dom, this)
        }
    }
    // onupdate(key, newValue, olValue) {
    //     const { dom } = this;
    //     const { onupdate: fn } = this.ast.props
    //     if (dom && fn) {
    //         fn(key, newValue, olValue)
    //     }
    // }
    // dom unmount 回调
    onunmount() {
        const { dom } = this;
        // add leave class
        if (dom) {
            const { [`${DIRECTIVE_EXPR}onunmount`]: fnExpr = '' } = this.ast.props
            const fn = execExprOnce(fnExpr, this.ctxs)
            const resultResult = handleLeave(this)
            const fnResult = fn && fn(dom)
            // 判断执行结果中是否有Promise
            const pList = [resultResult, fnResult].filter(r => (r instanceof Promise))
            if (pList.length) {
                // 等待所有任务结束
                Promise.all(pList).then(() => {
                    dom.parentElement && dom.parentElement.removeChild(dom)
                })
            } else {
                dom.parentElement && dom.parentElement.removeChild(dom)
            }
        }
    }
    // 卸载vdom
    unmount() {
        // 关闭依赖追踪
        this.exprs.forEach(fn => fn())
        // 卸载事件监听
        ;(this.dom instanceof HTMLElement) && this.events.off(this.dom)
        // 如果是组件，卸载组件
        this.component && this.component.__willUnmount()
        // vdom已卸载
        this.unmounted = true
    }
}

export class TokenElement {
    type: string
    index: number
    value: string
    origin: string
    isExpr: boolean
    constructor(type: string, index: number, value: string, origin: string = value, isExpr = false ) {
        this.type = type
        this.index = index
        this.value = value
        this.origin = origin
        this.isExpr = isExpr
    }
}

/**
 * AST节点
 * @class ASTNode
 */
export class ASTNode {
    tagName: string // 节点名称
    parent: ASTNode // 父节点
    children: ASTNode[] = [] // 子节点
    props: any = {} // props
    type: string = 'element' // 节点类型
    expr: string // 文本节点表达式
    exprs = []
    value: string // 文本节点值
    dom: Node // token节点上挂载的DOM
    isSVG = false // 是不是svg节点
    ctx: object
    constructor(tagName: string = '') {
        this.tagName = tagName
        // 判断是不是组件
        if (/^[A-Z]/.test(tagName)) {
            this.type = 'component'
        }
    }
}
