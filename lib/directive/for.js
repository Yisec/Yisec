import { execExpr } from "../execExpr";
import diff from "./diff";
import { unmountChildren } from "../unmount";
import { observer } from "../autorun";
import transform from "../transform";
import { DIRECTIVEPREV } from "../config";
export default function handleFor(value, element, ctxs, vdom, node) {
    const [itemIndex, arrName] = value.split(' in ').map(i => i.trim());
    const [itemName, indexName] = itemIndex.replace(/(^\s*\()|(\)\s*$)/g, '').split(',').map(i => i.trim());
    let isExeced = false; // 是否执行过
    let cacheKeys = [];
    let cacheKeyVdom = {};
    const keyValue = node.children[0] && (node.children[0].props['key'] || node.children[0].props[':key']);
    vdom.exprs.push(execExpr(arrName, ctxs, (newValue, oldValue = []) => {
        // ys:for只应该含有一个子元素
        if (node.children.length > 1) {
            console.error(`${DIRECTIVEPREV}for just should have one child`);
        }
        // diff cache key
        const newKeyValue = newValue.map((item, index) => {
            let key;
            execExpr(keyValue, [
                ...ctxs,
                {
                    [itemName]: item,
                    [indexName]: index,
                }
            ], newValue => {
                key = newValue;
            })();
            return {
                key,
                item,
            };
        });
        // console.log(newKeyValue)
        const newKyes = newKeyValue.map(i => i.key);
        const { add, del, noChange } = diff(cacheKeys, newKyes, keyValue);
        if (noChange)
            return;
        cacheKeys = newKyes;
        // 如果执行过
        if (isExeced) {
            // 存在key，卸载需要删除的key对应的vdom，否则整体卸载
            if (keyValue) {
                del.arr.forEach(key => {
                    cacheKeyVdom[key] && unmountChildren(cacheKeyVdom[key].vdom);
                    delete cacheKeyVdom[key]; // 删除缓存
                });
            }
            else {
                unmountChildren(vdom);
            }
        }
        isExeced = true;
        // 我们只处理 移除 + 头尾新增的情况
        // key不发生变化的需要更新index
        // key新增的还是需要新增
        const childNode = element.childNodes && element.childNodes[0];
        newKeyValue.forEach((keyItem, index) => {
            const { key, item } = keyItem;
            // 不存在就新增，存在就更新
            if (!cacheKeyVdom[key]) {
                let dd = {};
                indexName && (dd[indexName] = index);
                itemName && (dd[itemName] = item);
                const observeIndexItem = observer(dd);
                const PE = add.before.arr.includes(key) ? {
                    appendChild: (newNode) => {
                        childNode ? element.insertBefore(newNode, childNode) : element.appendChild(newNode);
                        return newNode;
                    }
                } : element;
                const result = transform(node, PE, [...ctxs, observeIndexItem], vdom);
                // 如果没有key就不要加入缓存了
                if (keyValue) {
                    cacheKeyVdom[key] = {
                        vdom: result,
                        observeIndexItem,
                    };
                }
            }
            else {
                const hh = cacheKeyVdom[key].observeIndexItem;
                // itemName && (hh[itemName] = item)
                indexName && (hh[indexName] = index);
            }
        });
    }));
}
