import { getType, bindContext, uuid, isArray } from "./util";
import { addExecQueue } from "./forceUpdate";
export class Observe {
}
const defaultCurrent = () => () => { };
// observer数据get时，进行依赖手机
let currentFn = defaultCurrent;
/**
 * 依赖
 * @class Depends
 */
export class Depends {
    constructor(root, key) {
        this.list = [];
        this.root = root;
        this.key = key;
    }
    collect() {
        if (currentFn !== defaultCurrent) {
            currentFn((fn) => {
                // 获取依赖函数，并返回移除依赖函数
                !this.list.includes(fn) && this.list.push(fn);
                return () => {
                    this.list = this.list.filter(i => i !== fn);
                };
            });
        }
    }
    run() {
        // debugger
        // console.log(this.key, this.list)
        addExecQueue(this.list);
    }
}
class ObserveId {
    constructor() {
        this.id = uuid() + ObserveId.id++;
        this.keys = [];
    }
}
ObserveId.id = 0;
function addObserverId(newObj) {
    if (newObj.__observeId__ instanceof ObserveId) {
        return;
    }
    Object.defineProperty(newObj, '__observeId__', {
        value: new ObserveId(),
        configurable: false,
        writable: false,
        enumerable: false,
    });
}
export function isObserve(obj) {
    return (obj instanceof Observe) || (isArray(obj) && obj.__observe__);
}
export function addObserve(ctx, key, defaultValue = ctx[key], options = { deep: false }) {
    addObserverId(ctx);
    // 这里隐含了一个bug，如果state,prop被更改，就懵逼了，因此设置state、props writable: false
    if (ctx.__observeId__.keys.includes(key)) {
        ctx[key] = defaultValue; // 数据已监听，则更新
        return;
    }
    else {
        ctx.__observeId__.keys.push(key);
    }
    let value = bindContext(defaultValue, ctx);
    // 依赖此key的函数
    const depends = new Depends(ctx, key);
    let isResetValue = true;
    // 默认bind this
    Object.defineProperty(ctx, key, {
        get() {
            // 收集依赖
            depends.collect();
            // 只有在被获取的时候，才会对数据进行observe
            if (isResetValue && options.deep) {
                value = observer(value, Object.assign({}, options, { parentDepend: depends }));
            }
            isResetValue = false;
            return value;
        },
        set(newValue) {
            isResetValue = true;
            value = bindContext(newValue, ctx);
            // 触发依赖函数更新
            depends.run();
        },
        enumerable: true,
    });
}
/**
 * 监听数组
 * @param arr
 * @param parentDepends
 */
export function observeArr(arr = [], options) {
    const newArr = arr.map(item => observer(item));
    Object.defineProperty(newArr, '__observe__', {
        value: true,
        enumerable: false,
        writable: false,
        configurable: false,
    });
    [
        'splice',
        'push',
        'shift',
        'unshift',
        'pop',
    ].forEach(key => {
        const value = [][key].bind(newArr);
        // 如果数组长度被修改，通知他的父元节点
        Object.defineProperty(newArr, key, {
            get() {
                return (...args) => {
                    if (options.deep) {
                        if (key == 'push' || key == 'unshift') {
                            args = args.map(i => observer(i));
                        }
                        else if (key == 'splice') {
                            args = args.slice(0, 2).concat(args.slice(2).map(i => observer(i)));
                        }
                    }
                    const result = value(...args);
                    // 对于数组的变化，直接出发调用数组的依赖
                    console.log('arr change', key, options.parentDepend);
                    options.parentDepend && options.parentDepend.run();
                    // console.time('forceUpdate11')
                    window.time1 = Date.now();
                    return result;
                };
            },
            enumerable: false,
        });
    });
    return newArr;
}
/**
 * 监听对象
 * @param obj
 * @param init
 */
export function observeObj(obj = {}, options) {
    let newObj = new Observe();
    // 添加id
    addObserverId(newObj);
    Object.keys(obj).forEach(key => {
        addObserve(newObj, key, obj[key], options);
    });
    return newObj;
}
/**
 * 构造一个新的observe对象
 * @param {objet} obj
 * @returns
 */
export function observer(obj, options = { deep: false }) {
    if (isObserve(obj)) {
        return obj;
    }
    switch (getType(obj)) {
        case 'array':
            return observeArr(obj, options);
        case 'object':
            return observeObj(obj, options);
        default:
            return obj;
    }
}
export function observerDeep(obj) {
    return observer(obj, { deep: true });
}
/**
 * 接受函数，当依赖的数据发生变化后，会立即执行函数
 *
 * @param {function} fn
 * @returns
 */
export function autorun(fn, str, callback) {
    let destoryDepends = [];
    // 销毁依赖
    const destory = () => {
        destoryDepends.forEach(fn => fn());
        destoryDepends = [];
    };
    const wrapFn = () => {
        // console.log('autorun::', str, wrapFn.str, wrapFn.callback, wrapFn)
        destory(); // 销毁上次依赖监听
        // 收集本次依赖
        currentFn = (getDestory) => {
            destoryDepends.push(getDestory(wrapFn));
            return wrapFn;
        };
        fn();
        // 重置回默认值
        currentFn = defaultCurrent;
    };
    wrapFn.str = str;
    wrapFn.callback = callback;
    // 立即执行
    wrapFn();
    return destory;
}
