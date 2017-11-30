declare type Item = [string, any];
declare class FVEvents {
    private cache;
    on(element: HTMLElement, key: string, fn: any): this;
    off(element: HTMLElement, key: any, fn: any): this;
}
