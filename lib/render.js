import Component from './Component';
import toAST from './parser/parseTemplate';
import transform from './transform';
import { observer, addObserve, autorun } from './autorun';
import { merge, isFunction, isString } from "./util";
/**
 * @param {any} Com
 * @param {*} props
 * @param {HTMLElement} dom
 * @returns {Component}
 */
export default function render(Com, props, dom, vdom) {
    if (isFunction(Com)) {
        // 如果函数没有继承Component，就把它当做render方法
        if (!(Com.prototype instanceof Component)) {
            const renderFn = Com;
            Com = class extends Component {
                constructor() {
                    super(...arguments);
                    this.render = renderFn;
                }
            };
        }
    }
    else if (isString(Com)) {
        const template = Com;
        Com = class extends Component {
            constructor() {
                super(...arguments);
                this.template = template;
            }
        };
    }
    else {
        console.error(`render first param should be a function`);
    }
    const ctx = new Com();
    // state 与 props 属性不可被更改
    Object.defineProperty(ctx, 'state', {
        writable: false,
        enumerable: true,
        value: observer(ctx.state, { deep: true }),
    });
    Object.defineProperty(ctx, 'props', {
        writable: false,
        enumerable: true,
        value: observer(merge(props, Com.defaultProps || {})),
    });
    // 处理需要有个autorun包裹，然后
    // 需要obersev
    Object.keys(ctx.computed).forEach(key => {
        addObserve(ctx, key, ctx.computed[key].call(ctx));
        // 待收集依赖
        ctx.vdom.exprs.push(autorun(() => {
            return ctx.computed[key].call(ctx);
        }, {
            callback: newValue => {
                ctx[key] = newValue;
            }
        }));
    });
    ctx.willMount();
    const ast = toAST(ctx.render());
    ast.ctx = ctx;
    transform(ast, dom, [ctx, ctx.state, ctx.props], ctx.vdom);
    ctx.didMount();
    return ctx;
}
