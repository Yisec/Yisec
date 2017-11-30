// 解析template
// 有时候我们不想使用jsx，不想使用babel编译💊
// 那就使用类似vue angular之类的字符串模板吧
// 使用模板编译的好处有哪些？，模板本身可以作为资源加载，也就是View层 
// 自身的逻辑层可以作为控制器
// 再加一个Model作为数据来源
export class TokenElement {
    constructor(type, index, value, origin = value) {
        this.type = type;
        this.index = index;
        this.value = value;
        this.origin = origin;
    }
}
/**
 * AST节点
 * @class ASTNode
 */
export class ASTNode {
    constructor(tagName = '') {
        this.children = []; // 子节点
        this.props = {}; // props
        this.type = 'element'; // 节点类型
        this.exprs = [];
        this.tagName = tagName;
        // 判断是不是组件
        if (/^[A-Z]/.test(tagName)) {
            this.type = 'component';
        }
    }
}
/**
 * 字符串转token
 *
 * @param {string} [str='']
 * @returns {TokenElement[]}
 */
export function getToken(str = '') {
    const token = [];
    let localStr = str;
    let index = 0;
    // closeStart
    // 获取token，并记解析位置
    function removePreSpace() {
        const [space] = localStr.match(/^\s+/) || [''];
        index += space.length;
        localStr = localStr.slice(space.length);
    }
    function getPrev(index) {
        return token[token.length - index] || {};
    }
    function next() {
        removePreSpace();
        if (localStr.length == 0)
            return;
        // />
        if (/^\/\s*>/.test(localStr)) {
            const [value = ''] = localStr.match(/^\/\s*>/) || [''];
            token.push(new TokenElement('SELF_CLOSE', index, value));
            index += value.length;
            localStr = localStr.slice(value.length);
            return next();
        }
        // </
        if (/^<\s*\//.test(localStr)) {
            const [value] = localStr.match(/^<\s*\//) || [''];
            token.push(new TokenElement('CLOSE_START', index, value));
            index += value.length;
            localStr = localStr.slice(value.length);
            return next();
        }
        // <
        if (/^</.test(localStr)) {
            const [value] = localStr.match(/^</) || [''];
            token.push(new TokenElement('OPEN_START', index, value));
            index += value.length;
            localStr = localStr.slice(value.length);
            return next();
        }
        // >
        if (/^>/.test(localStr)) {
            const [value] = localStr.match(/^>/) || [''];
            token.push(new TokenElement('TAG_CLOSE', index, value));
            index += value.length;
            localStr = localStr.slice(value.length);
            return next();
        }
        // =
        if (/^=/.test(localStr)) {
            const [value] = localStr.match(/^=/) || [''];
            token.push(new TokenElement('EQ', index, value));
            index += value.length;
            localStr = localStr.slice(value.length);
            return next();
        }
        // Aaa-bb 向前读一位需要是 OPEN_START | CLOSE_START
        if (/^[a-zA-Z]-?([a-zA-Z0-9]-?)*/.test(localStr)
            && (getPrev(1).type == 'OPEN_START' || getPrev(1).type == 'CLOSE_START')) {
            const [value] = localStr.match(/^[a-zA-Z]-?([a-zA-Z0-9]-?)*/) || [''];
            token.push(new TokenElement('TAG_NAME', index, value));
            index += value.length;
            localStr = localStr.slice(value.length);
            return next();
        }
        // :@Aaa-bb
        if (/^[a-zA-Z@:]-?([a-zA-Z0-9]-?)*/.test(localStr)) {
            const [value] = localStr.match(/^([a-zA-Z@:]-?([a-zA-Z0-9]-?)*)/) || [''];
            token.push(new TokenElement('PROPERTY_NAME', index, value));
            index += value.length;
            localStr = localStr.slice(value.length);
            return next();
        }
        // 属性value "" 
        if (/^"[^"]*"/.test(localStr)
            && getPrev(1).type == 'EQ' // 向前读一位需要是 EQ 
            && getPrev(2).type == 'PROPERTY_NAME' // 向前读2位需要是 PROPERTY_NAME
        ) {
            // 向前读，需要是
            const [matchStr, value] = localStr.match(/^"([^"]*)"/) || ['', ''];
            token.push(new TokenElement('PROPERTY_VALUE', index, value, matchStr));
            index += matchStr.length;
            localStr = localStr.slice(matchStr.length);
            return next();
        }
        // 表达式
        if (/^{{2}(((?!}{2}).)*)\}{2}/.test(localStr)) {
            const [matchStr, value] = localStr.match(/^{{2}(((?!}{2}).)*)\}{2}/) || ['', ''];
            token.push(new TokenElement('EXPR', index, value, matchStr));
            index += matchStr.length;
            localStr = localStr.slice(matchStr.length);
            return next();
        }
        // 文本节点
        if (/[\s\S][^<{]*/.test(localStr)) {
            const [value] = localStr.match(/^[\s\S][^<{]*/) || [''];
            token.push(new TokenElement('STRING', index, value));
            index += value.length;
            localStr = localStr.slice(value.length);
            return next();
        }
    }
    next();
    return token;
}
/**
 * 处理解析错误
 *
 * @param {any} token
 * @param {any} template
 * @param {any} message
 */
function handleASTError(token, template, message) {
    const str = template.slice(0, token.index);
    const enter = str.match(/\n/g);
    const row = enter ? enter.length + 1 : 1;
    const column = str.length - str.lastIndexOf('\n');
    console.error(`at row:${row} column:${column} \n\n${template.slice(token.index, token.index + 20)} \n\n${message}`);
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
export function toAST(token = [], template = '') {
    const root = new ASTNode();
    let currentNode = root;
    let index = 0;
    let currentT;
    const LEN = token.length;
    function getT(index) {
        return token[index] || {};
    }
    next();
    function next() {
        if (index >= LEN)
            return;
        // 当前token
        currentT = token[index];
        // open tag | close self tag
        if (currentT.type == 'OPEN_START'
            && getT(index + 1).type == 'TAG_NAME') {
            // 获取
            let localIndex = index + 2;
            const props = {};
            const tagName = getT(index + 1).value;
            while (getT(localIndex).type == 'TAG_NAME' || getT(localIndex).type == 'PROPERTY_NAME') {
                if (getT(localIndex + 1).type == 'EQ') {
                    if (getT(localIndex + 2).type == 'PROPERTY_VALUE') {
                        props[getT(localIndex).value] = getT(localIndex + 2).value;
                        localIndex += 3;
                        continue;
                    }
                    else {
                        handleASTError(getT(localIndex), template, `${getT(localIndex).value} should have a value`);
                    }
                }
                props[getT(localIndex).value] = true;
                localIndex += 2;
            }
            const TAG_TYPE = getT(localIndex).type;
            if (TAG_TYPE == 'TAG_CLOSE' || TAG_TYPE == 'SELF_CLOSE') {
                const node = new ASTNode(tagName);
                node.props = props;
                node.parent = currentNode;
                currentNode.children.push(node);
                if (TAG_TYPE === 'TAG_CLOSE') {
                    currentNode = node;
                }
            }
            index = localIndex + 1;
        }
        else if (currentT.type == 'CLOSE_START'
            && getT(index + 1).type == 'TAG_NAME'
            && getT(index + 2).type == 'TAG_CLOSE') {
            if (currentNode.tagName !== getT(index + 1).value) {
                handleASTError(getT(index + 1), template, `close tag name should be ${currentNode.tagName}, but now is ${getT(index + 1).value}`);
            }
            currentNode = currentNode.parent;
            index += 3;
        }
        else {
            const last = currentNode.children[currentNode.children.length - 1];
            if (currentT.type == 'EXPR') {
                const node = new ASTNode();
                node.value = currentT.value;
                node.type = 'expr';
                node.parent = currentNode;
                currentNode.children.push(node);
            }
            else if (last && last.type === 'text') {
                last.value += currentT.value;
            }
            else {
                const node = new ASTNode();
                node.type = 'text';
                node.value = currentT.origin || currentT.value || '';
                node.parent = currentNode;
                currentNode.children.push(node);
            }
            index++;
        }
        next();
    }
    return root;
}
