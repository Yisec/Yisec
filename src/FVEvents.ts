/**
 * FVEvents 被用来统一处理事件监听
 */

export type Item = [string, any]
export default class FVEvents {
    private cache: Item[] = []
    /**
     * 事件绑定
     */
    on(element: HTMLElement, key: string, fn) {
        this.cache.push([key, fn])
        element.addEventListener(key, fn)
        return this
    }
    /**
     * 事件移除
     */
    off(element: HTMLElement, key?: string, fn?) {
        this.cache = this.cache.filter(([_key, _fn]) => {
            if (
                (key === _key && fn === _fn) // 卸载指定key,fn的事件
                || (key === _key && fn === undefined) // 卸载指定key的事件
                || (key === undefined && fn === undefined) // 卸载所有事件
            ) {
                element.removeEventListener(_key, _fn)
                return false
            }
        })
        return this
    }
}
