import { VirtualDOM } from "./d";
export interface LifeCycle {
    willMount(): any;
    didMount(): any;
    willUnmount(): any;
}
export interface Refs {
    [propName: string]: HTMLElement;
}
export default class Component implements LifeCycle {
    static defaultProps: object;
    static getContext: Function;
    template: string;
    state: any;
    props: any;
    components: {};
    parent: Component;
    children: Component[];
    refs: Refs;
    vdom: VirtualDOM;
    computed: object;
    context: any;
    constructor(context: any, parent: Component, fn: any);
    render(): string;
    $emit: (key: any, ...data: any[]) => void;
    $emitChildren: (key: any, ...data: any[]) => void;
    $emitSiblings: (key: any, ...data: any[]) => void;
    willMount(): void;
    didMount(): void;
    didUpdate(): void;
    __willUnmount(): void;
    willUnmount(): void;
}
