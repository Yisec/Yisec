import { isFunction } from "./util";
import { VirtualDOM } from "./d";
import { unmountNode } from "./unmount";
export default class Component {
    constructor() {
        // 模板
        this.template = '';
        // 状态
        this.state = {};
        // props
        this.props = {};
        // 子组件
        this.components = {};
        // 子组件
        this.children = [];
        // 指定dom
        this.refs = {};
        this.vdom = new VirtualDOM();
        // 方便template直接获取经过复杂计算的数据
        this.computed = {};
        // 向父组件派发事件
        this.$emit = (key, ...data) => {
            let parent = this.parent;
            let stopBubble = false;
            while (!stopBubble && parent) {
                const fn = parent[key];
                if (isFunction(fn)) {
                    stopBubble = fn.call(parent, ...data) === false;
                }
                parent = parent.parent;
            }
        };
        // 向子组件派发事件
        this.$emitChildren = (key, ...data) => {
            function children(node) {
                node.children.forEach(item => {
                    const fn = item[key];
                    isFunction(fn) && fn.call(item, ...data);
                    children(item);
                });
            }
            children(this);
        };
        // 向同级组件派发事件
        this.$emitSiblings = (key, ...data) => {
            this.parent && this.parent.children.forEach(item => {
                if (item !== this) {
                    const fn = item[key];
                    isFunction(fn) && fn.call(item, ...data);
                }
            });
        };
    }
    render() {
        return this.template;
    }
    willMount() { }
    didMount() { }
    didUpdate() { }
    // 内部方法，触发组件卸载
    __willUnmount() {
        this.children.forEach(com => com.__willUnmount());
        this.willUnmount();
        unmountNode(this.vdom);
        this.children = [];
        if (this.parent) {
            this.parent.children = this.parent.children.filter(i => i !== this);
        }
    }
    willUnmount() { }
}
Component.defaultProps = {};
