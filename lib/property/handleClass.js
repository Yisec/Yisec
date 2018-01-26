import { execExpr } from "./../execExpr";
import { toClassNames, getParentCtx } from "./../util";
import { DIRECTIVE_EXPR, HANDLE_CLASS_FN_NME } from "../config";
// 通过插件处理classNames
function handleClassNames(str, ctx) {
    return ctx[HANDLE_CLASS_FN_NME] ? ctx[HANDLE_CLASS_FN_NME](str) : str;
}
// 更新dom上的className
function updateClassName(element, classNames, key, classes, ctx) {
    classNames[key] = handleClassNames(classes, ctx);
    element.className = Object.keys(classNames)
        .map(key => classNames[key])
        .map(i => i || '').join(' ').trim();
}
// 获取class属性
export function getClassProperties(type) {
    type += (type ? '-' : '');
    return [
        `${DIRECTIVE_EXPR}${type}class`,
        `:${type}class`,
        `${type}class`,
    ];
}
// 测试props上是否存在指定的属性
export function testClass(vdom, type = '') {
    const { ast, dom: element } = vdom;
    const classProperties = getClassProperties(type);
    return Object.keys(ast.props).some(key => classProperties.includes(key));
}
// class
// enter-class
// leave-class
export default function handleClass(vdom, ctxs, key, type = '') {
    const { ast: node, dom: element } = vdom;
    const value = node.props[key];
    const { classNames } = vdom;
    const ctx = getParentCtx(ctxs);
    type += (type ? '-' : '');
    if (!(element instanceof HTMLElement)) {
        return true;
    }
    if (key === `:${type}class` || key === `ys:expr:${type}class`) {
        vdom.exprs.push(execExpr(value, ctxs, (newValue, oldValue) => {
            updateClassName(element, classNames, key, toClassNames(newValue), ctx);
        }));
        return true;
    }
    else if (key === `${type}class`) {
        updateClassName(element, classNames, key, value, ctx);
        return true;
    }
    return false;
}
