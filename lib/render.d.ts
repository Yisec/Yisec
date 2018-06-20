import Component from './Component';
import { YisecElement } from "./util";
/**
 * @param {any} Com
 * @param {*} props
 * @param {HTMLElement} dom
 * @returns {Component}
 */
export default function render(Com: Component | Function | string, props: any, dom: YisecElement, option?: {}): Component;
