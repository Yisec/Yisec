import Component from "./Component";
/**
 * 所有注册组件缓存
 */
export declare const registerComponents: {};
/**
 * 添加全局组件
 * @param name
 * @param Com
 */
export default function register(name: string, Com: typeof Component): void;
