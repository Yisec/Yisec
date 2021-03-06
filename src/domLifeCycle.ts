import { VirtualDOM } from './d'
import handleClass, { testClass, getClassProperties } from "./property/handleClass";

/**
 * dom加载成功后，同步做某些事情
 * @param vdom
 */
export function handleEnter(vdom: VirtualDOM) {
    if (vdom.dom && testClass(vdom, 'enter')) {
        getClassProperties('enter').forEach(key => {
            handleClass(vdom, vdom.ctxs, key, 'enter')
        })
    }
}

/**
 * 判断dom是否可以异步卸载
 * @param vdom
 */
export function handleLeave(vdom: VirtualDOM) : boolean|Promise<void> {
    const { leaveTime } = vdom.ast.props
    if (vdom.dom && leaveTime && testClass(vdom, 'leave')) {
        // vdom.dom.className += ` ${leaveClass}`
        getClassProperties('leave').forEach(key => {
            handleClass(vdom, vdom.ctxs, key, 'leave')
        })

        return new Promise(res => {
            setTimeout(res, Number(leaveTime))
        })
    }
    return true
}
