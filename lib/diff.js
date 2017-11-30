// 处理数组diff 返回数组变更
import { uniqueArr } from "./util";
export default function diff(oldArr = [], newArr = [], isKeyExist = true) {
    newArr = uniqueArr(newArr);
    // getDelete
    let deleteArr = [];
    let keepArr = [];
    let deleteAll = false; // 是否删除所有元素
    let addAll = false;
    let prevIndex = -2;
    let add;
    if (!isKeyExist) {
        return {
            del: {
                arr: oldArr,
            },
            add: {
                before: {
                    key: null,
                    arr: newArr,
                },
                after: {
                    key: null,
                    arr: [],
                }
            }
        };
    }
    for (let i = 0; i < oldArr.length; i++) {
        const item = oldArr[i];
        const INDEX = newArr.indexOf(item);
        // console.log(INDEX, item)
        if (INDEX < 0) {
            deleteArr.push(item);
        }
        else {
            // 判断是否在newArr中连续出现
            if (prevIndex !== -2 && prevIndex + 1 !== INDEX) {
                deleteAll = true;
                addAll = true;
                deleteArr = oldArr;
                keepArr = [];
                break;
            }
            else {
                keepArr.push(item);
            }
            prevIndex = INDEX;
        }
    }
    if (addAll || !keepArr.length) {
        add = {
            before: {
                key: null,
                arr: newArr,
            },
            after: {
                key: 0,
                arr: [],
            }
        };
    }
    else {
        const start = newArr.indexOf(keepArr[0]);
        const end = newArr.indexOf(keepArr[keepArr.length - 1]);
        add = {
            before: {
                key: keepArr[0],
                arr: newArr.slice(0, start)
            },
            after: {
                key: keepArr[keepArr.length - 1],
                arr: newArr.slice(end + 1)
            },
        };
    }
    // 计算新增数组
    return {
        del: {
            arr: deleteArr,
        },
        add,
    };
}
