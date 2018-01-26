const eventCache = {};
const gloablEventCache = {};
const $root = document.documentElement;
export function on(element, key, fn) {
    if (!eventCache[key]) {
        gloablEventCache[key] = function (event) {
            const target = event.target;
            const cache = eventCache[key];
            // 需要考虑的问题是，如何处理stopPropogation
            const stopPropagation = event.stopPropagation;
            let isStop = false; // 是否阻止冒泡
            // 更改
            event.stopPropagation = function () {
                stopPropagation.call(event);
                isStop = true;
            };
            for (let i = 0; i < cache.length; i++) {
                const { element, fn } = cache[i];
                if (element === target
                    || ((target instanceof Node) && element.contains(target))) {
                    fn.call(element, event);
                    if (isStop) {
                        isStop = false;
                        break;
                    }
                }
            }
        };
        $root.addEventListener(key, gloablEventCache[key]);
    }
    const cache = eventCache[key] = eventCache[key] || [];
    // 从组件角度来讲，都是先添加父元素，后添加子元素，因此事件的触发顺序是先触发子元素，再触发父元素的
    // 因为这里每次都塞到头部
    cache.unshift({ element, fn });
}
export function off(element, key, fn) {
    Object.keys(eventCache).forEach((_key) => {
        if (_key === key || key === undefined) {
            // 移除缓存
            eventCache[_key] = eventCache[_key].filter(({ element: _ele, fn: _fn }) => {
                if (_ele === element
                    && (_fn === fn || fn === undefined)) {
                    return false;
                }
                return true;
            });
            // 事件被卸载完毕处理
            if (eventCache[_key].length === 0) {
                $root.removeEventListener(_key, gloablEventCache[_key]);
                delete gloablEventCache[_key];
                delete eventCache[_key];
            }
        }
    });
}
