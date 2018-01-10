// 分割表达式，只处理不重复的分隔符|
const parseFilterCache = {};
export default function parseFilter(str = '') {
    if (parseFilterCache[str]) {
        return parseFilterCache[str];
    }
    const exprArr = [];
    let current = '';
    let index = 0;
    while (index < str.length) {
        const char = str[index];
        // 前后不能是| |
        if (char === '|'
            && str[index - 1] !== '|'
            && str[index + 1] !== '|') {
            exprArr.push(current);
            index += 1;
            current = '';
            continue;
        }
        else if (char === "'" || char === '"') {
            const [matchStr = ''] = str.slice(index).match(/^'[^']*'|^"[^"]*"/) || [];
            current += matchStr;
            index += matchStr.length;
            continue;
        }
        current += char;
        index += 1;
    }
    exprArr.push(current);
    const result = {
        expr: exprArr[0],
        pipes: exprArr.slice(1).map(i => i.trim()).filter(i => i),
    };
    parseFilterCache[str] = result;
    return result;
}
