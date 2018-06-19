import { HANDLE_CLASS_FN_NME } from "../config";

export default function cssModule(styles) {
    return function(target) {
        target.prototype[HANDLE_CLASS_FN_NME] = function(classNames = '') {
            classNames = `${classNames}`
            return classNames.trim().split(/\s+/g).map(key => {
                // 如果不存在key的映射，就返回key， 这样子即使用了module class也兼容了global class
                return styles[key] || key
            }).join(' ')
        }
    }
}
