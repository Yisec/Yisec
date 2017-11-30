import { ASTNode, TokenElement } from "./d";
/**
 * 字符串转token
 *
 * @param {string} [str='']
 * @returns {TokenElement[]}
 */
export declare function getToken(str?: string): TokenElement[];
export declare function toAST(token?: TokenElement[], template?: string): ASTNode;
export default function (template?: string): ASTNode;
