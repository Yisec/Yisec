import { execExpr } from "../execExpr";
import { unmountNode } from "../unmount";
import { addElement } from "../transform";
/**
 * 处理ys:if命令
 *
 * @param {HTMLElement} parent
 * @param {any} node
 * @param {array} ctxs
 */
export default function handleIf(parent, node, ctxs, parentVdom) {
    let collect = [];
    let commentHook = document.createComment('ys:if 占位');
    parent.appendChild(commentHook);
    parentVdom.exprs.push(execExpr(node.props['ys:if'], ctxs, (newValue, oldValue) => {
        if (newValue) {
            addElement((ele, vdom) => {
                vdom && collect.push(vdom);
                ele && commentHook.parentElement && commentHook.parentElement.insertBefore(ele, commentHook);
            }, node, ctxs, parentVdom);
        }
        else {
            // 如果node
            collect.forEach(i => unmountNode(i));
            collect = [];
        }
    }));
}
