import Component from './Component'
import render from './render'
import { autorun, observer, Depends, isObserve, addObserve, ObserveOptions, observerDeep } from './autorun'
import register, { registerComponents } from "./register";
import { addEventAlias } from "./eventAlias";
import { addPipe } from "./execExpr";
import forceUpdate, {addUpdateQueue} from "./forceUpdate";
import { VirtualDOM } from "./d";
import { FElement } from "./util";
import router, {RouterConfig} from './router';

export default {
    Component,
    render,
    autorun,
    observer,
    isObserve,
    addObserve,
    observerDeep,
    register,
    addEventAlias,
    registerComponents,
    addPipe,
    forceUpdate,
    addUpdateQueue,
    router,
}

export {
    Component,
    render,
    autorun,
    observer,
    isObserve,
    addObserve,
    observerDeep,
    register,
    addEventAlias,
    registerComponents,
    addPipe,
    forceUpdate,
    addUpdateQueue,
    router,
}
