import { getType, bindContext, uuid, isArray, isFunction } from "./util";
import { addUpdateQueue } from "./forceUpdate";
import { OBSERVE_ID } from "./config";

export class Observe {}
export type autorunFn = () => void
export type DestoryFn = autorunFn
export type GetDestory = (fn: autorunFn) => DestoryFn
export type CurrentFn = (fn: GetDestory, depend: Depends) => autorunFn
const defaultCurrent = () => () => {}

// observer数据get时，进行依赖手机
let currentFn: CurrentFn = defaultCurrent

export function resetCurrentFn() {
    currentFn = defaultCurrent
}

/**
 * 依赖
 * @class Depends
 */
export class Depends {
    list: autorunFn[] = []
    root: any
    key: any
    constructor(root, key) {
        this.root = root
        this.key = key
    }
    collect() {
        if (currentFn !== defaultCurrent) {
            currentFn((fn) => {
                // 获取依赖函数，并返回移除依赖函数
                !this.list.includes(fn) && this.list.push(fn)
                return () => {
                    this.list = this.list.filter(i => i !== fn)
                }
            }, this)
        }
    }
    run(key?: string) {
        addUpdateQueue(this.list, this.key)
    }
}

class ObserveId {
    static id = 0
    id = uuid() + ObserveId.id++
    keys = []
}

function addObserverId(newObj) {
    if (newObj[OBSERVE_ID] instanceof ObserveId) {
        return
    }
    Object.defineProperty(newObj, OBSERVE_ID, {
        value: new ObserveId(),
        configurable: false,
        writable: false,
        enumerable: false,
    })
}

export function addObserve(ctx: any, key: string, defaultValue = ctx[key], options: ObserveOptions = { deep: false }) {
    addObserverId(ctx)
    // 这里隐含了一个bug，如果state,prop被更改，就懵逼了，因此设置state、props writable: false
    if (ctx[OBSERVE_ID].keys.includes(key)) {
        ctx[key] = defaultValue // 数据已监听，则更新
        return
    } else {
        ctx[OBSERVE_ID].keys.push(key)
    }

    let value = bindContext(defaultValue, ctx)
    // 依赖此key的函数
    const depends = new Depends(ctx, key)
    let isResetValue = true

    // 默认bind this
    Object.defineProperty(ctx, key, {
        get() {
            // 收集依赖
            depends.collect()
            // 只有在被获取的时候，才会对数据进行observe
            if (isResetValue && options.deep) {
                value = observer(value, { ...options, parentDepend: depends })
            }
            isResetValue = false

            return value
        },
        set(newValue) {
            // 每次值更新都会触发更新
            isResetValue = true
            value = bindContext(newValue, ctx)
            // 触发依赖函数更新
            depends.run()
        },
        enumerable: true,
    })
}

export interface ObserveOptions {
    parentDepend?: Depends
    deep: boolean
}

/**
 * 监听数组
 * @param arr
 * @param parentDepends
 */
export function observeArr(arr = [], options: ObserveOptions) {
    // 判断是否observe过
    if (isObserve(arr)) {
        return arr
    }

    const newArr = arr.map(item => observer(item))
    Object.defineProperty(newArr, OBSERVE_ID, {
        value: new ObserveId(),
        enumerable: false,
        writable: false,
        configurable: false,
    })

    ;[
        'splice',
        'push',
        'shift',
        'unshift',
        'pop',
    ].forEach(key => {
        const value = [][key].bind(newArr)
        // 如果数组长度被修改，通知他的父元节点
        Object.defineProperty(newArr, key, {
            get() {
                return (...args) => {
                    if (options.deep) {
                        if (key == 'push' || key == 'unshift') {
                            args = args.map(i => observer(i))
                        } else if (key == 'splice') {
                            args = args.slice(0, 2).concat(
                                args.slice(2).map(i => observer(i))
                            )
                        }
                    }
                    const result = value(...args)
                    // 对于数组的变化，直接出发调用数组的依赖
                    options.parentDepend && options.parentDepend.run()
                    return result
                }
            },
            enumerable: false,
        })
    });
    return newArr
}

/**
 * 监听对象
 * @param obj
 * @param init
 */
export function observeObj(obj = {}, options) {
    let newObj = new Observe()
    // 添加id
    addObserverId(newObj)

    Object.keys(obj).forEach(key => {
        addObserve(newObj, key, obj[key], options)
    })
    return newObj
}

export function isObserve(obj) {
    return (obj instanceof Observe) || (isArray(obj) && obj[OBSERVE_ID] instanceof Observe)
}

/**
 * 构造一个新的observe对象
 * @param {objet} obj
 * @returns
 */
export function observer(obj: any, options: ObserveOptions = {deep: false}) {
    if (isObserve(obj)) {
        return obj
    }
    switch (getType(obj)) {
        case 'array':
            return observeArr(obj, options)
        case 'object':
            return observeObj(obj, options)
        default:
            return obj
    }
}

export function observerDeep(obj: any) {
    return observer(obj, { deep: true })
}

export interface AutorunOption {
    callback?: any
    expr?: string
}

/**
 * 接受函数，当依赖的数据发生变化后，会立即执行函数
 *
 * @param {function} fn
 * @returns
 */
export function autorun(fn: ()=> void, options: AutorunOption = {}) {
    let destoryDepends: DestoryFn[] = []
    let depends: Depends[] = []
    // 销毁依赖
    const destory = () => {
        destoryDepends.forEach(fn => fn())
        destoryDepends = []
        depends.splice(0, depends.length)
    }

    const wrapFn = () => {
        // 显示之前依赖
        // console.log('before', depends.map(i => i.key))
        destory() // 销毁上次依赖监听
        // 收集本次依赖
        currentFn = (getDestory, depend: Depends) => {
            destoryDepends.push(getDestory(wrapFn))
            depends.push(depend)
            return wrapFn
        }
        const result = fn()
        // 重置回默认值
        resetCurrentFn()
        // 显示之前依赖
        // console.log('after', depends.map(i => i.key))
        isFunction(options.callback) && options.callback(result)
    }
    // wrapFn.options = options

    // 立即执行
    wrapFn()
    return destory
}
