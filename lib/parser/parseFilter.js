// 分割表达式，只处理不重复的分隔符|
const parseFilter = (function () {
    let parseFilterCache = {};
    return function parseFilter(str = '') {
        if (parseFilterCache[str]) {
            return parseFilterCache[str];
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
        const result = {
            expr: exprArr[0],
            pipes: exprArr.slice(1).map(i => i.trim()).filter(i => i),
        };
        parseFilterCache[str] = result;
        return result;
    };
}());
export default parseFilter;
