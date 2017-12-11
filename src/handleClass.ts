import { VirtualDOM } from "./d";
import { execExpr } from "./execExpr";
import { toClassNames } from "./util";

function updateClassName(element: HTMLElement, classNames) {
    element.className = Object.keys(classNames)
        .map(key => classNames[key])
        .map(i => i || '').join(' ').trim()
}

export function testClass(vdom: VirtualDOM, type: string = '') :boolean {
    const { ast, dom: element } = vdom
    type += (type ? '-' : '')

    const classProperties = [
        `@${type}class`,
        `${type}class`,
        `@${type}mclass`,
        `${type}mclass`,
    ]

    return Object.keys(ast.props).some(key => classProperties.includes(key))
}

// class mclass
// enter-class enter-mclass
// leave-class leave-mclass
export default function handleClass( vdom: VirtualDOM, ctxs: any[], key: string, type: string = '') :boolean {
    const { ast: node, dom: element } = vdom
    const value = node.props[key]
    const classNames = vdom.classNames = vdom.classNames || {}

    type += (type ? '-' : '')

    if (key === `:${type}class`) {
        vdom.exprs.push(
            execExpr(value, ctxs, (newValue, oldValue) => {
                classNames[key] = toClassNames(newValue)
                updateClassName(element, classNames)
            })

        )
    } else if (key === `${type}class`) {
        classNames[key] = value
        updateClassName(element, classNames)

    } else if (key === `:${type}mclass`) {
        vdom.exprs.push(
            execExpr(value, ctxs, (newValue, oldValue) => {
                newValue = toClassNames(newValue).split(/\s+/g).map(key => {
                    return (ctxs[0].mclass || {})[key]
                }).join(' ')
                classNames[key] = newValue
                updateClassName(element, classNames)
            })
        )

    } else if (key === `${type}mclass`) {
        classNames[key] = value.split(/\s+/g).map(key => {
            return (ctxs[0].mclass || {})[key]
        }).join(' ')
        updateClassName(element, classNames)

    } else {
        return false
    }
    return true
}
