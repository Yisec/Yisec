import { autorun } from "./autorun";
import { isArray } from './util'
import parseExpr from './parser/parseExpr'
import parseFilter from './parser/parseFilter'

const pipes: any[] = []

export function addPipe(...ctxs) {
    pipes.push(...ctxs)
}

/**
 * pipe 上一个函数返回结果作为下一个函数的输入
 * @param fns
 */
function handlePipe(...fns) {
    return (arg) => {
        let result = arg
        fns.forEach(fn => {
            result = fn(result)
        })
        return result
    }
}

function getPipes(exprs, ctxs) {
    return handlePipe(
        ...exprs.map(expr => execExprIm(expr, [...ctxs, ...pipes, window]))
    )
}

/**
 * 从作用域链中获取指定key的值
 * @param key
 * @param ctxs
 */
function getValue(key, ctxs) {
    for (let i=0; i< ctxs.length; i++) {
        if (ctxs[i].hasOwnProperty(key) || ctxs[i][key] !== undefined) {
            return ctxs[i][key]
        }
    }
    if (key === 'true') {
        return true
    }
    if (key === 'false') {
        return false
    }
    return window[key]
}

export function execExprIm(expr: string = '', ctxs: any[]) {
    const { expr: inputExpr, pipes: pipeExprs } = parseFilter(expr)
    // 我们不合并对象，因为对象可能是observable的，这里通过with嵌套的形式
    const parseResult = parseExpr(inputExpr)
    const input = parseResult.fn(...parseResult.params.map(key => getValue(key, ctxs)))

    // with语句的性能太差，弃之
    // const names = ctxs.map((i, index) => '__with__local__' + index)
    // let body = `return ${inputExpr}`
    // names.reverse().forEach(i => {
    //     body = `with (${i}) {
    //         ${body}
    //      }`
    // })
    // const input = new Function(...names, body)(...ctxs)
    if (pipes.length >= 1) {
        return getPipes(pipeExprs, ctxs)(input)
    }
    return input
}

/**
 * 执行表达式
 * @param {string} expr
 * @param {any[]} ctxs
 * @param {(result: any) => void} fn
 * @returns
 */
export function execExpr(expr: string, ctxs: any[], fn: (newValue: any, oldValue: any, execTime: number) => void, transform = false ) {
    let oldValue: any
    let oldLen: number
    let newValueCache: any
    let execTime = 0
    function isEqual(newValue, oldValue) {
        if (newValue !== oldValue) {
            return false
        }
        // 数组一直变化
        if (isArray(newValue)) {
            return false
        }
        return true
    }
    return fn && autorun(() => {
        return execExprIm(expr, ctxs)
    }, {
        callback: newValue => {
            oldValue = newValueCache
            newValueCache = newValue
            const equal = isEqual(newValue, oldValue)
            if (!isEqual(newValue, oldValue)) {
                execTime += 1
                fn(newValue, oldValue, execTime)
            }
        },
        expr,
    })
}

export function asyncExecExpr(expr: string, ctxs: any[], fn: (newValue: any, oldValue?: any) => void) {
    return execExpr(expr, ctxs, fn, true)
}
