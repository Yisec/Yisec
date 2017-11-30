import { autorun } from "./autorun";
import { isArray } from './util';
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
    exprs = exprs.map(i => i.trim()).filter(i => i);
    return handlePipe(...exprs.map(expr => execExprIm(expr, [...ctxs, ...pipes])));
}
// 分割表达式，只处理不重复的分隔符|
const splitExpr = (function () {
    let splitExprCache = {};
    return function splitExpr(str = '') {
        if (splitExprCache[str]) {
            return splitExprCache[str];
        }
        const exprArr = [];
        let current = '';
        let index = 0;
        while (index < str.length) {
            const char = str[index];
            if (char === '|'
                && !/\|\s*$/.test(current)
                && !/^\s*\|/.test(str.slice(index + 1))) {
                exprArr.push(current);
                current = '';
            }
            else {
                current += char;
            }
            index += 1;
        }
        exprArr.push(current);
        splitExprCache[str] = exprArr;
        return exprArr;
    };
}());
export function execExprIm(expr = '', ctxs) {
    const splitResult = splitExpr(expr);
    const inputExpr = splitResult[0];
    // 我们不合并对象，因为对象可能是observable的，这里通过with嵌套的形式
    const names = ctxs.map((i, index) => '__with__local__' + index);
    let body = `return ${inputExpr}`;
    names.reverse().forEach(i => {
        body = `with (${i}) {
            ${body}
         }`;
    });
    const input = new Function(...names, body)(...ctxs);
    if (splitResult.length > 1) {
        const pipes = getPipes(splitResult.slice(1), ctxs);
        return handlePipe(pipes)(input);
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
