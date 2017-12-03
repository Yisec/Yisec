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
function getValue(key, ctxs) {
    for (let i = 0; i < ctxs.length; i++) {
        if (ctxs[i][key] !== undefined) {
            return ctxs[i][key];
        }
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
export function execExpr(expr, ctxs, fn) {
    let oldValue;
    let oldLen;
    function isEqual(newValue, oldValue) {
        // console.log(newValue, oldValue)
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
        const newValue = execExprIm(expr, ctxs);
        (!isEqual(newValue, oldValue)) && fn(newValue, oldValue);
        oldValue = newValue;
    }, expr, fn);
}
// 不应该在表达式内，定义一个observer
