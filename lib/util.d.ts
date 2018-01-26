import Component from "./Component";
import { ASTNode } from "./d";
/**
 * 获取数据类型
 * @param arg
 */
export declare function getType(arg: any): string;
export declare function isFunction(...args: any[]): boolean;
export declare function isArray(...args: any[]): boolean;
export declare function isObject(...args: any[]): boolean;
export declare function isString(...args: any[]): boolean;
export declare function isBool(...args: any[]): boolean;
export declare function isPromise(...args: any[]): boolean;
/**
 * 转classname
 * @param v
 */
export declare function toClassNames(v: any): string;
/**
 * 含有appendChild的方法的对象
 */
export interface YisecElement {
    appendChild: (child: Node) => Node;
}
export declare function ST(fn: () => void, time: number): void;
export declare function uniqueArr<T>(arr?: T[]): T[];
export declare function merge(...anys: any[]): any;
/**
 * 绑定this
 * @param fn
 * @param ctx
 */
export declare function bindContext(fn: any, ctx: object): any;
export declare function uuid(len?: number): string;
export declare function getComponent(name?: string, ctxs?: any[]): any;
export declare function getParentCtx(ctxs?: any[]): Component;
export declare function resortArr(arr?: any[], keys?: any[]): any[];
export declare function isComponent(component: any, ast: ASTNode): boolean;
