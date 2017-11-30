import Component from './Component'
import toAST from './ast'
import transform from './transform'
import { observer, addObserve, autorun } from './autorun'
import { FElement } from "util";

/**
 * @param {any} Com 
 * @param {*} props 
 * @param {HTMLElement} dom 
 * @returns {Component} 
 */
export default function render(Com: typeof Component, props: any, dom: FElement, vdom?) :Component {
    const ctx = <Component>new Com()
    // state 与 props 属性不可被更改
    Object.defineProperty(ctx, 'state', {
        writable: false,
        enumerable: true,
        value: observer(ctx.state, { deep: true }),
    })
    
    Object.defineProperty(ctx, 'props', {
        writable: false,
        enumerable: true,
        value: observer(props),
    })
    // 处理需要有个autorun包裹，然后
    // 需要obersev
    Object.keys(ctx.computed).forEach(key => {
        addObserve(ctx, key, ctx.computed[key].call(ctx)) 
        // 待收集依赖
        autorun(() => {
            ctx[key] = ctx.computed[key].call(ctx)
        })
    })
    
    ctx.willMount()

    const ast = toAST(ctx.render())
    ast.ctx = ctx
    transform(ast, dom, [ctx, ctx.state, ctx.props], vdom)
    
    ctx.didMount()
    return ctx
}

