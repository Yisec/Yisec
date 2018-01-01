import { registerComponents } from "./register";
import Component from "./Component";
import { ASTNode } from "./d";

/**
 * 获取数据类型
 * @param arg 
 */
export function getType(arg: any): string {
    return Object.prototype.toString.call(arg).match(/\s(.+)]/)[1].toLowerCase()
}

export function isFunction(...args) {
    return args.every(arg => getType(arg) === 'function')
}

export function isArray(...args) {
    return args.every(arg => getType(arg) === 'array')
}

export function isObject(...args) {
    return args.every(arg => getType(arg) === 'object')
}

export function isString(...args) {
    return args.every(arg => getType(arg) === 'string')
}

export function isBool(...args) {
    return args.every(arg => getType(arg) === 'boolean')
}

export function isPromise(...args) {
    return args.every(arg => getType(arg) === 'promise')
}

/**
 * 转classname
 * @param v 
 */
export function toClassNames(v: any): string {
    switch (getType(v)) {
        case 'array': {
            return v.map(toClassNames).join(' ')
        }
        case 'object': {
            return Object.keys(v).map(key => {
                return v[key] ? key : ''
            }).join(' ')
        }
        case 'string': {
            return v
        }
        default: {
            return ''
        }
    }
}

/**
 * 含有appendChild的方法的对象
 */
export interface FElement {
    appendChild: (child: Node) => Node
}

// setTimeout的封装
export function ST(fn: () => void, time: number) {
    if (time > 0) {
        setTimeout(fn, time)
    } else {
        fn()
    }
}

// 移除重复元素
export function uniqueArr(arr = []) {
    const newArr = []
    arr.forEach(item => {
        if (!newArr.includes(item)) {
            newArr.push(item)
        }
    })
    return newArr
}

export function merge(...anys) {
    const base = anys[0]
    anys.slice(1).forEach(any => {
        Object.keys(any).forEach(key => {
            if (base[key] === undefined) {
                base[key] = any[key]
            }
        })
    })
    return base
}

/**
 * 绑定this
 * @param fn
 * @param ctx
 */
export function bindContext(fn: any, ctx: object) :any {
    if (getType(fn).includes('function')) {
        fn = fn.bind(ctx)
    }
    return fn
}

export function uuid(len = 8):string {
    const S = '0123456789qwertyuioopasdfghjklzxcvbnmQWERTYUIOOPASDFGHJKLZXCVBNM'
    const LEN = S.length
    return ' '.repeat(len).split('').map(() => S[Math.round(Math.random() * LEN)]).join('')
}

export function getComponent(name: string = '', ctxs: any[] = []) {
    for (let i=0; i< ctxs.length; i++) {
        if (ctxs[i].components && ctxs[i].components[name]) {
            return ctxs[i].components[name]
        }
    }
    return registerComponents[name]
}

export function getParentCtx(ctxs: object[] = []): Component {
    for (let i=0; i< ctxs.length; i++) {
        if (ctxs[i] instanceof Component) {
            return ctxs[i]
        }
    }
}

// 如果arr中存在keys中的元素，那么keys中的元素排序提前
export function resortArr(arr:any[] = [], keys:any[] = []) {
    const newArr: any[] = []
    keys.forEach(i => {
        if (arr.includes(i)) {
            newArr.push(i)
        }
    })
    arr.forEach(i => {
        if (!keys.includes(i)) {
            newArr.push(i)
        }
    })
    return newArr
}

export function isComponent(component, ast: ASTNode) {
    if (isPromise(component) || isFunction(component) || isString(component))  {
        return true
    }
    console.error(component, `${ast.tagName} should be a Component!!! 您可以在组件的Components属性中添加子组件，或者通过Fv.register注册全局组件`)
    return false
}
