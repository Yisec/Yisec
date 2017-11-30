class FVEvents {
    constructor() {
        this.cache = [];
    }
    on(element, key, fn) {
        this.cache.push([key, fn]);
        element.addEventListener(key, fn);
        return this;
    }
    off(element, key, fn) {
        this.cache = this.cache.filter(([_key, _fn]) => {
            if ((key === _key && fn === _fn)
                || (key === key && fn === undefined)
                || (key === undefined && fn === undefined)) {
                element.removeEventListener(key, fn);
                return false;
            }
        });
        return this;
    }
}
