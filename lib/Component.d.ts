export interface LifeCycle {
    willMount(): any;
    didMount(): any;
    didUpdate(): any;
    willUnmount(): any;
}
export interface Refs {
    [propName: string]: HTMLElement;
}
export default class Component implements LifeCycle {
    static defaultProps: object;
    template: string;
    state: object;
    props: object;
    components: {};
    parent: Component;
    children: Component[];
    refs: Refs;
    computed: object;
    render(): string;
    $emit: (key: any, ...data: any[]) => void;
    $emitChildren: (key: any, ...data: any[]) => void;
    $emitSiblings: (key: any, ...data: any[]) => void;
    emit: {};
    willMount(): void;
    didMount(): void;
    didUpdate(): void;
    __willUnmount(): void;
    willUnmount(): void;
}
