import { autorun } from "./autorun";
import { isArray } from './util';
import parseExpr from './parser/parseExpr';
import parseFilter from './parser/parseFilter';
const pipes = [];
export function addPipe(...ctxs) {
    pipes.push(...ctxs);
}
/**
 * pipe 上一个函数返回结果作为下一个函数的输入
 * @param fns
 */
function handlePipe(...fns) {
    return (arg) => {
        let result = arg;
        fns.forEach(fn => {
            result = fn(result);
        });
        return result;
    };
}
function getPipes(exprs, ctxs) {
    return handlePipe(...exprs.map(expr => execExprIm(expr, [...ctxs, ...pipes])));
}
/**
 * 从作用域链中获取指定key的值
 * @param key
 * @param ctxs
 */
function getValue(key, ctxs) {
    for (let i = 0; i < ctxs.length; i++) {
        if (ctxs[i].hasOwnProperty(key)) {
            return ctxs[i][key];
        }
    }
    if (key === 'true') {
        return true;
    }
    if (key === 'false') {
        return false;
    }
    return window[key];
}
export function execExprIm(expr = '', ctxs) {
    const { expr: inputExpr, pipes: pipeExprs } = parseFilter(expr);
    // 我们不合并对象，因为对象可能是observable的，这里通过with嵌套的形式
    const parseResult = parseExpr(inputExpr);
    const input = parseResult.fn(...parseResult.params.map(key => getValue(key, ctxs)));
    // const names = ctxs.map((i, index) => '__with__local__' + index)
    // let body = `return ${inputExpr}`
    // names.reverse().forEach(i => {
    //     body = `with (${i}) {
    //         ${body}
    //      }`
    // })
    // const input = new Function(...names, body)(...ctxs)
    if (pipes.length > 1) {
        return getPipes(pipeExprs, ctxs)(input);
    }
    return input;
}
/**
 * 执行表达式
 * @param {string} expr
 * @param {any[]} ctxs
 * @param {(result: any) => void} fn
 * @returns
 */
export function execExpr(expr, ctxs, fn, transform = false) {
    let oldValue;
    let oldLen;
    let newValueCache;
    function isEqual(newValue, oldValue) {
        if (newValue !== oldValue) {
            return false;
        }
        if (isArray(newValue)) {
            const newLen = newValue.length;
            const equal = newLen === oldLen;
            oldLen = newLen;
            return equal;
        }
        return true;
    }
    return fn && autorun(() => {
        return execExprIm(expr, ctxs);
    }, {
        callback: newValue => {
            oldValue = newValueCache;
            newValueCache = newValue;
            const equal = isEqual(newValue, oldValue);
            !equal && fn(newValue, oldValue);
        },
        async: transform,
        expr,
    });
}
export function asyncExecExpr(expr, ctxs, fn) {
    return execExpr(expr, ctxs, fn, true);
}
