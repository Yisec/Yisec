export declare type Item = [string, any];
export default class YSEvents {
    private cache;
    on(element: HTMLElement, key: string, fn: any): this | undefined;
    off(element: HTMLElement, key?: string, fn?: any): this;
}
