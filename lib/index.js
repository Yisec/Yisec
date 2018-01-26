import Component from './Component';
import render from './render';
import { autorun, observer, isObserve, addObserve, observerDeep } from './autorun';
import register, { registerComponents } from "./register";
import { addEventAlias } from "./event/alias";
import { addPipe } from "./execExpr";
import forceUpdate from "./forceUpdate";
import router from './plugins/router';
import cssModule from './plugins/cssModule';
export default {
    observer,
    isObserve,
    addObserve,
    observerDeep,
    autorun,
    Component,
    render,
    register,
    registerComponents,
    addEventAlias,
    addPipe,
    forceUpdate,
    // plugins
    router,
    cssModule,
};
export { observer, isObserve, addObserve, observerDeep, autorun, Component, render, register, registerComponents, addEventAlias, addPipe, forceUpdate, 
// plugins
router, cssModule, };
