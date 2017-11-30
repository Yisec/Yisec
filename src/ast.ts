// 解析template
// 有时候我们不想使用jsx，不想使用babel编译💊
// 那就使用类似vue angular之类的字符串模板吧
// 使用模板编译的好处有哪些？，模板本身可以作为资源加载，也就是View层 
// 自身的逻辑层可以作为控制器
// 再加一个Model作为数据来源
import { ASTNode, TokenElement } from "./d";

/**
 * 半闭合标签 可以以 > 或 /> 结尾
 */
const selfCloseElements = ['img', 'br', 'hr', 'input']
// 我们应该在解析关键字的同时，保留原始字符串
const M = {
    get SELF_CLOSE() {
        return /^(\/\s*>)\s*/
    },
    get CLOSE_START() {
        return /^(<\s*\/)\s*/
    },
    get TAG_CLOSE() {
        return /^(>)\s*/
    },
    get OPEN_START() {
        return /^(<)\s*/
    },
    get EQ() {
        return /^(=)\s*/
    },
    get TAG_NAME() {
        return /^([a-zA-Z]-?([a-zA-Z0-9]-?)*)\s*/
    },
    get PROPERTY_NAME() {
        return /^([a-zA-Z@:]-?([a-zA-Z0-9]-?)*)\s*/
    },
    get PROPERTY_VALUE() {
        return /^"([^"]*)"\s*/
    },
    get EXPR() {
        return /^{{2}(((?!}{2}).)*)\}{2}\s*/
    },
    get STRING() {
        return /^[\s\S][^<{]*/
    },
}

/**
 * 字符串转token
 * 
 * @param {string} [str=''] 
 * @returns {TokenElement[]} 
 */
export function getToken(str: string = '') :TokenElement[] {
    const token: TokenElement[] = []
    let localStr = str
    let index = 0
    // closeStart
    // 获取token，并记解析位置
    function removePreSpace() {
        const [space] = localStr.match(/^\s+/) || ['']
        index += space.length
        localStr = localStr.slice(space.length)
    }
    function getPrev(index) {
        return token[token.length - index] || {}
    }
    function next() {
        removePreSpace()

        if (localStr.length == 0) return

        // />
        if (M.SELF_CLOSE.test(localStr)) {
            const [matchStr, value] = localStr.match(M.SELF_CLOSE) || ['', '']
            token.push(
                new TokenElement('SELF_CLOSE', index, value, matchStr)
            )
            index += value.length
            localStr = localStr.slice(value.length)
            return next()
        }

        // </
        if (M.CLOSE_START.test(localStr)) {
            const [matchStr, value] = localStr.match(M.CLOSE_START) || ['', '']
            token.push(
                new TokenElement('CLOSE_START', index, value)
            )
            index += value.length
            localStr = localStr.slice(value.length)
            return next()
        }

        // <
        if (M.OPEN_START.test(localStr)) {
            const [matchStr, value] = localStr.match(M.OPEN_START) || ['', '']
            token.push(
                new TokenElement('OPEN_START', index, value, matchStr)
            )
            index += value.length
            localStr = localStr.slice(value.length)
            return next()
        }

        // >
        if (M.TAG_CLOSE.test(localStr)) {
            const [matchStr, value] = localStr.match(M.TAG_CLOSE) || ['', '']
            token.push(
                new TokenElement('TAG_CLOSE', index, value, matchStr)
            )
            index += value.length
            localStr = localStr.slice(value.length)
            return next()
        }

        // =
        if (M.EQ.test(localStr)) {
            const [matchStr, value] = localStr.match(M.EQ) || ['', '']
            token.push(
                new TokenElement('EQ', index, value, matchStr)
            )
            index += value.length
            localStr = localStr.slice(value.length)
            return next()
        }

        // Aaa-bb 向前读一位需要是 OPEN_START | CLOSE_START
        if (
            M.TAG_NAME.test(localStr) 
            && (getPrev(1).type == 'OPEN_START' || getPrev(1).type == 'CLOSE_START')
        ) {
            const [matchStr, value] = localStr.match(M.TAG_NAME) || ['', '']
            token.push(
                new TokenElement('TAG_NAME', index, value, matchStr)
            )
            index += value.length
            localStr = localStr.slice(value.length)
            return next()
        }

        // :@Aaa-bb
        if (M.PROPERTY_NAME.test(localStr)) {
            const [matchStr, value] = localStr.match(M.PROPERTY_NAME) || ['', '']
            token.push(
                new TokenElement('PROPERTY_NAME', index, value, matchStr)
            )
            index += value.length
            localStr = localStr.slice(value.length)
            return next()
        }

        // 属性value "" 
        if (
            M.PROPERTY_VALUE.test(localStr) 
            && getPrev(1).type == 'EQ' // 向前读一位需要是 EQ 
            && getPrev(2).type == 'PROPERTY_NAME' // 向前读2位需要是 PROPERTY_NAME
        ) {
            // 向前读，需要是
            const [matchStr, value] = localStr.match(M.PROPERTY_VALUE) || ['', '']
            token.push(
                new TokenElement('PROPERTY_VALUE', index, value, matchStr)
            )
            index += matchStr.length
            localStr = localStr.slice(matchStr.length)
            return next()
        }

        // 表达式
        if (M.EXPR.test(localStr)) {
            const [matchStr, value] = localStr.match(M.EXPR) || ['', '']
            token.push(
                new TokenElement('EXPR', index, value, matchStr)
            )
            index += matchStr.length
            localStr = localStr.slice(matchStr.length)
            return next()
        }

        // 文本节点
        if (M.STRING.test(localStr)) {
            const [value] = localStr.match(M.STRING) || ['']
            token.push(
                new TokenElement('STRING', index, value)
            )
            index += value.length
            localStr = localStr.slice(value.length)
            return next()  
        }
    }
    next()
    return token
}

/**
 * 处理解析错误
 * 
 * @param {any} token 
 * @param {any} template 
 * @param {any} message 
 */
function handleASTError(token, template, message) {
    const str = template.slice(0, token.index)
    const enter = str.match(/\n/g)
    const row = enter ? enter.length + 1 : 1
    const column = str.length - str.lastIndexOf('\n')

    console.error(`at row:${row} column:${column} \n\n${template.slice(token.index, token.index + 100)} \n\n${message}`)
}

// 读取元素 
// token[0].type == 'OPEN_START'
// token[1].type == 'TAG_NAME'
// token[2].type == 'TAG_NAME' *
//     token[3].type == 'EQ' && token[4].type == 'PROPERTY_VALUE'
// token[0].type == 'TAG_CLOSE' || token[0].type == 'SELF_CLOSE'
//     Element
// token[0].type == 'CLOSE_START'
// token[1].type == 'TAG_NAME'
// token[2].type == 'TAG_CLOSE'
export function toAST(token: TokenElement[] = [], template: string = ''): ASTNode {
    const root = new ASTNode()
    let currentNode = root
    let index = 0
    let currentT: TokenElement
    const LEN = token.length

    function getT(index) {
        return token[index] || {}
    }

    next()

    function next() {
        if (index >= LEN) return

        // 当前token
        currentT = token[index]

        // open tag | close self tag
        if (
            currentT.type == 'OPEN_START'
            && getT(index + 1).type == 'TAG_NAME'
        ) {
            // 获取
            let localIndex = index + 2
            const props = {}
            const tagName = getT(index + 1).value
            while (getT(localIndex).type == 'TAG_NAME' || getT(localIndex).type == 'PROPERTY_NAME') {
                if ( getT(localIndex + 1).type == 'EQ' ) {
                    if (getT(localIndex + 2).type == 'PROPERTY_VALUE') {
                        props[getT(localIndex).value] = getT(localIndex + 2).value
                        localIndex += 3
                        continue
                    }  else {
                        handleASTError(getT(localIndex), template, `${getT(localIndex).value} should have a value`)
                    }
                } 
                props[getT(localIndex).value] = true
                localIndex += 1
            }
            
            const TAG_TYPE = getT(localIndex).type
            if ( TAG_TYPE == 'TAG_CLOSE' || TAG_TYPE == 'SELF_CLOSE' ) {
                const node = new ASTNode(tagName)
                node.props = props
                node.parent = currentNode
                currentNode.children.push(node)
                if (TAG_TYPE === 'TAG_CLOSE' && !selfCloseElements.includes(tagName)) {
                    currentNode = node
                }
            }
            index = localIndex + 1
        } 
        // close tag
        else if (
            currentT.type == 'CLOSE_START'
            && getT(index + 1).type == 'TAG_NAME'
            && getT(index + 2).type == 'TAG_CLOSE'
        ) {
            if (currentNode.tagName !== getT(index + 1).value) {
                handleASTError(
                    getT(index + 1), 
                    template, 
                    `close tag name should be ${currentNode.tagName}, but now is ${getT(index + 1).value}`
                )
            }
            currentNode = currentNode.parent
            index += 3 
        } 
        // 文本节点
        else {
            const last = currentNode.children[currentNode.children.length - 1]
            
            if (currentT.type == 'EXPR') {
                const node = new ASTNode()
                node.value = currentT.value
                node.type = 'expr'
                node.parent = currentNode
                currentNode.children.push(node)
            } 
            // 如果前面是文本节点，就追加上去
            else if (last && last.type === 'text') {
                last.value += currentT.value
            } else {
                const node = new ASTNode()
                node.type = 'text'
                node.value = currentT.origin || currentT.value || ''
                node.parent = currentNode
                currentNode.children.push(node)
            }
            index++
        }
        next()
    } 
    return root
}


let cache = {}
// 字符串 => ast
export default function(template: string = '') :ASTNode {
    // 使用缓存，不用再ast => dom的时候对ast进行修改
    return cache[template] = cache[template] || toAST(getToken(template), template)
}
