import Component from "./Component";
import FVEvents from "./FVEvents";

export interface EventAlias {
    eventName: string
    listener: any
}

export interface Props {
    [propName: string]: any
}

export type exprDestroyFn = ()=>void

export class VirtualDOM {
    exprs: exprDestroyFn[] = []
    events = new FVEvents()
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
    unmount() {
        this.exprs.forEach(fn => fn())
        ;(this.dom instanceof HTMLElement) && this.events.off(this.dom)
        this.component && this.component.__willUnmount()
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
