import Component from "./Component";
import FVEvents from "./FVEvents";
export interface EventAlias {
    eventName: string;
    listener: any;
}
export interface Props {
    [propName: string]: any;
}
export declare type exprDestroyFn = () => void;
export declare class VirtualDOM {
    exprs: exprDestroyFn[];
    events: FVEvents;
    parent: VirtualDOM;
    children: VirtualDOM[];
    ctxs: any[];
    component: Component;
    unmounted: boolean;
    dom: Node;
    ast: ASTNode;
    reRender: any;
    constructor(parent?: VirtualDOM);
    unmount(): void;
}
export declare class TokenElement {
    type: string;
    index: number;
    value: string;
    origin: string;
    constructor(type: string, index: number, value: string, origin?: string);
}
/**
 * AST节点
 * @class ASTNode
 */
export declare class ASTNode {
    tagName: string;
    parent: ASTNode;
    children: ASTNode[];
    props: any;
    type: string;
    expr: string;
    exprs: never[];
    value: string;
    dom: Node;
    ctx: object;
    constructor(tagName?: string);
}
