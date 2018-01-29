import { VirtualDOM } from "./../d";
import { execExpr } from "./../execExpr";
import { toClassNames, getParentCtx } from "./../util";
import { DIRECTIVE_EXPR, HANDLE_CLASS_FN_NME } from "../config";

// 通过插件处理classNames
function handleClassNames(str, ctx) {
    return ctx[HANDLE_CLASS_FN_NME] ? ctx[HANDLE_CLASS_FN_NME](str) : str;
}

// 更新dom上的className
function updateClassName(element: HTMLElement|SVGElement, classNames, key, classes, ctx) {
    classNames[key] = handleClassNames(classes, ctx)
    const classStr = Object.keys(classNames)
        .map(key => classNames[key])
        .map(i => i || '').join(' ').trim()

    if (element instanceof HTMLElement) {
        element.className = classStr
    } else if (element instanceof SVGElement) {
        // SVGElement 的className属性为read only，因此这里使用setAttribute
        element.setAttribute('class', classStr)
    }
}

// 获取class属性
export function getClassProperties(type) {
    type += (type ? '-' : '')

    return [
        `${DIRECTIVE_EXPR}${type}class`,
        `:${type}class`,
        `${type}class`,
    ]
}

// 测试props上是否存在指定的属性
export function testClass(vdom: VirtualDOM, type: string = '') :boolean {
    const { ast, dom: element } = vdom
    const classProperties = getClassProperties(type)
    return Object.keys(ast.props).some(key => classProperties.includes(key))
}

// class
// enter-class
// leave-class
export default function handleClass( vdom: VirtualDOM, ctxs: any[], key: string, type: string = '') :boolean {
    const { ast: node, dom: element } = vdom
    const value = node.props[key]
    const { classNames } = vdom
    const ctx = getParentCtx(ctxs)

    type += (type ? '-' : '')

    if (key === `:${type}class` || key === `ys:expr:${type}class`) {
        vdom.exprs.push(
            execExpr(value, ctxs, (newValue, oldValue) => {
                updateClassName(element, classNames, key, toClassNames(newValue), ctx)
            })
        )
        return true
    } else if (key === `${type}class`) {
        updateClassName(element, classNames, key, value, ctx)
        return true

    }
    return false
}
