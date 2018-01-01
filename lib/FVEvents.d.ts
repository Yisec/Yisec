/**
 * FVEvents 被用来统一处理事件监听
 * 待对事件统一代理处理，类jQuery形式
 * 现在，我们还是没有对事件进行全局挂载处理，而是在每个dom上绑定事件，性能较差，待优化
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
