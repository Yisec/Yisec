import Component from "./Component";
import YSEvents from "./event/index";
export interface EventAlias {
    eventName: string;
    listener: any;
}
export interface Props {
    [propName: string]: any;
}
export declare type exprDestroyFn = () => void;
export interface DOMLifeCycle {
    oncreate(): void;
    onunmount(): void;
}
export declare class VirtualDOM implements DOMLifeCycle {
    exprs: exprDestroyFn[];
    events: YSEvents;
    parent: VirtualDOM;
    children: VirtualDOM[];
    ctxs: any[];
    component: Component;
    unmounted: boolean;
    classNames: {};
    dom: Node;
    ast: ASTNode;
    reRender: any;
    constructor(parent?: VirtualDOM);
    oncreate(): void;
    onunmount(): void;
    unmount(): void;
}
export declare class TokenElement {
    type: string;
    index: number;
    value: string;
    origin: string;
    isExpr: boolean;
    constructor(type: string, index: number, value: string, origin?: string, isExpr?: boolean);
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
    isSVG: boolean;
    ctx: object;
    constructor(tagName?: string);
}
