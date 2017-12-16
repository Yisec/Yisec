import Component from "./Component";
import render from "./render";
import register from "./register";

/**
 * router.config({
 *  hash: true,
 *  root: document.body,
 *  cache: 4,
 *  onPageSwitch: (oldPage, newPage) => {
 *  },
 *  router: {
 *    '/xx/:id': component,
 *    '/xx/:bc': component,
 *  }
 * })
 *
 */

export interface RouterConfig {
    hash: boolean
    root: HTMLElement
    cache: number
    onPageSwitch: ()=>void
    routes: object
}

let Router = {
    hash: false,
    routes: {},
    push(url) {
        window.history.pushState({}, '', this.getFullPath(url))
        this.handleUrlChange(url)
    },
    replace(url) {
        window.history.replaceState({}, '', this.getFullPath(url))
        this.handleUrlChange(url)
    },
    handleUrlChange(url) {
        const a = document.createElement('a')
        a.href = url
        const path = a.pathname
        const result = match(path, this.routes)
        if (result) {
            const { router, params, value } = result
            const { component, props = {} } = value
            render(component, { ...props, params }, document.body)
        }
    },
    getFullPath(url) {
        return this.hash ? `${location.pathname}${location.search}#${url}` : url
    },
    getPathname() {
        return (this.hash ? location.hash.slice(1) : location.pathname) || '/'
    }
}

export default function router(config) {
    Router = {
        ...Router,
        ...config,
    }
    window.addEventListener('popstate', () => {
        Router.handleUrlChange(Router.getPathname())
    })
    Router.handleUrlChange(Router.getPathname())
}

register('Link', class Link extends Component{
    static defaultProps = {
        href: ''
    }
    click = (e) => {
        const { click, replace = false, redirect = false, href = '' } = this.props
        e.preventDefault()
        click && click(e)
        if (redirect) {
            replace ? location.replace(href) : location.href = href
        } else if (replace) {
            Router.replace(href)
        } else {
            Router.push(href)
        }
    }
    render() {
        return (`
            <a :data-href="href" @click="click" :class="props.class" :style="props.style">
                <slot />
            </a>
        `)
    }
})

// 路由匹配
function match(url = '', obj = {}) {
    const urlItems = url.trim().split('/')

    let params = {}
    let router = ''
    const matched = Object.keys(obj).some((route) => {
        const routeItems = route.trim().split('/')
        router = ''

        // 全局匹配的级别最低，一般用来处理404
        if (route === '*') return false

        // 长度相等，或者路由以*为结尾并且routeItems不能比urlItems长
        if (
            routeItems.length === urlItems.length
            || (routeItems[routeItems.length - 1] === '*' && routeItems.length <= urlItems.length)
        ) {
            params = {} // 获取参数
            router = route // 匹配到的路由地址

            return routeItems.every((i, index) => {
                const urlItemsItem = urlItems[index]
                // 参数匹配
                if (i.startsWith(':')) {
                    // 对 /:id的支持
                    const [key, reg] = i.slice(1).split('@')
                    params[key] = urlItemsItem

                    // 对正则表达式的支持 /:name@aa.+
                    if (reg) {
                        return new RegExp(`^${reg}$`).test(urlItemsItem)
                    }
                    return true
                }

                // * 匹配所有
                if (i === '*') {
                    return true
                }

                // 常规性匹配 Abc*
                if (i.includes('*')) {
                    const reg = i.replace('*', '.*')
                    return new RegExp(`^${reg}$`).test(urlItemsItem)
                }

                // 纯文匹配
                return i === urlItemsItem
            })
        }

        return false
    })

    if (matched) {
        return {
            params,
            url,
            router,
            value: obj[router],
        }
    } else if (obj['*']) {
        // 观察是否配置了全局匹配
        // 其实此时应该跳转404
        return {
            params,
            url,
            router: '*',
            value: obj['*'],
        }
    }
    return null
}
