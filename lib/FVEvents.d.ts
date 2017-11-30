/**
 * FVEvents 被用来统一处理事件监听
 */
export declare type Item = [string, any];
export default class FVEvents {
    private cache;
    /**
     * 事件绑定
     */
    on(element: HTMLElement, key: string, fn: any): this;
    /**
     * 事件移除
     */
    off(element: HTMLElement, key?: string, fn?: any): this;
}
