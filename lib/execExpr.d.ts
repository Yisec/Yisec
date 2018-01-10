export declare function addPipe(...ctxs: any[]): void;
export declare function execExprIm(expr: string | undefined, ctxs: any[]): any;
/**
 * 执行表达式
 * @param {string} expr
 * @param {any[]} ctxs
 * @param {(result: any) => void} fn
 * @returns
 */
export declare function execExpr(expr: string, ctxs: any[], fn: (newValue: any, oldValue: any, execTime: number) => void): () => void;
