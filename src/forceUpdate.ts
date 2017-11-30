let queue = []
let timeout

export function addExecQueue(list = []) {
    // return list.forEach(fn => fn())
    
    clearTimeout(timeout)
    queue.push(...list)
    timeout = setTimeout(() => {
        forceUpdate()
        console.timeEnd('forceUpdate')
    })
}
 
export default function forceUpdate(afterFn = () => {}) {
    const haveExec = []
    queue.forEach(fn => {
        if (!haveExec.includes(fn)) {
            haveExec.push(fn)
            fn()
            queue = queue.filter(i => i !== fn)
        } else {
            console.log('不执行', fn.str)
        }
    })
    afterFn()
}
