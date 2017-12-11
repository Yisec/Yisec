import { VirtualDOM } from './d'
import { handleLeave } from "./domLifeCycle";

// 组件卸载，其实不应该一个元素一个元素的从dom移除，而应该整体性移除
// 因为AST与真实的dom之间还存在差距，因此我们在AST的基础之上，根据指令等其他条件又生成了一个真实DOM的映射树
// 用来处理DOM的增删
// 卸载元素/组件的时候，需要卸载相对应的事件/与数据监听
export function unmountNode(vdom: VirtualDOM, removeDOM = true) {
    // 如果当前节点有真实dom映射，则子节点不再操作dom移除，提升性能
    vdom.children.forEach(i => unmountNode(i, removeDOM && !vdom.dom ))
    vdom.unmount()
    // 如果vdom上有leave leaveTime
    if (removeDOM && vdom.dom && handleLeave(vdom)) {
        vdom.dom.parentElement && vdom.dom.parentElement.removeChild(vdom.dom)
    }
    if (vdom.parent) {
        vdom.parent.children = vdom.parent.children.filter(i => i !== vdom)
    }
}

/**
 * 卸载子元素
 * @param {any} ele
 */
export function unmountChildren(vdom: VirtualDOM) {
    vdom.children.forEach(child => {
        unmountNode(child)
    })
    vdom.children = []
}
