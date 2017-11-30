/**
 * 所有注册组件缓存
 */
export const registerComponents = {};
/**
 * 添加全局组件
 * @param name
 * @param Com
 */
export default function register(name, Com) {
    registerComponents[name] = Com;
}
