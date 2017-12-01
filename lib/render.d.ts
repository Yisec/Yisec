import Component from './Component';
import { FElement } from "./util";
/**
 * @param {any} Com
 * @param {*} props
 * @param {HTMLElement} dom
 * @returns {Component}
 */
export default function render(Com: typeof Component, props: any, dom: FElement, vdom?: any): Component;
