export declare type FX = () => any;
export declare type addUpdateQueueList = FX[];
export declare function addUpdateQueue(list?: addUpdateQueueList, key?: any): void;
export default function forceUpdate(afterFn?: () => void): void;
