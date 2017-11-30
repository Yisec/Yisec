import { VirtualDOM, ASTNode } from "./d";
import { FElement } from './util';
export declare function isComponent(component: any, ast: ASTNode): boolean;
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
