import YSEvents from "./event/index";
import { handleEnter, handleLeave } from "./domLifeCycle";
import { execExprOnce } from "./execExpr";
import { DIRECTIVE_EXPR } from "./config";
// sssdddd
export class VirtualDOM {
    constructor(parent) {
        this.exprs = [];
        this.events = new YSEvents();
        this.children = [];
        this.ctxs = [];
        this.unmounted = false;
        this.classNames = {};
        if (parent) {
            this.parent = parent;
            this.parent.children.push(this);
        }
    }
    // dom create 回调
    oncreate() {
        const { dom } = this;
        if (dom) {
            const { [`${DIRECTIVE_EXPR}oncreate`]: fnExpr = '' } = this.ast.props;
            const fn = execExprOnce(fnExpr, this.ctxs);
            // add enter class
            handleEnter(this);
            fn && fn(dom, this);
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
            const { [`${DIRECTIVE_EXPR}onunmount`]: fnExpr = '' } = this.ast.props;
            const fn = execExprOnce(fnExpr, this.ctxs);
            const resultResult = handleLeave(this);
            const fnResult = fn && fn(dom);
            // 判断执行结果中是否有Promise
            const pList = [resultResult, fnResult].filter(r => (r instanceof Promise));
            if (pList.length) {
                // 等待所有任务结束
                Promise.all(pList).then(() => {
                    dom.parentElement && dom.parentElement.removeChild(dom);
                });
            }
            else {
                dom.parentElement && dom.parentElement.removeChild(dom);
            }
        }
    }
    // 卸载vdom
    unmount() {
        // 关闭依赖追踪
        this.exprs.forEach(fn => fn());
        (this.dom instanceof HTMLElement) && this.events.off(this.dom);
        // 如果是组件，卸载组件
        this.component && this.component.__willUnmount();
        // vdom已卸载
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
