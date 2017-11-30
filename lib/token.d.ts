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
/**
 * 字符串转token
 *
 * @param {string} [str='']
 * @returns {TokenElement[]}
 */
export declare function getToken(str?: string): TokenElement[];
export declare function toAST(token?: TokenElement[], template?: string): ASTNode;
