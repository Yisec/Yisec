import Component from './Component'
import toAST from './parser/parseTemplate'
import transform from './transform'
import { observer, addObserve, autorun, isObserve } from './autorun'
import { FElement, merge, isFunction, isString } from "./util";
import { VirtualDOM } from './d';
import { COMPONENT_DOM_HOOK } from './config';

/**
 * @param {any} Com
 * @param {*} props
 * @param {HTMLElement} dom
 * @returns {Component}
 */
export default function render(Com: any, props: any, dom: FElement, vdom?:VirtualDOM) :Component {
    // 卸载原有dom上挂载的component
    if (
        dom instanceof HTMLElement
        && dom[COMPONENT_DOM_HOOK]
        && dom[COMPONENT_DOM_HOOK].vdom
        && !dom[COMPONENT_DOM_HOOK].vdom.unmounted
    ) {
        dom[COMPONENT_DOM_HOOK].__willUnmount()
    }

    // string/function -> Component
    if (isFunction(Com)) {
        // 如果函数没有继承Component，就把它当做render方法
        if (!(Com.prototype instanceof Component)) {
            const renderFn = Com
            Com = class extends Component {
                render(): string {
                  return renderFn()
                }
            }
        }
    } else if (isString(Com)) {
        const template = Com
        Com = class extends Component {
            template = template
        }
    } else {
        console.error(`render first param should be a function`)
    }

    const ctx = <Component>new Com()
    // 把组件实例挂载在dom上
    dom instanceof HTMLElement && (dom[COMPONENT_DOM_HOOK] = ctx)

    // state 与 props 属性不可被更改
    Object.defineProperty(ctx, 'state', {
        writable: false,
        enumerable: true,
        value: observer(ctx.state, { deep: true }),
    })

    Object.defineProperty(ctx, 'props', {
        writable: false,
        enumerable: true,
        value: observer(merge(props, Com.defaultProps || {})),
    })

    // 处理computed的key，将其observer化，并挂载在组件实例上
    // 处理需要有个autorun包裹，然后
    // 需要obersev
    Object.keys(ctx.computed).forEach(key => {
        addObserve(ctx, key, ctx.computed[key].call(ctx))
        // 待收集依赖
        ctx.vdom.exprs.push(
            autorun(() => {
                return ctx.computed[key].call(ctx)
            }, {
                callback: newValue => {
                    ctx[key] = newValue
                    return
                }
            })
        )
    })

    // 即将渲染
    ctx.willMount()

    // 渲染进行中
    const ast = toAST(ctx.render())
    ast.ctx = ctx
    transform(ast, dom, [ctx, ctx.state, ctx.props], ctx.vdom)

    // 渲染完毕
    ctx.didMount()
    return ctx
}
