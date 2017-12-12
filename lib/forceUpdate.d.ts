export declare type UpdateFn = () => any;
export declare type addUpdateQueueList = UpdateFn[];
export declare function addUpdateQueue(list?: addUpdateQueueList, key?: any): void;
export default function forceUpdate(afterFn?: () => void): void;
