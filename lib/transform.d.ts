import { VirtualDOM, ASTNode } from "./d";
import { FElement } from './util';
/**
 * 添加元素
 *
 * @param {function} appendFn
 * @param {any} node
 * @param {array} ctxs
 * @returns
 */
export declare function addElement(appendFn: any, ast: ASTNode, ctxs: any[], parentVdom: VirtualDOM): VirtualDOM;
/**
 * ast transform to node
 *
 * @param {any} ast
 * @param {HTMLElement} element
 * @param {anray} ctxs
 */
declare function transform(ast: ASTNode, element: FElement, ctxs: any[], parentVdom?: VirtualDOM): {
    children: (VirtualDOM | undefined)[];
};
export default transform;
