# Yisec

使用observe/autorun/component来构建web app

## hello world
```js
import { render } from 'yisec'
render(`Hello World`, {}, document.body)
```

```js
import {observer, render, Component} from 'yisec'

const store = observer({
    num: 0,
    addNum() {
        store.num++
    }
})

class Hello extends Component {
    render() {
        return (`
            <h1 @click="store.addNum">click to add {{store.num}}</h1>
        `)
    }
}

render(Hello, {store}, document.body)
```

## observe/autorun
通过autorun包裹依赖observer化数据的函数，当数据变化时，可重新执行函数。得益于这种实现，可以对View层进行最颗粒化更新。也只有当被依赖数据发生变化时，View才会执行更新。

## context
template在被解析的时候，会去执行表达式。表达式执行环境的作用域从内到外的顺序为[this, this.state, this.props, window]。
对于简单组件，可以不用声明props、state直接获取state/props上的key

## Component
对于简单组件来说可以使用string/function作为组件，而不用继承Component
- string/function 纯组件 支持
- defaultProps 支持

生命周期
- willMount
- didMount
- willUnmount
父组件didMount/willUnmount会在非异步加载子组件的didMount/willUnmount完成后被触发

### 异步加载
除了根组件以外的其他组件，支持异步加载。这样就可以webpack dynamic import无缝对接啦~
```js
class Btn exntends Yisec.Component {
    template = `<h1>一师是个好学校</h1>`
})
Yisec.register('Btn', Btn)

Yisec.register('Btn', new Promise(res => {
    res(Btn)
})
```

## 组件通信
组件可以和子组件，父组件，兄弟组件进行通信
```js
class extends Component {
    didMount() {
        this.$emit('key', data) // 通知父组件
        this.$emitChildren('key', data) // 通知子组件
        this.$emitSiblings('key', data) // 通知兄弟组件
    }
    // 我们推荐在emit属性下对组件间事件进行统一处理，不过你也可以把事件监听直接注册在class上
    emit = {
        childClick = (hah) => {
            console.log(hah)
        }
    }
}
```

## slot
支持自定义组件对子组件的渲染
```js
`
    <Nav>
        <div></div>
    </Nav>
`
```

## template
- ``` @enter="xxx" ``` 表示事件监听
- ``` :class="classObj" ``` 表示classObj是一个表达式
- ``` <div>{{ 12345 | date }}</div> ``` 首先```{{}}```表示其内部是一个表达式，其次```|```符号表示前面的12345会被函数date进行处理
以上是对html字符串的增强扩展

你可以使用template属性，或者render方法指定template
```js
class extends Yisec.Component {
    template = `<div>too simple</div>`
    render() {
        return (`
            <div>naive 👓 </div>
        `)
    }
}
```

## event alias
为了方便处理一些常用的事件如 keydown && keyCode== 13 这样的事件，我们提供了event alias机制，可以自定义事件的解析规则。

添加自定义eventAlias
```js
import { addEventAlias } from 'fv'
addEventAlias('ctrlEnter', (fn) => {
    const recodeKey = {
        ctrl: false,
        enter: false,
    }
    return ([
        {
            eventName: 'keydown',
            listener: (event: KeyboardEvent, ...args) => {
                if (event.keyCode == 13) {
                    recodeKey.enter = true
                } else if (event.keyCode == 17) {
                    recodeKey.ctrl = true
                }
                recodeKey.enter && recodeKey.ctrl && fn(...args)
            }
        },
        {
            eventName: 'keyup',
            listener: (event: KeyboardEvent, ...args) => {
                if (event.keyCode == 13) {
                    recodeKey.enter = false
                } else if (event.keyCode == 17) {
                    recodeKey.ctrl = false
                }
            }
        }
    ])
})
```

### before
```js
function handleEnter(event) {
    if (event.keyCode == 13) {
        doSth()
    }
}
`<div @keydown="handleEnter"></div>`
```

### after
```js
function doSth() {
}
`<div @enter="doSth"></div>`
```


## pipe
实现了linux pipe。一般用于数据格式化，数组过滤等。

```js
import {addPipe} from 'fv'

// 添加自定管道
addPipe({
    dateFormat(time) {
        return new Date(time).toString()
    }
    addPrev(str) {
        return '哈哈哈' + str
    }
})

`
    <div>
        {{ time | dateFormat | addPrev }}
    </div>
`
```


## class
```js
`
<div class="aa" :class="[name]" mclass="xxx" :mclass="[name]"
    enter-class="aa" :enter-class="[name]" enter-mclass="xxx" :enter-mclass="[name]"
    leave-class="aa" :leave-class="[name]" leave-mclass="xxx" :leave-mclass="[name]"
    ></div>
`
```
class表示正常的class属性，对于@class支持object/arr/string三种数据类型的转换
mclass则是对module css的支持
### 生命周期
- class dom被创建时执行
- enter-class dom创建后执行
- leave-class dom被卸载前执行需要与leaveTime属性配合使用

## 插件机制
还没有想好
比如更换template语法，其他语法转template语法
处理property
```js
yisec.propertyPlugin('class', function(ctxs, props, execExpr, element) {

})
yisec.propertyPlugin('after-exec-expr', function(ctxs, ) {

})
```

## 自定义解析规则
待支持

## JSX
暂不支持
JSX的优势，在于JSX属于js语法的增强，JSX可以直接使用变量所处作用域的变量，而不用像使用template模式的框架蹩脚的把需要用到的变量挂载在组件上。但是目前，暂无计划支持JSX。

## chrome devtool
等待支持

