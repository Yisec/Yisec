import { getType, isFunction } from "./util";

export interface LifeCycle {
    willMount()
    didMount()
    didUpdate()
    willUnmount()
}

// 对象
export interface Refs {
    [propName: string]: HTMLElement;
}

export default class Component implements LifeCycle {
    static defaultProps: object = {}
    // 模板
    template = ''
    // 状态
    state: object = {}
    // props
    props: object = {}
    // 子组件
    components = {}
    // 父组件
    parent: Component 
    // 子组件
    children: Component[]= [] 
    // 指定dom
    refs: Refs = {} 
    // 方便template直接获取经过复杂计算的数据
    computed: object = {} 
    render() : string {
        return this.template
    }
    // 触发props上的事件
    $emit = (key, ...data) => {
        let parent = this.parent
        let stopBubble = false
        while (!stopBubble && parent) {
            const fn = parent.emit[key] || parent[key]
            if (isFunction(fn)) {
                stopBubble = fn.call(parent,...data) === false
            }
            parent = parent.parent
        }
    }
    $emitChildren = (key, ...data) => {
        function children(node) {
            node.children.forEach(item => {
                const fn = item.emit[key] || item[key]
                isFunction(fn) && fn.call(item, ...data)
                children(item)
            })
        }
        children(this)
    }
    $emitSiblings = (key, ...data) => {
        this.parent && this.parent.children.forEach(item => {
            if (item !== this) {
                const fn = item.emit[key] || item[key]
                isFunction(fn) && fn.call(item, ...data)
            }
        })
    }
    emit = {}
    willMount(){}
    didMount(){}
    didUpdate(){}
    // 内部方法，触发组件卸载
    __willUnmount() {
        this.children.forEach(com => com.__willUnmount())
        this.willUnmount()
        this.children = []
        if (this.parent) {
            this.parent.children = this.parent.children.filter(i => i !== this)
        }
    }
    willUnmount(){}
}
