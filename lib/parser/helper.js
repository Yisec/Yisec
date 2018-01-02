export function getMatched(start = '{', end = '}', str = '') {
    const process = [];
    let result = {
        matchStr: '',
        value: ''
    };
    let index = 0;
    let matchStr = '';
    if (str[index] !== start) {
        return result;
    }
    while (index < str.length) {
        const token = str[index];
        matchStr += token;
        if (token === start) {
            process.push(false);
        }
        else if (token === end) {
            process.pop();
            if (process.length === 0) {
                result.matchStr = matchStr;
                result.value = matchStr.slice(1, -1);
                return result;
            }
        }
        index += 1;
    }
    return result;
}
