import FVEvents from "./FVEvents";
export class VirtualDOM {
    constructor(parent) {
        this.exprs = [];
        this.events = new FVEvents();
        this.children = [];
        this.ctxs = [];
        this.unmounted = false;
        this.classNames = {};
        if (parent) {
            this.parent = parent;
            this.parent.children.push(this);
        }
    }
    unmount() {
        this.exprs.forEach(fn => fn());
        (this.dom instanceof HTMLElement) && this.events.off(this.dom);
        this.component && this.component.__willUnmount();
        this.unmounted = true;
    }
}
export class TokenElement {
    constructor(type, index, value, origin = value, isExpr = false) {
        this.type = type;
        this.index = index;
        this.value = value;
        this.origin = origin;
        this.isExpr = isExpr;
    }
}
/**
 * AST节点
 * @class ASTNode
 */
export class ASTNode {
    constructor(tagName = '') {
        this.children = []; // 子节点
        this.props = {}; // props
        this.type = 'element'; // 节点类型
        this.exprs = [];
        this.isSVG = false; // 是不是svg节点
        this.tagName = tagName;
        // 判断是不是组件
        if (/^[A-Z]/.test(tagName)) {
            this.type = 'component';
        }
    }
}
