import handleClass, { testClass } from "./property/handleClass";
/**
 * 判断dom是否可以异步卸载
 * @param vdom
 */
export function handleLeave(vdom) {
    const { leaveTime } = vdom.ast.props;
    if (vdom.dom && leaveTime && testClass(vdom, 'leave')) {
        // vdom.dom.className += ` ${leaveClass}`
        Object.keys(vdom.ast.props).forEach(key => {
            handleClass(vdom, vdom.ctxs, key, 'leave');
        });
        return new Promise(res => {
            setTimeout(res, Number(leaveTime));
        });
    }
    return true;
}
/**
 * dom加载成功后，同步做某些事情
 * @param vdom
 */
export function handleEnter(vdom) {
    if (vdom.dom && testClass(vdom, 'enter')) {
        Object.keys(vdom.ast.props).forEach(key => {
            handleClass(vdom, vdom.ctxs, key, 'enter');
        });
    }
}
