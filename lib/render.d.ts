import Component from './Component';
import { FElement } from "./util";
import { VirtualDOM } from './d';
/**
 * @param {any} Com
 * @param {*} props
 * @param {HTMLElement} dom
 * @returns {Component}
 */
export default function render(Com: any, props: any, dom: FElement, vdom?: VirtualDOM): Component;
