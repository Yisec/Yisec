// 支持嵌套的表达式匹配， 主要为了支持<span>{{a: b}}</span>
// 性能优化，这可在startToken match后，查看后面是否有arr.length数量的endToken
export function getMatched(start = '<%', end = '%>', str = '') {
    const START_LEN = start.length;
    const END_LEN = end.length;
    let index = 0;
    let arr = [];
    let result = {
        matchStr: '',
        value: ''
    };
    if (!str.startsWith(start)) {
        return result;
    }
    while (index < str.length) {
        // startToken
        if (str.slice(index, index + START_LEN) === start) {
            arr.push(false);
            index += START_LEN;
            continue;
        }
        else if (str.slice(index, index + END_LEN) === end) {
            index += END_LEN;
            arr.pop();
            if (arr.length === 0) {
                const matchStr = str.slice(0, index);
                return {
                    matchStr,
                    value: matchStr.slice(START_LEN, -END_LEN)
                };
            }
            continue;
        }
        // index++
        index += 1;
    }
    // 匹配失败
    return result;
}
