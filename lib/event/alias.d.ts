declare const eventAlias: {
    enter: (fn: any) => {
        eventName: string;
        listener: (event: KeyboardEvent, ...args: any[]) => void;
    }[];
    up: (fn: any) => {
        eventName: string;
        listener: (event: KeyboardEvent, ...args: any[]) => void;
    }[];
    down: (fn: any) => {
        eventName: string;
        listener: (event: KeyboardEvent, ...args: any[]) => void;
    }[];
    left: (fn: any) => {
        eventName: string;
        listener: (event: KeyboardEvent, ...args: any[]) => void;
    }[];
    esc: (fn: any) => {
        eventName: string;
        listener: (event: KeyboardEvent, ...args: any[]) => void;
    }[];
    ctrlEnter: (fn: any) => {
        eventName: string;
        listener: (event: KeyboardEvent, ...args: any[]) => void;
    }[];
    click: (fn: any) => {
        eventName: string;
        listener: any;
    }[];
};
/**
 * 添加事件别名
 * @param eventName
 * @param fn
 */
export declare function addEventAlias(eventName: string, fn: any): void;
export declare function delEventAlias(eventName: string): void;
export default eventAlias;
