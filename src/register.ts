// 往Fv下挂载Component，方便调用
import Component from "./Component";

/**
 * 所有注册组件缓存
 */
export const registerComponents = {}

/**
 * 添加全局组件
 * @param name
 * @param Com
 */
export default function register(name: string, Com: typeof Component ) {
    registerComponents[name] = Com
}
