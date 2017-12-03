let queue = []
let timeout

export function addExecQueue(list = []) {
    // return list.forEach(fn => fn())
    clearTimeout(timeout)
    queue.push(...list)
    timeout = setTimeout(forceUpdate)
}
 
export default function forceUpdate(afterFn = () => {}) {
    const haveExec = []
    queue.forEach(fn => {
        if (!haveExec.includes(fn)) {
            haveExec.push(fn)
            fn()
        } else {
            // console.log('不执行', fn.str)
        }
    })
    window.time1 && console.log('执行结束: ', Date.now() - window.time1)
    afterFn()
}
