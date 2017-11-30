import { handleLeave } from "./domLifeCycle";
// 因为AST与真实的dom之间还存在差距，因此我们在AST的基础之上，根据指令等其他条件又生成了一个真实DOM的映射树
// 用来处理DOM的增删
// 卸载元素/组件的时候，需要卸载相对应的事件/与数据监听
export function unmountNode(vdom, removeDOM = true) {
    const _removeDOM = handleLeave(vdom);
    vdom.children.forEach(i => unmountNode(i, removeDOM));
    vdom.unmount();
    // 如果vdom上有leave leaveTime
    removeDOM && _removeDOM && vdom.dom && vdom.dom.parentElement && vdom.dom.parentElement.removeChild(vdom.dom);
    if (vdom.parent) {
        vdom.parent.children = vdom.parent.children.filter(i => i !== vdom);
    }
}
/**
 * 卸载子元素
 * @param {any} ele
 */
export function unmountChildren(node) {
    node.children.forEach(child => {
        unmountNode(child);
    });
    node.children = [];
}
