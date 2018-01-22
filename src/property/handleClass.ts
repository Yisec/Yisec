import { VirtualDOM } from "./../d";
import { execExpr } from "./../execExpr";
import { toClassNames } from "./../util";
import { DIRECTIVE_EXPR } from "../config";

function updateClassName(element: HTMLElement, classNames) {
    element.className = Object.keys(classNames)
        .map(key => classNames[key])
        .map(i => i || '').join(' ').trim()
}

export function testClass(vdom: VirtualDOM, type: string = '') :boolean {
    const { ast, dom: element } = vdom
    if (type) {
        type += '-'
    }

    const classProperties = [
        `${DIRECTIVE_EXPR}${type}class`,
        `:${type}class`,
        `${type}class`,
    ]

    return Object.keys(ast.props).some(key => classProperties.includes(key))
}

function handleModuleCss(classNames, moduleMap) {
    return classNames.trim().split(/\s+/g).map(key => {
        // 如果不存在key的映射，就返回key， 这样子即使用了module class也兼容了global class
        return moduleMap[key] || key
    }).join(' ')
}

// class
// enter-class
// leave-class
export default function handleClass( vdom: VirtualDOM, ctxs: any[], key: string, type: string = '') :boolean {
    const { ast: node, dom: element } = vdom
    const value = node.props[key]
    const { classNames } = vdom
    const { moduleCss } = ctxs[0]

    type += (type ? '-' : '')

    if (!(element instanceof HTMLElement)) {
        return true
    }

    if (key === `:${type}class` || key === `ys:expr:${type}class`) {
        vdom.exprs.push(
            execExpr(value, ctxs, (newValue, oldValue) => {
                let classes = toClassNames(newValue)
                if (moduleCss) {
                    classes = handleModuleCss(classes, moduleCss)
                }
                classNames[key] = classes

                updateClassName(element, classNames)
            })
        )
        return true
    } else if (key === `${type}class`) {
        let classes = value
        if (moduleCss) {
            classes = handleModuleCss(classes, moduleCss)
        }
        classNames[key] = classes

        updateClassName(element, classNames)
        return true

    }
    return false
}
