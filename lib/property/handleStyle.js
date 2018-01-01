import { getType, isString } from "./../util";
export default function handleStyle(style) {
    switch (getType(style)) {
        case 'string': {
            return style;
        }
        case 'array': {
            return style.map(handleStyle).join(';');
        }
        case 'object': {
            // 可以处理一般的css3兼容性
            return Object.entries(style).map(([key, value]) => {
                if (isString(value)) {
                    const KEY = key.replace(/[A-Z]/g, $1 => '-' + $1.toLowerCase());
                    return `${KEY}: ${value}`;
                }
                return '';
            }).filter(i => i).join(';');
        }
        default: {
            return '';
        }
    }
}
