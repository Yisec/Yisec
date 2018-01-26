let isScroll = false
let timeout
window.addEventListener('scroll', () => {
    isScroll = true
    clearTimeout(timeout)
    timeout = setTimeout(() => {
        isScroll = false
    }, 50)
})

// 事件别名
const eventAlias = {
    enter: (fn) => ([
        {
            eventName: 'keydown',
            listener: (event: KeyboardEvent, ...args) => {
                if (event.keyCode == 13) {
                    fn(event, ...args)
                }
            }
        }
    ]),
    up: (fn) => ([
        {
            eventName: 'keydown',
            listener: (event: KeyboardEvent, ...args) => {
                if (event.keyCode == 38) {
                    fn(event, ...args)
                }
            }
        }
    ]),
    down: (fn) => ([
        {
            eventName: 'keydown',
            listener: (event: KeyboardEvent, ...args) => {
                if (event.keyCode == 40) {
                    fn(event, ...args)
                }
            }
        }
    ]),
    left: (fn) => ([
        {
            eventName: 'keydown',
            listener: (event: KeyboardEvent, ...args) => {
                if (event.keyCode == 37) {
                    fn(event, ...args)
                }
            }
        }
    ]),
    esc: (fn) => ([
        {
            eventName: 'keyup',
            listener: (event: KeyboardEvent, ...args) => {
                if (event.keyCode == 27) {
                    fn(event, ...args)
                }
            }
        }
    ]),
    ctrlEnter: (fn) => {
        const recodeKey = {
            ctrl: false,
            enter: false,
        }
        return ([
            {
                eventName: 'keydown',
                listener: (event: KeyboardEvent, ...args) => {
                    if (event.keyCode == 13) {
                        recodeKey.enter = true
                    } else if (event.keyCode == 17) {
                        recodeKey.ctrl = true
                    }
                    recodeKey.enter && recodeKey.ctrl && fn(...args)
                }
            },
            {
                eventName: 'keyup',
                listener: (event: KeyboardEvent, ...args) => {
                    if (event.keyCode == 13) {
                        recodeKey.enter = false
                    } else if (event.keyCode == 17) {
                        recodeKey.ctrl = false
                    }
                }
            }
        ])
    },
    click: (fn) => {
        if (window.navigator.userAgent.toLowerCase().match(/android/) && 0) {
            let time = 0
            let isMove = false
            return [
                {
                    eventName: 'touchstart',
                    listener: (event) => {
                        time = Date.now()
                    }
                },
                {
                    eventName: 'touchmove',
                    listener: (event) => {
                        isMove = true
                    }
                },
                {
                    eventName: 'touchend',
                    listener: (event) => {
                        !isScroll && !isMove && (Date.now() - time < 200) && fn(event)
                        isMove = false
                    }
                },
            ]
        } else {
            return [{
                eventName: 'click',
                listener: fn
            }]
        }
    }
}

/**
 * 添加事件别名
 * @param eventName
 * @param fn
 */
export function addEventAlias(eventName: string, fn) {
    eventAlias[eventName] = fn
}

export function delEventAlias(eventName: string) {
    delete eventAlias[eventName]
}

export default eventAlias
