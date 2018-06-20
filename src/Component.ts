import { isFunction } from "./util";
import { VirtualDOM } from "./d";
import { unmountNode } from "./unmount";

export interface LifeCycle {
    willMount()
    didMount()
    willUnmount()
}

// 对象
export interface Refs {
    [propName: string]: HTMLElement;
}

export default class Component implements LifeCycle {
    static defaultProps: object = {}
    static getContext: Function
    // 模板
    template = ''
    // 状态
    state: any = {}
    // props
    props: any = {}
    // 子组件
    components = {}
    // 父组件
    parent: Component
    // 子组件
    children: Component[]= []
    // 指定dom
    refs: Refs = {}
    vdom = new VirtualDOM()
    // 方便template直接获取经过复杂计算的数据
    computed: object = {}
    // 获取上下文，context不可以不更改，context用来给所有的子组件提供上下文环境
    context: any = null

    constructor(context, parent: Component, fn) {
        this.parent = parent
        this.context = context
        // 传递context
        if (!this.context && isFunction(fn) && isFunction(fn.getContext)) {
            this.context = fn.getContext()
        }
    }

    render() : string {
        return this.template
    }
    // 向父组件派发事件
    $emit = (key, ...data) => {
        let parent = this.parent
        let stopBubble = false
        while (!stopBubble && parent) {
            const fn = parent[key]
            if (isFunction(fn)) {
                stopBubble = fn.call(parent,...data) === false
            }
            parent = parent.parent
        }
    }
    // 向子组件派发事件
    $emitChildren = (key, ...data) => {
        function children(node) {
            node.children.forEach(item => {
                const fn = item[key]
                isFunction(fn) && fn.call(item, ...data)
                children(item)
            })
        }
        children(this)
    }
    // 向同级组件派发事件
    $emitSiblings = (key, ...data) => {
        this.parent && this.parent.children.forEach(item => {
            if (item !== this) {
                const fn = item[key]
                isFunction(fn) && fn.call(item, ...data)
            }
        })
    }
    willMount(){}
    didMount(){}
    didUpdate(){}
    // 内部方法，触发组件卸载
    __willUnmount() {
        this.children.forEach(com => com.__willUnmount())
        this.willUnmount()
        unmountNode(this.vdom)
        this.children = []
        if (this.parent) {
            this.parent.children = this.parent.children.filter(i => i !== this)
        }
    }
    willUnmount(){}
}
