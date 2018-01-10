import { isFunction } from "./../util";
import { on, off } from './global'

export type Item = [string, any]
const BubbleEventList = [
    'click', 'dblclick',
    'touchstart', 'touchmove', 'touchend',
    'mousedown', 'mousemove', 'mouseup',
    'keydown', 'keyup',
]

export default class YSEvents {
    private cache: Item[] = []
    // 事件绑定
    on(element: HTMLElement, key: string, fn) {
        if (!isFunction(fn)) {
            console.error(fn, `should be a Function`)
            return
        }
        // 可冒泡的事件，绑定到documentElement上去，避免重复绑定事件
        if (BubbleEventList.includes(key)) {
            on(element, key, fn)
        } else {
            this.cache.push([key, fn])
            element.addEventListener(key, fn)
        }
        return this
    }
    // 事件移除
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
        off(element, key, fn)
        return this
    }
}
