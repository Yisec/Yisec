export declare class Observe {
}
export declare type autorunFn = () => void;
export declare type DestoryFn = autorunFn;
export declare type GetDestory = (fn: autorunFn) => DestoryFn;
export declare type CurrentFn = (fn: GetDestory) => autorunFn;
/**
 * 依赖
 * @class Depends
 */
export declare class Depends {
    list: autorunFn[];
    root: any;
    key: any;
    constructor(root: any, key: any);
    collect(): void;
    run(): void;
}
export declare function isObserve(obj: any): any;
export declare function addObserve(ctx: any, key: string, defaultValue?: any, options?: ObserveOptions): void;
export interface ObserveOptions {
    parentDepend?: Depends;
    deep: boolean;
}
/**
 * 监听数组
 * @param arr
 * @param parentDepends
 */
export declare function observeArr(arr: never[] | undefined, options: ObserveOptions): any;
/**
 * 监听对象
 * @param obj
 * @param init
 */
export declare function observeObj(obj: {} | undefined, options: any): Observe;
/**
 * 构造一个新的observe对象
 * @param {objet} obj
 * @returns
 */
export declare function observer(obj: any, options?: ObserveOptions): any;
export declare function observerDeep(obj: any): any;
/**
 * 接受函数，当依赖的数据发生变化后，会立即执行函数
 *
 * @param {function} fn
 * @returns
 */
export declare function autorun(fn: () => void, str?: string, callback?: any): () => void;
