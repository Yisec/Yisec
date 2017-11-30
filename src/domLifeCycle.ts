import { VirtualDOM } from './d'
import handleClass, { testClass } from "./handleClass";

/**
 * 判断dom是否可以异步卸载
 * @param vdom 
 */
export function handleLeave(vdom: VirtualDOM) : boolean {
    const { leaveTime } = vdom.ast.props
    if (vdom.dom && leaveTime && testClass(vdom, 'leave')) {
        // vdom.dom.className += ` ${leaveClass}`
        Object.keys(vdom.ast.props).forEach(key => {
            handleClass(vdom, vdom.ctxs, key, 'leave')
        })

        setTimeout(() => {
            vdom.dom && vdom.dom.parentElement && vdom.dom.parentElement.removeChild(vdom.dom)
        }, +leaveTime)
        return false
    }
    return true
}

/**
 * dom加载成功后，同步做某些事情
 * @param vdom 
 */
export function handleEnter(vdom: VirtualDOM) {
    if (vdom.dom && testClass(vdom, 'enter')) {
        Object.keys(vdom.ast.props).forEach(key => {
            handleClass(vdom, vdom.ctxs, key, 'enter')
        })
    }
}
