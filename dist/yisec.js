/** Yisec is a web component frame **/
(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
	typeof define === 'function' && define.amd ? define(['exports'], factory) :
	(factory((global.Yisec = {})));
}(this, (function (exports) { 'use strict';

/**
 * 所有注册组件缓存
 */
var registerComponents = {};
/**
 * 添加全局组件
 * @param name
 * @param Com
 */
function register(name, Com) {
  registerComponents[name] = Com;
}

function getType(arg) {
    return Object.prototype.toString.call(arg).match(/\s(.+)]/)[1].toLowerCase();
}
function isFunction() {
    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
    }

    return args.every(function (arg) {
        return getType(arg) === 'function';
    });
}
function isArray() {
    for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
        args[_key2] = arguments[_key2];
    }

    return args.every(function (arg) {
        return getType(arg) === 'array';
    });
}

function isString() {
    for (var _len4 = arguments.length, args = Array(_len4), _key4 = 0; _key4 < _len4; _key4++) {
        args[_key4] = arguments[_key4];
    }

    return args.every(function (arg) {
        return getType(arg) === 'string';
    });
}

function isPromise() {
    for (var _len6 = arguments.length, args = Array(_len6), _key6 = 0; _key6 < _len6; _key6++) {
        args[_key6] = arguments[_key6];
    }

    return args.every(function (arg) {
        return getType(arg) === 'promise';
    });
}
/**
 * 转classname
 * @param v
 */
function toClassNames(v) {
    switch (getType(v)) {
        case 'array':
            {
                return v.map(toClassNames).join(' ');
            }
        case 'object':
            {
                return Object.keys(v).map(function (key) {
                    return v[key] ? key : '';
                }).join(' ');
            }
        case 'string':
            {
                return v;
            }
        default:
            {
                return '';
            }
    }
}
// setTimeout的封装

// 移除重复元素
function uniqueArr() {
    var arr = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];

    var newArr = [];
    arr.forEach(function (item) {
        if (!newArr.includes(item)) {
            newArr.push(item);
        }
    });
    return newArr;
}
function merge() {
    for (var _len7 = arguments.length, anys = Array(_len7), _key7 = 0; _key7 < _len7; _key7++) {
        anys[_key7] = arguments[_key7];
    }

    var base = anys[0];
    anys.slice(1).forEach(function (any) {
        Object.keys(any).forEach(function (key) {
            base[key] = any[key];
        });
    });
    return base;
}
/**
 * 绑定this
 * @param fn
 * @param ctx
 */
function bindContext(fn, ctx) {
    if (getType(fn).includes('function')) {
        fn = fn.bind(ctx);
    }
    return fn;
}
function uuid() {
    var len = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 8;

    var S = '0123456789qwertyuioopasdfghjklzxcvbnmQWERTYUIOOPASDFGHJKLZXCVBNM';
    var LEN = S.length;
    return ' '.repeat(len).split('').map(function () {
        return S[Math.round(Math.random() * LEN)];
    }).join('');
}
function getComponent() {
    var name = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
    var ctxs = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];

    for (var i = 0; i < ctxs.length; i++) {
        if (ctxs[i].components && ctxs[i].components[name]) {
            return ctxs[i].components[name];
        }
    }
    return registerComponents[name];
}
function getParentCtx() {
    var ctxs = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];

    for (var i = 0; i < ctxs.length; i++) {
        if (ctxs[i] instanceof Component) {
            return ctxs[i];
        }
    }
}
// 如果arr中存在keys中的元素，那么keys中的元素排序提前
function resortArr() {
    for (var _len8 = arguments.length, keys = Array(_len8 > 1 ? _len8 - 1 : 0), _key8 = 1; _key8 < _len8; _key8++) {
        keys[_key8 - 1] = arguments[_key8];
    }

    var arr = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];

    var newArr = [];
    keys.forEach(function (i) {
        if (arr.includes(i)) {
            newArr.push(i);
        }
    });
    arr.forEach(function (i) {
        if (!keys.includes(i)) {
            newArr.push(i);
        }
    });
    return newArr;
}

var classCallCheck = function (instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
};

var createClass = function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);
    if (staticProps) defineProperties(Constructor, staticProps);
    return Constructor;
  };
}();





var defineProperty = function (obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
};



var inherits = function (subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
  }

  subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: {
      value: subClass,
      enumerable: false,
      writable: true,
      configurable: true
    }
  });
  if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
};











var possibleConstructorReturn = function (self, call) {
  if (!self) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }

  return call && (typeof call === "object" || typeof call === "function") ? call : self;
};





var slicedToArray = function () {
  function sliceIterator(arr, i) {
    var _arr = [];
    var _n = true;
    var _d = false;
    var _e = undefined;

    try {
      for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
        _arr.push(_s.value);

        if (i && _arr.length === i) break;
      }
    } catch (err) {
      _d = true;
      _e = err;
    } finally {
      try {
        if (!_n && _i["return"]) _i["return"]();
      } finally {
        if (_d) throw _e;
      }
    }

    return _arr;
  }

  return function (arr, i) {
    if (Array.isArray(arr)) {
      return arr;
    } else if (Symbol.iterator in Object(arr)) {
      return sliceIterator(arr, i);
    } else {
      throw new TypeError("Invalid attempt to destructure non-iterable instance");
    }
  };
}();













var toConsumableArray = function (arr) {
  if (Array.isArray(arr)) {
    for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i];

    return arr2;
  } else {
    return Array.from(arr);
  }
};

/**
 * FVEvents 被用来统一处理事件监听
 * 待对事件统一代理处理，类jQuery形式
 */
var FVEvents = function () {
    function FVEvents() {
        classCallCheck(this, FVEvents);

        this.cache = [];
    }
    /**
     * 事件绑定
     */


    createClass(FVEvents, [{
        key: "on",
        value: function on(element, key, fn) {
            this.cache.push([key, fn]);
            element.addEventListener(key, fn);
            return this;
        }
        /**
         * 事件移除
         */

    }, {
        key: "off",
        value: function off(element, key, fn) {
            this.cache = this.cache.filter(function (_ref) {
                var _ref2 = slicedToArray(_ref, 2),
                    _key = _ref2[0],
                    _fn = _ref2[1];

                if (key === _key && fn === _fn || // 卸载指定key,fn的事件
                key === _key && fn === undefined // 卸载指定key的事件
                || key === undefined && fn === undefined // 卸载所有事件
                ) {
                        element.removeEventListener(_key, _fn);
                        return false;
                    }
            });
            return this;
        }
    }]);
    return FVEvents;
}();

var VirtualDOM = function () {
    function VirtualDOM(parent) {
        classCallCheck(this, VirtualDOM);

        this.exprs = [];
        this.events = new FVEvents();
        this.children = [];
        this.ctxs = [];
        this.unmounted = false;
        if (parent) {
            this.parent = parent;
            this.parent.children.push(this);
        }
    }

    createClass(VirtualDOM, [{
        key: 'unmount',
        value: function unmount() {
            this.exprs.forEach(function (fn) {
                return fn();
            });
            this.dom instanceof HTMLElement && this.events.off(this.dom);
            this.component && this.component.__willUnmount();
            this.unmounted = true;
        }
    }]);
    return VirtualDOM;
}();
var TokenElement = function TokenElement(type, index, value) {
    var origin = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : value;
    classCallCheck(this, TokenElement);

    this.type = type;
    this.index = index;
    this.value = value;
    this.origin = origin;
};
/**
 * AST节点
 * @class ASTNode
 */
var ASTNode = function ASTNode() {
    var tagName = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
    classCallCheck(this, ASTNode);

    this.children = []; // 子节点
    this.props = {}; // props
    this.type = 'element'; // 节点类型
    this.exprs = [];
    this.tagName = tagName;
    // 判断是不是组件
    if (/^[A-Z]/.test(tagName)) {
        this.type = 'component';
    }
};

var queue = [];
var timeout = void 0;
var isUpdating = false;
function addUpdateQueue() {
    var _queue;

    var list = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
    if (isUpdating) {
        // 如果已进入更新之中，则所有因为更新加入队列之中的任务都会立即执行
        list.forEach(function (fn) {
            return fn();
        });
        return;
    }
    clearTimeout(timeout);
    (_queue = queue).push.apply(_queue, toConsumableArray(list));
    // setTimeout执行时间明显比0ms要长很多，但是Performance并没有记录函数执行
    // 经排查发现是mac上chrome的页面滚动阻塞了异步事件的执行
    timeout = setTimeout(forceUpdate, 0);
}
function forceUpdate() {
    var afterFn = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : function () {};

    // console.log('setTimeout等待时长', Date.now() - realtime)
    isUpdating = true;
    var haveExec = [];
    queue.forEach(function (fn) {
        // 查看是否执行
        if (!haveExec.includes(fn)) {
            haveExec.push(fn);
            fn();
        }
    });
    isUpdating = false;
    queue = [];
    // console.log('执行时长', Date.now() - time)
    afterFn();
}

var Observe = function Observe() {
    classCallCheck(this, Observe);
};
var defaultCurrent = function defaultCurrent() {
    return function () {};
};
// observer数据get时，进行依赖手机
var currentFn = defaultCurrent;
function resetCurrentFn() {
    currentFn = defaultCurrent;
}
/**
 * 依赖
 * @class Depends
 */
var Depends = function () {
    function Depends(root, key) {
        classCallCheck(this, Depends);

        this.list = [];
        this.root = root;
        this.key = key;
    }

    createClass(Depends, [{
        key: "collect",
        value: function collect() {
            var _this = this;

            if (currentFn !== defaultCurrent) {
                currentFn(function (fn) {
                    // 获取依赖函数，并返回移除依赖函数
                    !_this.list.includes(fn) && _this.list.push(fn);
                    return function () {
                        _this.list = _this.list.filter(function (i) {
                            return i !== fn;
                        });
                    };
                }, this);
            }
        }
    }, {
        key: "run",
        value: function run(key) {
            addUpdateQueue(this.list, this.key);
        }
    }]);
    return Depends;
}();

var ObserveId = function ObserveId() {
    classCallCheck(this, ObserveId);

    this.id = uuid() + ObserveId.id++;
    this.keys = [];
};

ObserveId.id = 0;
function addObserverId(newObj) {
    if (newObj.__observeId__ instanceof ObserveId) {
        return;
    }
    Object.defineProperty(newObj, '__observeId__', {
        value: new ObserveId(),
        configurable: false,
        writable: false,
        enumerable: false
    });
}
function isObserve(obj) {
    return obj instanceof Observe || isArray(obj) && obj.__observe__;
}
function addObserve(ctx, key) {
    var defaultValue = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : ctx[key];
    var options = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : { deep: false };

    addObserverId(ctx);
    // 这里隐含了一个bug，如果state,prop被更改，就懵逼了，因此设置state、props writable: false
    if (ctx.__observeId__.keys.includes(key)) {
        ctx[key] = defaultValue; // 数据已监听，则更新
        return;
    } else {
        ctx.__observeId__.keys.push(key);
    }
    var value = bindContext(defaultValue, ctx);
    // 依赖此key的函数
    var depends = new Depends(ctx, key);
    var isResetValue = true;
    // 默认bind this
    Object.defineProperty(ctx, key, {
        get: function get$$1() {
            // 收集依赖
            depends.collect();
            // 只有在被获取的时候，才会对数据进行observe
            if (isResetValue && options.deep) {
                value = observer(value, Object.assign({}, options, { parentDepend: depends }));
            }
            isResetValue = false;
            return value;
        },
        set: function set$$1(newValue) {
            // 每次值更新都会触发更新
            isResetValue = true;
            value = bindContext(newValue, ctx);
            // 触发依赖函数更新
            depends.run();
        },

        enumerable: true
    });
}
/**
 * 监听数组
 * @param arr
 * @param parentDepends
 */
function observeArr() {
    var arr = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
    var options = arguments[1];

    var newArr = arr.map(function (item) {
        return observer(item);
    });
    Object.defineProperty(newArr, '__observe__', {
        value: true,
        enumerable: false,
        writable: false,
        configurable: false
    });
    ['splice', 'push', 'shift', 'unshift', 'pop'].forEach(function (key) {
        var value = [][key].bind(newArr);
        // 如果数组长度被修改，通知他的父元节点
        Object.defineProperty(newArr, key, {
            get: function get$$1() {
                return function () {
                    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
                        args[_key] = arguments[_key];
                    }

                    if (options.deep) {
                        if (key == 'push' || key == 'unshift') {
                            args = args.map(function (i) {
                                return observer(i);
                            });
                        } else if (key == 'splice') {
                            args = args.slice(0, 2).concat(args.slice(2).map(function (i) {
                                return observer(i);
                            }));
                        }
                    }
                    var result = value.apply(undefined, toConsumableArray(args));
                    // 对于数组的变化，直接出发调用数组的依赖
                    options.parentDepend && options.parentDepend.run();
                    return result;
                };
            },

            enumerable: false
        });
    });
    return newArr;
}
/**
 * 监听对象
 * @param obj
 * @param init
 */
function observeObj() {
    var obj = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    var options = arguments[1];

    var newObj = new Observe();
    // 添加id
    addObserverId(newObj);
    Object.keys(obj).forEach(function (key) {
        addObserve(newObj, key, obj[key], options);
    });
    return newObj;
}
/**
 * 构造一个新的observe对象
 * @param {objet} obj
 * @returns
 */
function observer(obj) {
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : { deep: false };

    if (isObserve(obj)) {
        return obj;
    }
    switch (getType(obj)) {
        case 'array':
            return observeArr(obj, options);
        case 'object':
            return observeObj(obj, options);
        default:
            return obj;
    }
}
function observerDeep(obj) {
    return observer(obj, { deep: true });
}
/**
 * 接受函数，当依赖的数据发生变化后，会立即执行函数
 *
 * @param {function} fn
 * @returns
 */
function autorun(fn) {
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    var destoryDepends = [];
    var depends = [];
    // 销毁依赖
    var destory = function destory() {
        destoryDepends.forEach(function (fn) {
            return fn();
        });
        destoryDepends = [];
        depends.splice(0, depends.length);
    };
    destory.depends = depends;
    var wrapFn = function wrapFn() {
        // 显示之前依赖
        // console.log('before', depends.map(i => i.key))
        destory(); // 销毁上次依赖监听
        // 收集本次依赖
        currentFn = function currentFn(getDestory, depend) {
            destoryDepends.push(getDestory(wrapFn));
            depends.push(depend);
            return wrapFn;
        };
        var result = fn();
        // 重置回默认值
        resetCurrentFn();
        // 显示之前依赖
        // console.log('after', depends.map(i => i.key))
        isFunction(options.callback) && options.callback(result);
    };
    wrapFn.options = options;
    // 立即执行
    wrapFn();
    return destory;
}

var parseExpr = function () {
    var cache = {};
    return function parseExpr(body) {
        if (cache[body]) {
            return cache[body];
        }
        // 去除字符串，剩下的都是变量
        // 对于关键字new 和 对象的支持很懵逼
        var params = (body.replace(/'[^']*'|"[^"]*"/g, ' ') // 移除字符串 'ddd' "ddd"
        .replace(/([A-Za-z_$][A-Za-z0-9_$]*\s*)?:/g, '') // 移除对象key { aa: }
        .match(/\.?[A-Za-z_$][A-Za-z0-9_$]*\s*/g) || [] // 获取所有变量 .?aa
        ).filter(function (i) {
            return !/^\.|new\s+/.test(i);
        }) // 去除.aa new
        .map(function (i) {
            return i.trim();
        }); // 去除空格
        params = uniqueArr(params);
        var result = {
            params: params,
            body: body,
            fn: new (Function.prototype.bind.apply(Function, [null].concat(toConsumableArray(params), ['return ' + body])))()
        };
        cache[body] = result;
        return result;
    };
}();

// 分割表达式，只处理不重复的分隔符|
var parseFilter = function () {
    var parseFilterCache = {};
    return function parseFilter() {
        var str = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';

        if (parseFilterCache[str]) {
            return parseFilterCache[str];
        }
        var exprArr = [];
        var current = '';
        var index = 0;
        while (index < str.length) {
            var char = str[index];
            if (char === '|' && !/\|\s*$/.test(current) && !/^\s*\|/.test(str.slice(index + 1))) {
                exprArr.push(current);
                current = '';
            } else {
                current += char;
            }
            index += 1;
        }
        exprArr.push(current);
        var result = {
            expr: exprArr[0],
            pipes: exprArr.slice(1).map(function (i) {
                return i.trim();
            }).filter(function (i) {
                return i;
            })
        };
        parseFilterCache[str] = result;
        return result;
    };
}();

var pipes = [];
function addPipe() {
    pipes.push.apply(pipes, arguments);
}
/**
 * pipe 上一个函数返回结果作为下一个函数的输入
 * @param fns
 */
function handlePipe() {
    for (var _len = arguments.length, fns = Array(_len), _key = 0; _key < _len; _key++) {
        fns[_key] = arguments[_key];
    }

    return function (arg) {
        var result = arg;
        fns.forEach(function (fn) {
            result = fn(result);
        });
        return result;
    };
}
function getPipes(exprs, ctxs) {
    return handlePipe.apply(undefined, toConsumableArray(exprs.map(function (expr) {
        return execExprIm(expr, [].concat(toConsumableArray(ctxs), pipes));
    })));
}
/**
 * 从作用域链中获取指定key的值
 * @param key
 * @param ctxs
 */
function getValue(key, ctxs) {
    for (var i = 0; i < ctxs.length; i++) {
        if (ctxs[i].hasOwnProperty(key) || ctxs[i][key] !== undefined) {
            return ctxs[i][key];
        }
    }
    if (key === 'true') {
        return true;
    }
    if (key === 'false') {
        return false;
    }
    return window[key];
}
function execExprIm() {
    var expr = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
    var ctxs = arguments[1];

    var _parseFilter = parseFilter(expr),
        inputExpr = _parseFilter.expr,
        pipeExprs = _parseFilter.pipes;
    // 我们不合并对象，因为对象可能是observable的，这里通过with嵌套的形式


    var parseResult = parseExpr(inputExpr);
    var input = parseResult.fn.apply(parseResult, toConsumableArray(parseResult.params.map(function (key) {
        return getValue(key, ctxs);
    })));
    // const names = ctxs.map((i, index) => '__with__local__' + index)
    // let body = `return ${inputExpr}`
    // names.reverse().forEach(i => {
    //     body = `with (${i}) {
    //         ${body}
    //      }`
    // })
    // const input = new Function(...names, body)(...ctxs)
    if (pipes.length > 1) {
        return getPipes(pipeExprs, ctxs)(input);
    }
    return input;
}
/**
 * 执行表达式
 * @param {string} expr
 * @param {any[]} ctxs
 * @param {(result: any) => void} fn
 * @returns
 */
function execExpr(expr, ctxs, fn) {
    var transform = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;

    var oldValue = void 0;
    var newValueCache = void 0;
    var execTime = 0;
    function isEqual(newValue, oldValue) {
        if (newValue !== oldValue) {
            return false;
        }
        // 数组一直变化
        if (isArray(newValue)) {
            return false;
        }
        return true;
    }
    return fn && autorun(function () {
        return execExprIm(expr, ctxs);
    }, {
        callback: function callback(newValue) {
            oldValue = newValueCache;
            newValueCache = newValue;
            var equal = isEqual(newValue, oldValue);
            if (!isEqual(newValue, oldValue)) {
                execTime += 1;
                fn(newValue, oldValue, execTime);
            }
        },
        async: transform,
        expr: expr
    });
}

function updateClassName(element, classNames) {
    element.className = Object.keys(classNames).map(function (key) {
        return classNames[key];
    }).map(function (i) {
        return i || '';
    }).join(' ').trim();
}
function testClass(vdom) {
    var type = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';
    var ast = vdom.ast,
        element = vdom.dom;

    type += type ? '-' : '';
    var classProperties = ["@" + type + "class", type + "class", "@" + type + "mclass", type + "mclass"];
    return Object.keys(ast.props).some(function (key) {
        return classProperties.includes(key);
    });
}
// class mclass
// enter-class enter-mclass
// leave-class leave-mclass
function handleClass(vdom, ctxs, key) {
    var type = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : '';
    var node = vdom.ast,
        element = vdom.dom;

    var value = node.props[key];
    var classNames = vdom.classNames = vdom.classNames || {};
    type += type ? '-' : '';
    if (key === ":" + type + "class") {
        vdom.exprs.push(execExpr(value, ctxs, function (newValue, oldValue) {
            classNames[key] = toClassNames(newValue);
            updateClassName(element, classNames);
        }));
    } else if (key === type + "class") {
        classNames[key] = value;
        updateClassName(element, classNames);
    } else if (key === ":" + type + "mclass") {
        vdom.exprs.push(execExpr(value, ctxs, function (newValue, oldValue) {
            newValue = toClassNames(newValue).split(/\s+/g).map(function (key) {
                return (ctxs[0].mclass || {})[key];
            }).join(' ');
            classNames[key] = newValue;
            updateClassName(element, classNames);
        }));
    } else if (key === type + "mclass") {
        classNames[key] = value.split(/\s+/g).map(function (key) {
            return (ctxs[0].mclass || {})[key];
        }).join(' ');
        updateClassName(element, classNames);
    } else {
        return false;
    }
    return true;
}

function handleLeave(vdom) {
    var leaveTime = vdom.ast.props.leaveTime;

    if (vdom.dom && leaveTime && testClass(vdom, 'leave')) {
        // vdom.dom.className += ` ${leaveClass}`
        Object.keys(vdom.ast.props).forEach(function (key) {
            handleClass(vdom, vdom.ctxs, key, 'leave');
        });
        setTimeout(function () {
            vdom.dom && vdom.dom.parentElement && vdom.dom.parentElement.removeChild(vdom.dom);
        }, +leaveTime);
        return false;
    }
    return true;
}
/**
 * dom加载成功后，同步做某些事情
 * @param vdom
 */
function handleEnter(vdom) {
    if (vdom.dom && testClass(vdom, 'enter')) {
        Object.keys(vdom.ast.props).forEach(function (key) {
            handleClass(vdom, vdom.ctxs, key, 'enter');
        });
    }
}

function unmountNode(vdom) {
    var removeDOM = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;

    // 如果当前节点有真实dom映射，则子节点不再操作dom移除，提升性能
    vdom.children.forEach(function (i) {
        return unmountNode(i, removeDOM && !vdom.dom);
    });
    vdom.unmount();
    // 如果vdom上有leave leaveTime
    if (removeDOM && vdom.dom && handleLeave(vdom)) {
        vdom.dom.parentElement && vdom.dom.parentElement.removeChild(vdom.dom);
    }
    if (vdom.parent) {
        vdom.parent.children = vdom.parent.children.filter(function (i) {
            return i !== vdom;
        });
    }
}
/**
 * 卸载子元素
 * @param {any} ele
 */
function unmountChildren(vdom) {
    vdom.children.forEach(function (child) {
        unmountNode(child);
    });
    vdom.children = [];
}

var Component = function () {
    function Component() {
        var _this = this;

        classCallCheck(this, Component);

        // 模板
        this.template = '';
        // 状态
        this.state = {};
        // props
        this.props = {};
        // 子组件
        this.components = {};
        // 子组件
        this.children = [];
        // 指定dom
        this.refs = {};
        this.vdom = new VirtualDOM();
        // 方便template直接获取经过复杂计算的数据
        this.computed = {};
        // 触发props上的事件
        this.$emit = function (key) {
            for (var _len = arguments.length, data = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
                data[_key - 1] = arguments[_key];
            }

            var parent = _this.parent;
            var stopBubble = false;
            while (!stopBubble && parent) {
                var fn = parent.emit[key] || parent[key];
                if (isFunction(fn)) {
                    stopBubble = fn.call.apply(fn, [parent].concat(data)) === false;
                }
                parent = parent.parent;
            }
        };
        this.$emitChildren = function (key) {
            for (var _len2 = arguments.length, data = Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
                data[_key2 - 1] = arguments[_key2];
            }

            function children(node) {
                node.children.forEach(function (item) {
                    var fn = item.emit[key] || item[key];
                    isFunction(fn) && fn.call.apply(fn, [item].concat(data));
                    children(item);
                });
            }
            children(_this);
        };
        this.$emitSiblings = function (key) {
            for (var _len3 = arguments.length, data = Array(_len3 > 1 ? _len3 - 1 : 0), _key3 = 1; _key3 < _len3; _key3++) {
                data[_key3 - 1] = arguments[_key3];
            }

            _this.parent && _this.parent.children.forEach(function (item) {
                if (item !== _this) {
                    var fn = item.emit[key] || item[key];
                    isFunction(fn) && fn.call.apply(fn, [item].concat(data));
                }
            });
        };
        this.emit = {};
    }

    createClass(Component, [{
        key: "render",
        value: function render() {
            return this.template;
        }
    }, {
        key: "willMount",
        value: function willMount() {}
    }, {
        key: "didMount",
        value: function didMount() {}
    }, {
        key: "didUpdate",
        value: function didUpdate() {}
        // 内部方法，触发组件卸载

    }, {
        key: "__willUnmount",
        value: function __willUnmount() {
            var _this2 = this;

            this.children.forEach(function (com) {
                return com.__willUnmount();
            });
            this.willUnmount();
            unmountNode(this.vdom);
            this.children = [];
            if (this.parent) {
                this.parent.children = this.parent.children.filter(function (i) {
                    return i !== _this2;
                });
            }
        }
    }, {
        key: "willUnmount",
        value: function willUnmount() {}
    }]);
    return Component;
}();

Component.defaultProps = {};

// 解析template
// 有时候我们不想使用jsx，不想使用babel编译💊
// 那就使用类似vue angular之类的字符串模板吧
// 使用模板编译的好处有哪些？，模板本身可以作为资源加载，也就是View层
// 自身的逻辑层可以作为控制器
// 再加一个Model作为数据来源
var selfCloseElements = ['img', 'br', 'hr', 'input'];
// 我们应该在解析关键字的同时，保留原始字符串
var M = {
    get SELF_CLOSE() {
        return (/^(\/\s*>)\s*/
        );
    },
    get CLOSE_START() {
        return (/^(<\s*\/)\s*/
        );
    },
    get TAG_CLOSE() {
        return (/^(>)\s*/
        );
    },
    get OPEN_START() {
        return (/^(<)\s*/
        );
    },
    get EQ() {
        return (/^(=)\s*/
        );
    },
    get TAG_NAME() {
        return (/^([a-zA-Z]-?([a-zA-Z0-9]-?)*)\s*/
        );
    },
    get PROPERTY_NAME() {
        return (/^([a-zA-Z@:]-?([a-zA-Z0-9]-?)*)\s*/
        );
    },
    get PROPERTY_VALUE() {
        return (/^"([^"]*)"\s*/
        );
    },
    get EXPR() {
        return (/^{{2}(((?!}{2}).)*)\}{2}\s*/
        );
    },
    get STRING() {
        return (/^[\s\S][^<{]*/
        );
    }
};
/**
 * 字符串转token
 *
 * @param {string} [str='']
 * @returns {TokenElement[]}
 */
function getToken() {
    var str = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';

    var token = [];
    var localStr = str;
    var index = 0;
    // closeStart
    // 获取token，并记解析位置
    function removePreSpace() {
        var _ref = localStr.match(/^\s+/) || [''],
            _ref2 = slicedToArray(_ref, 1),
            space = _ref2[0];

        index += space.length;
        localStr = localStr.slice(space.length);
    }
    function getPrev(index) {
        return token[token.length - index] || {};
    }
    function next() {
        removePreSpace();
        if (localStr.length == 0) return;
        // />
        if (M.SELF_CLOSE.test(localStr)) {
            var _ref3 = localStr.match(M.SELF_CLOSE) || ['', ''],
                _ref4 = slicedToArray(_ref3, 2),
                matchStr = _ref4[0],
                value = _ref4[1];

            token.push(new TokenElement('SELF_CLOSE', index, value, matchStr));
            index += value.length;
            localStr = localStr.slice(value.length);
            return next();
        }
        // </
        if (M.CLOSE_START.test(localStr)) {
            var _ref5 = localStr.match(M.CLOSE_START) || ['', ''],
                _ref6 = slicedToArray(_ref5, 2),
                _matchStr = _ref6[0],
                _value = _ref6[1];

            token.push(new TokenElement('CLOSE_START', index, _value));
            index += _value.length;
            localStr = localStr.slice(_value.length);
            return next();
        }
        // <
        if (M.OPEN_START.test(localStr)) {
            var _ref7 = localStr.match(M.OPEN_START) || ['', ''],
                _ref8 = slicedToArray(_ref7, 2),
                _matchStr2 = _ref8[0],
                _value2 = _ref8[1];

            token.push(new TokenElement('OPEN_START', index, _value2, _matchStr2));
            index += _value2.length;
            localStr = localStr.slice(_value2.length);
            return next();
        }
        // >
        if (M.TAG_CLOSE.test(localStr)) {
            var _ref9 = localStr.match(M.TAG_CLOSE) || ['', ''],
                _ref10 = slicedToArray(_ref9, 2),
                _matchStr3 = _ref10[0],
                _value3 = _ref10[1];

            token.push(new TokenElement('TAG_CLOSE', index, _value3, _matchStr3));
            index += _value3.length;
            localStr = localStr.slice(_value3.length);
            return next();
        }
        // =
        if (M.EQ.test(localStr)) {
            var _ref11 = localStr.match(M.EQ) || ['', ''],
                _ref12 = slicedToArray(_ref11, 2),
                _matchStr4 = _ref12[0],
                _value4 = _ref12[1];

            token.push(new TokenElement('EQ', index, _value4, _matchStr4));
            index += _value4.length;
            localStr = localStr.slice(_value4.length);
            return next();
        }
        // Aaa-bb 向前读一位需要是 OPEN_START | CLOSE_START
        if (M.TAG_NAME.test(localStr) && (getPrev(1).type == 'OPEN_START' || getPrev(1).type == 'CLOSE_START')) {
            var _ref13 = localStr.match(M.TAG_NAME) || ['', ''],
                _ref14 = slicedToArray(_ref13, 2),
                _matchStr5 = _ref14[0],
                _value5 = _ref14[1];

            token.push(new TokenElement('TAG_NAME', index, _value5, _matchStr5));
            index += _value5.length;
            localStr = localStr.slice(_value5.length);
            return next();
        }
        // :@Aaa-bb
        if (M.PROPERTY_NAME.test(localStr)) {
            var _ref15 = localStr.match(M.PROPERTY_NAME) || ['', ''],
                _ref16 = slicedToArray(_ref15, 2),
                _matchStr6 = _ref16[0],
                _value6 = _ref16[1];

            token.push(new TokenElement('PROPERTY_NAME', index, _value6, _matchStr6));
            index += _value6.length;
            localStr = localStr.slice(_value6.length);
            return next();
        }
        // 属性value ""
        if (M.PROPERTY_VALUE.test(localStr) && getPrev(1).type == 'EQ' // 向前读一位需要是 EQ
        && getPrev(2).type == 'PROPERTY_NAME' // 向前读2位需要是 PROPERTY_NAME
        ) {
                // 向前读，需要是
                var _ref17 = localStr.match(M.PROPERTY_VALUE) || ['', ''],
                    _ref18 = slicedToArray(_ref17, 2),
                    _matchStr7 = _ref18[0],
                    _value7 = _ref18[1];

                token.push(new TokenElement('PROPERTY_VALUE', index, _value7, _matchStr7));
                index += _matchStr7.length;
                localStr = localStr.slice(_matchStr7.length);
                return next();
            }
        // 表达式
        if (M.EXPR.test(localStr)) {
            var _ref19 = localStr.match(M.EXPR) || ['', ''],
                _ref20 = slicedToArray(_ref19, 2),
                _matchStr8 = _ref20[0],
                _value8 = _ref20[1];

            token.push(new TokenElement('EXPR', index, _value8, _matchStr8));
            index += _matchStr8.length;
            localStr = localStr.slice(_matchStr8.length);
            return next();
        }
        // 文本节点
        if (M.STRING.test(localStr)) {
            var _ref21 = localStr.match(M.STRING) || [''],
                _ref22 = slicedToArray(_ref21, 1),
                _value9 = _ref22[0];

            token.push(new TokenElement('STRING', index, _value9));
            index += _value9.length;
            localStr = localStr.slice(_value9.length);
            return next();
        }
    }
    next();
    return token;
}
/**
 * 处理解析错误
 *
 * @param {any} token
 * @param {any} template
 * @param {any} message
 */
function handleASTError(token, template, message) {
    var str = template.slice(0, token.index);
    var enter = str.match(/\n/g);
    var row = enter ? enter.length + 1 : 1;
    var column = str.length - str.lastIndexOf('\n');
    console.error('at row:' + row + ' column:' + column + ' \n\n' + template.slice(token.index, token.index + 100) + ' \n\n' + message);
}
// 读取元素
// token[0].type == 'OPEN_START'
// token[1].type == 'TAG_NAME'
// token[2].type == 'TAG_NAME' *
//     token[3].type == 'EQ' && token[4].type == 'PROPERTY_VALUE'
// token[0].type == 'TAG_CLOSE' || token[0].type == 'SELF_CLOSE'
//     Element
// token[0].type == 'CLOSE_START'
// token[1].type == 'TAG_NAME'
// token[2].type == 'TAG_CLOSE'
function toAST() {
    var token = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
    var template = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';

    var root = new ASTNode();
    var currentNode = root;
    var index = 0;
    var currentT = void 0;
    var LEN = token.length;
    function getT(index) {
        return token[index] || {};
    }
    next();
    function next() {
        if (index >= LEN) return;
        // 当前token
        currentT = token[index];
        // open tag | close self tag
        if (currentT.type == 'OPEN_START' && getT(index + 1).type == 'TAG_NAME') {
            // 获取
            var localIndex = index + 2;
            var props = {};
            var tagName = getT(index + 1).value;
            while (getT(localIndex).type == 'TAG_NAME' || getT(localIndex).type == 'PROPERTY_NAME') {
                if (getT(localIndex + 1).type == 'EQ') {
                    if (getT(localIndex + 2).type == 'PROPERTY_VALUE') {
                        props[getT(localIndex).value] = getT(localIndex + 2).value;
                        localIndex += 3;
                        continue;
                    } else {
                        handleASTError(getT(localIndex), template, getT(localIndex).value + ' should have a value');
                    }
                }
                props[getT(localIndex).value] = true;
                localIndex += 1;
            }
            var TAG_TYPE = getT(localIndex).type;
            if (TAG_TYPE == 'TAG_CLOSE' || TAG_TYPE == 'SELF_CLOSE') {
                var node = new ASTNode(tagName);
                node.props = props;
                node.parent = currentNode;
                currentNode.children.push(node);
                if (TAG_TYPE === 'TAG_CLOSE' && !selfCloseElements.includes(tagName)) {
                    currentNode = node;
                }
            }
            index = localIndex + 1;
        } else if (currentT.type == 'CLOSE_START' && getT(index + 1).type == 'TAG_NAME' && getT(index + 2).type == 'TAG_CLOSE') {
            if (currentNode.tagName !== getT(index + 1).value) {
                handleASTError(getT(index + 1), template, 'close tag name should be ' + currentNode.tagName + ', but now is ' + getT(index + 1).value);
            }
            currentNode = currentNode.parent;
            index += 3;
        } else {
            var last = currentNode.children[currentNode.children.length - 1];
            if (currentT.type == 'EXPR') {
                var _node = new ASTNode();
                _node.value = currentT.value;
                _node.type = 'expr';
                _node.parent = currentNode;
                currentNode.children.push(_node);
            } else if (last && last.type === 'text') {
                last.value += currentT.value;
            } else {
                var _node2 = new ASTNode();
                _node2.type = 'text';
                _node2.value = currentT.origin || currentT.value || '';
                _node2.parent = currentNode;
                currentNode.children.push(_node2);
            }
            index++;
        }
        next();
    }
    return root;
}
var cache = {};
// 字符串 => ast
var toAST$1 = function () {
    var template = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';

    // 使用缓存，不用再ast => dom的时候对ast进行修改
    return cache[template] = cache[template] || toAST(getToken(template), template);
};

// 处理数组diff 返回数组变更
function diff() {
    var oldArr = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
    var newArr = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];
    var isKeyExist = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

    newArr = uniqueArr(newArr);
    // getDelete
    var deleteArr = [];
    var keepArr = [];
    var addAll = false;
    var prevIndex = -2;
    var add = void 0;
    if (!isKeyExist) {
        return {
            del: {
                arr: oldArr
            },
            add: {
                before: {
                    key: null,
                    arr: newArr
                },
                after: {
                    key: null,
                    arr: []
                }
            },
            noChange: false
        };
    }
    for (var i = 0; i < oldArr.length; i++) {
        var item = oldArr[i];
        var INDEX = newArr.indexOf(item);
        // console.log(INDEX, item)
        if (INDEX < 0) {
            deleteArr.push(item);
        } else {
            // 判断是否在newArr中连续出现
            if (prevIndex !== -2 && prevIndex + 1 !== INDEX) {
                addAll = true;
                deleteArr = oldArr;
                keepArr = [];
                break;
            } else {
                keepArr.push(item);
            }
            prevIndex = INDEX;
        }
    }
    if (addAll || !keepArr.length) {
        add = {
            before: {
                key: null,
                arr: newArr
            },
            after: {
                key: 0,
                arr: []
            }
        };
    } else {
        var start = newArr.indexOf(keepArr[0]);
        var end = newArr.indexOf(keepArr[keepArr.length - 1]);
        add = {
            before: {
                key: keepArr[0],
                arr: newArr.slice(0, start)
            },
            after: {
                key: keepArr[keepArr.length - 1],
                arr: newArr.slice(end + 1)
            }
        };
    }
    // 计算新增数组
    return {
        del: {
            arr: deleteArr
        },
        add: add,
        noChange: add.before.arr.length === 0 && add.after.arr.length === 0 && deleteArr.length === 0
    };
}

var isScroll = false;
var timeout$1 = void 0;
window.addEventListener('scroll', function () {
    isScroll = true;
    clearTimeout(timeout$1);
    timeout$1 = setTimeout(function () {
        isScroll = false;
    }, 50);
});
// 事件别名
var eventAlias = {
    enter: function enter(fn) {
        return [{
            eventName: 'keydown',
            listener: function listener(event) {
                for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
                    args[_key - 1] = arguments[_key];
                }

                if (event.keyCode == 13) {
                    fn.apply(undefined, [event].concat(args));
                }
            }
        }];
    },
    up: function up(fn) {
        return [{
            eventName: 'keydown',
            listener: function listener(event) {
                for (var _len2 = arguments.length, args = Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
                    args[_key2 - 1] = arguments[_key2];
                }

                if (event.keyCode == 38) {
                    fn.apply(undefined, [event].concat(args));
                }
            }
        }];
    },
    down: function down(fn) {
        return [{
            eventName: 'keydown',
            listener: function listener(event) {
                for (var _len3 = arguments.length, args = Array(_len3 > 1 ? _len3 - 1 : 0), _key3 = 1; _key3 < _len3; _key3++) {
                    args[_key3 - 1] = arguments[_key3];
                }

                if (event.keyCode == 40) {
                    fn.apply(undefined, [event].concat(args));
                }
            }
        }];
    },
    left: function left(fn) {
        return [{
            eventName: 'keydown',
            listener: function listener(event) {
                for (var _len4 = arguments.length, args = Array(_len4 > 1 ? _len4 - 1 : 0), _key4 = 1; _key4 < _len4; _key4++) {
                    args[_key4 - 1] = arguments[_key4];
                }

                if (event.keyCode == 37) {
                    fn.apply(undefined, [event].concat(args));
                }
            }
        }];
    },
    esc: function esc(fn) {
        return [{
            eventName: 'keyup',
            listener: function listener(event) {
                for (var _len5 = arguments.length, args = Array(_len5 > 1 ? _len5 - 1 : 0), _key5 = 1; _key5 < _len5; _key5++) {
                    args[_key5 - 1] = arguments[_key5];
                }

                if (event.keyCode == 27) {
                    fn.apply(undefined, [event].concat(args));
                }
            }
        }];
    },
    ctrlEnter: function ctrlEnter(fn) {
        var recodeKey = {
            ctrl: false,
            enter: false
        };
        return [{
            eventName: 'keydown',
            listener: function listener(event) {
                for (var _len6 = arguments.length, args = Array(_len6 > 1 ? _len6 - 1 : 0), _key6 = 1; _key6 < _len6; _key6++) {
                    args[_key6 - 1] = arguments[_key6];
                }

                if (event.keyCode == 13) {
                    recodeKey.enter = true;
                } else if (event.keyCode == 17) {
                    recodeKey.ctrl = true;
                }
                recodeKey.enter && recodeKey.ctrl && fn.apply(undefined, args);
            }
        }, {
            eventName: 'keyup',
            listener: function listener(event) {
                if (event.keyCode == 13) {
                    recodeKey.enter = false;
                } else if (event.keyCode == 17) {
                    recodeKey.ctrl = false;
                }
            }
        }];
    },
    click: function click(fn) {
        if (window.navigator.userAgent.toLowerCase().match(/android/) && 0) {
            var time = 0;
            var isMove = false;
            return [{
                eventName: 'touchstart',
                listener: function listener(event) {
                    time = Date.now();
                }
            }, {
                eventName: 'touchmove',
                listener: function listener(event) {
                    isMove = true;
                }
            }, {
                eventName: 'touchend',
                listener: function listener(event) {
                    !isScroll && !isMove && Date.now() - time < 200 && fn(event);
                    isMove = false;
                }
            }];
        } else {
            return [{
                eventName: 'click',
                listener: fn
            }];
        }
    }
};
/**
 * 添加事件别名
 * @param eventName
 * @param fn
 */
function addEventAlias(eventName, fn) {
    eventAlias[eventName] = fn;
}

function handleStyle(style) {
    switch (getType(style)) {
        case 'string':
            {
                return style;
            }
        case 'array':
            {
                return style.map(handleStyle).join(';');
            }
        case 'object':
            {
                return Object.entries(style).map(function (_ref) {
                    var _ref2 = slicedToArray(_ref, 2),
                        key = _ref2[0],
                        value = _ref2[1];

                    if (isString(value)) {
                        var KEY = key.replace(/[A-Z]/g, function ($1) {
                            return '-' + $1.toLowerCase();
                        });
                        return KEY + ': ' + value;
                    }
                    return '';
                }).filter(function (i) {
                    return i;
                }).join(';');
            }
        default:
            {
                return '';
            }
    }
}

function handleVFor(value, element, ctxs, vdom, node) {
    var _value$split$map = value.split(' in ').map(function (i) {
        return i.trim();
    }),
        _value$split$map2 = slicedToArray(_value$split$map, 2),
        itemIndex = _value$split$map2[0],
        arrName = _value$split$map2[1];

    var _itemIndex$replace$sp = itemIndex.replace(/(^\s*\()|(\)\s*$)/g, '').split(',').map(function (i) {
        return i.trim();
    }),
        _itemIndex$replace$sp2 = slicedToArray(_itemIndex$replace$sp, 2),
        itemName = _itemIndex$replace$sp2[0],
        indexName = _itemIndex$replace$sp2[1];

    var isExeced = false; // 是否执行过
    var cacheKeys = [];
    var cacheKeyVdom = {};
    var keyValue = node.children[0] && (node.children[0].props['key'] || node.children[0].props[':key']);
    vdom.exprs.push(execExpr(arrName, ctxs, function (newValue) {
        if (node.children.length > 1) {
            console.error('v-for just should have one child');
        }
        // diff cache key
        var newKeyValue = newValue.map(function (item, index) {
            var _ref;

            var key = void 0;
            execExpr(keyValue, [].concat(toConsumableArray(ctxs), [(_ref = {}, defineProperty(_ref, itemName, item), defineProperty(_ref, indexName, index), _ref)]), function (newValue) {
                key = newValue;
            })();
            return {
                key: key,
                item: item
            };
        });
        // console.log(newKeyValue)
        var newKyes = newKeyValue.map(function (i) {
            return i.key;
        });

        var _diff = diff(cacheKeys, newKyes, keyValue),
            add = _diff.add,
            del = _diff.del,
            noChange = _diff.noChange;

        if (noChange) return;
        cacheKeys = newKyes;
        // console.log('数组更新:', newValue, add, del)
        if (isExeced) {
            // 存在key，卸载需要删除的key对应的vdom，否则整体卸载
            if (keyValue) {
                // return
                del.arr.forEach(function (key) {
                    cacheKeyVdom[key] && unmountChildren(cacheKeyVdom[key].vdom);
                    delete cacheKeyVdom[key]; // 删除缓存
                });
            } else {
                unmountChildren(vdom);
            }
        }
        isExeced = true;
        // 我们只处理 移除 + 头尾新增的情况
        // key不发生变化的需要更新index
        // key新增的还是需要新增
        var childNode = element.childNodes && element.childNodes[0];
        newKeyValue.forEach(function (keyItem, index) {
            var key = keyItem.key,
                item = keyItem.item;
            // 不存在就新增，存在就更新

            if (!cacheKeyVdom[key]) {
                var dd = {};
                indexName && (dd[indexName] = index);
                itemName && (dd[itemName] = item);
                var observeIndexItem = observer(dd);
                var PE = add.before.arr.includes(key) ? {
                    appendChild: function appendChild(newNode) {
                        childNode ? element.insertBefore(newNode, childNode) : element.appendChild(newNode);
                        return newNode;
                    }
                } : element;
                var result = transform(node, PE, [].concat(toConsumableArray(ctxs), [observeIndexItem]), vdom);
                // 如果没有key就不要加入缓存了
                if (keyValue) {
                    cacheKeyVdom[key] = {
                        vdom: result,
                        observeIndexItem: observeIndexItem
                    };
                }
            } else {
                var hh = cacheKeyVdom[key].observeIndexItem;
                // itemName && (hh[itemName] = item)
                indexName && (hh[indexName] = index);
            }
        });
    }));
}
/**
 * 添加属性
 *
 * @param {HTMLElement} element
 * @param {any} node
 * @param {array} ctxs
 * @returns
 */
function addProperties(element, vdom, ctxs) {
    var node = vdom.ast;

    var info = {
        transformChildren: true
    };
    resortArr(Object.keys(node.props), ':key', 'v-if', 'v-for', 'v-show').forEach(function (key) {
        var value = node.props[key];
        // 处理class
        if (handleClass(vdom, ctxs, key)) return;
        var KEY = key.slice(1);
        // 处理事件绑定
        if (key.startsWith('@')) {
            var aliasListeners = [];
            vdom.exprs.push(execExpr(value, ctxs, function (newValue, oldValue) {
                if (eventAlias[KEY]) {
                    // 使用事件别名
                    aliasListeners.forEach(function (aliasListener) {
                        vdom.events.off(element, aliasListener.eventName, aliasListener.listener);
                    });
                    aliasListeners = eventAlias[KEY](newValue);
                    aliasListeners.forEach(function (aliasListener) {
                        vdom.events.on(element, aliasListener.eventName, aliasListener.listener);
                    });
                } else {
                    vdom.events.off(element, KEY, oldValue);
                    vdom.events.on(element, KEY, newValue);
                }
            }));
        } else if (key.startsWith(':')) {
            vdom.exprs.push(execExpr(value, ctxs, function (newValue, oldValue, execTime) {
                if (node.tagName == 'input' && KEY == 'checked') {
                    element[KEY] = newValue;
                    return;
                }
                if (KEY === 'style') {
                    newValue = handleStyle(newValue);
                }
                element.setAttribute(KEY, newValue);
                if (KEY === 'key' && oldValue !== newValue && execTime > 1) {
                    // 如果key发生变化，会卸载原有vdom，重新渲染
                    handleKeyChange(vdom);
                }
            }));
        } else if (key.startsWith('v-')) {
            // 显示
            if (key === 'v-show') {
                vdom.exprs.push(execExpr(value, ctxs, function (newValue, oldValue) {
                    element.style.cssText += ';display: ' + (newValue ? 'block' : 'none') + ';';
                }));
            } else if (key === 'v-for') {
                info.transformChildren = false;
                handleVFor(value, element, ctxs, vdom, node);
            }
        } else if (key === 'ref') {
            switch (getType(value)) {
                case 'string':
                    {
                        ctxs[0].refs[value] = element;
                        break;
                    }
                case 'function':
                    {
                        value();
                        break;
                    }
            }
        } else {
            element.setAttribute(key, node.props[key]);
        }
    });
    return info;
}
function handleKeyChange(vdom) {
    unmountNode(vdom);
    vdom.reRender && vdom.reRender();
}
/**
 * 处理v-if命令
 *
 * @param {HTMLElement} parent
 * @param {any} node
 * @param {array} ctxs
 */
function handleVIf(parent, node, ctxs, parentVdom) {
    var commentHook = document.createComment('v-if 占位');
    parent.appendChild(commentHook);
    var collect = [];
    var destroy = parentVdom.exprs.push(execExpr(node.props['v-if'], ctxs, function (newValue, oldValue) {
        if (newValue) {
            addElement(function (ele, vdom) {
                vdom && collect.push(vdom);
                ele && commentHook.parentElement && commentHook.parentElement.insertBefore(ele, commentHook);
            }, node, ctxs, parentVdom);
        } else {
            // 如果node
            collect.forEach(function (i) {
                return unmountNode(i);
            });
            collect = [];
        }
    }));
}
/**
 * 获取自定义组件属性
 * @param node
 * @param vdom
 * @param ctxs
 */
function getProps(vdom, ctxs) {
    var node = vdom.ast;

    var newProps = {};
    Object.keys(node.props).forEach(function (key) {
        var value = node.props[key];
        if (/^[@:]/.test(key)) {
            var KEY = key.slice(1);
            vdom.exprs.push(execExpr(value, ctxs, function (newValue, oldValue, execTime) {
                // 如果key为props，则对props进行rest操作，方便子组件对数据的获取
                if (KEY === 'props') {
                    Object.entries(newValue).forEach(function (_ref2) {
                        var _ref3 = slicedToArray(_ref2, 2),
                            k = _ref3[0],
                            v = _ref3[1];

                        addObserve(newProps, k, v);
                    });
                } else {
                    newProps[KEY] = newValue;
                }
                if (KEY === 'key' && oldValue !== newValue && execTime > 1) {
                    // 如果key发生变化，会卸载原有vdom，重新渲染
                    handleKeyChange(vdom);
                }
            }));
        } else {
            newProps[key] = value;
        }
    });
    // 元素传递
    newProps['children'] = {
        node: node,
        ctxs: ctxs
    };
    newProps = observer(newProps);
    return newProps;
}
function isComponent(component, ast) {
    if (isPromise(component) || isFunction(component) || isString(component)) {
        return true;
    }
    console.error(component, ast.tagName + ' should be a Component!!! \u60A8\u53EF\u4EE5\u5728\u7EC4\u4EF6\u7684Components\u5C5E\u6027\u4E2D\u6DFB\u52A0\u5B50\u7EC4\u4EF6\uFF0C\u6216\u8005\u901A\u8FC7Fv.register\u6CE8\u518C\u5168\u5C40\u7EC4\u4EF6');
    return false;
}
/**
 * 添加元素
 *
 * @param {function} appendFn
 * @param {any} node
 * @param {array} ctxs
 * @returns
 */
function addElement(appendFn, ast, ctxs, parentVdom) {
    var vdom = new VirtualDOM(parentVdom);
    vdom.ast = ast;
    vdom.ctxs = ctxs;
    // 方便dom卸载后，重新渲染
    vdom.reRender = function () {
        return addElement(appendFn, ast, ctxs, parentVdom);
    };
    if (/^[A-Z]/.test(ast.tagName)) {
        // 处理子组件
        var Com = getComponent(ast.tagName, ctxs);
        // 判断是否是Component的子类
        if (isComponent(Com, ast)) {
            var renderComponent = function renderComponent(Com) {
                // 因为有可能是异步获取组件，因此这里对vdom进行判断，vdom是否已经被卸载
                if (vdom.unmounted) {
                    console.log('vdom已被卸载，不执行渲染');
                    return;
                }
                // 通过创建一个Comment占位节点，可实无root渲染
                var com = render(Com, getProps(vdom, ctxs), {
                    appendChild: appendFn
                }, vdom);
                com.parent = getParentCtx(ctxs);
                com.parent.children.push(com);
                vdom.component = com;
                // 添加ref
                if (ast.props.ref) {
                    ctxs[0].refs[ast.props.ref] = com;
                }
            };
            // 如果是Promise，可执行懒加载


            appendFn(undefined, vdom);
            if (isPromise(Com)) {
                Com.then(function (Com) {
                    renderComponent(Com);
                });
            } else {
                renderComponent(Com);
            }
        }
    } else if (ast.tagName == 'slot') {
        // 处理slot，获取children后，并不监听变化
        execExpr('props.children', ctxs, function (newValue) {
            transform(newValue.node, {
                appendChild: appendFn
            }, [getProps(vdom, ctxs)].concat(toConsumableArray(newValue.ctxs)), parentVdom);
        })();
    } else {
        var createE = document.createElement(ast.tagName);
        vdom.dom = createE;
        appendFn(createE, vdom);
        var result = addProperties(createE, vdom, ctxs);
        handleEnter(vdom); // 处理enter-class
        result.transformChildren && ast.children && ast.children.length && transform(ast, createE, ctxs, vdom);
    }
    return vdom;
}
/**
 * ast transform to node
 *
 * @param {any} ast
 * @param {HTMLElement} element
 * @param {anray} ctxs
 */
function transform(ast, element, ctxs) {
    var parentVdom = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : new VirtualDOM();

    var vdoms = ast.children.map(function (node) {
        if (node.type === 'element' || node.type === 'component') {
            // 处理v-if指令
            if (node.props['v-if']) {
                handleVIf(element, node, ctxs, parentVdom);
            } else {
                return addElement(function (createE) {
                    createE && element.appendChild(createE);
                }, node, ctxs, parentVdom);
            }
        } else {
            var vdom = new VirtualDOM(parentVdom);
            vdom.ast = ast;
            vdom.ctxs = ctxs;
            var createE = void 0;
            if (node.type === 'expr') {
                createE = document.createTextNode('');
                element.appendChild(createE);
                vdom.exprs.push(execExpr(node.value, ctxs, function (newValue) {
                    createE.textContent = newValue;
                }));
            } else {
                createE = document.createTextNode(node.value);
                element.appendChild(createE);
            }
            vdom.dom = createE;
            parentVdom.children.push(vdom);
            return vdom;
        }
    }).filter(function (i) {
        return i;
    });
    return {
        children: vdoms
    };
}

var componentHook = '__yisec_component_hook__';
/**
 * @param {any} Com
 * @param {*} props
 * @param {HTMLElement} dom
 * @returns {Component}
 */
function render(Com, props, dom, vdom) {
    // 卸载原有dom上挂载的component
    if (dom instanceof HTMLElement && dom[componentHook] && dom[componentHook].vdom && !dom[componentHook].vdom.unmounted) {
        dom[componentHook].__willUnmount();
    }
    // string/function -> Component
    if (isFunction(Com)) {
        // 如果函数没有继承Component，就把它当做render方法
        if (!(Com.prototype instanceof Component)) {
            var renderFn = Com;
            Com = function (_Component) {
                inherits(Com, _Component);

                function Com() {
                    classCallCheck(this, Com);

                    var _this = possibleConstructorReturn(this, (Com.__proto__ || Object.getPrototypeOf(Com)).apply(this, arguments));

                    _this.render = renderFn;
                    return _this;
                }

                return Com;
            }(Component);
        }
    } else if (isString(Com)) {
        var template = Com;
        Com = function (_Component2) {
            inherits(Com, _Component2);

            function Com() {
                classCallCheck(this, Com);

                var _this2 = possibleConstructorReturn(this, (Com.__proto__ || Object.getPrototypeOf(Com)).apply(this, arguments));

                _this2.template = template;
                return _this2;
            }

            return Com;
        }(Component);
    } else {
        console.error('render first param should be a function');
    }
    var ctx = new Com();
    // 把组件实例挂载在dom上
    dom instanceof HTMLElement && (dom[componentHook] = ctx);
    // state 与 props 属性不可被更改
    Object.defineProperty(ctx, 'state', {
        writable: false,
        enumerable: true,
        value: observer(ctx.state, { deep: true })
    });
    Object.defineProperty(ctx, 'props', {
        writable: false,
        enumerable: true,
        value: observer(merge({}, Com.defaultProps || {}, props))
    });
    // 处理computed的key，将其observer化，并挂载在组件实例上
    // 处理需要有个autorun包裹，然后
    // 需要obersev
    Object.keys(ctx.computed).forEach(function (key) {
        addObserve(ctx, key, ctx.computed[key].call(ctx));
        // 待收集依赖
        ctx.vdom.exprs.push(autorun(function () {
            return ctx.computed[key].call(ctx);
        }, {
            callback: function callback(newValue) {
                ctx[key] = newValue;
            }
        }));
    });
    // 即将渲染
    ctx.willMount();
    // 渲染进行中
    var ast = toAST$1(ctx.render());
    ast.ctx = ctx;
    transform(ast, dom, [ctx, ctx.state, ctx.props], ctx.vdom);
    // 渲染完毕
    ctx.didMount();
    return ctx;
}

var Router = {
    hash: false,
    routes: {},
    push: function push(url) {
        window.history.pushState({}, '', this.getFullPath(url));
        this.handleUrlChange(url);
    },
    replace: function replace(url) {
        window.history.replaceState({}, '', this.getFullPath(url));
        this.handleUrlChange(url);
    },
    handleUrlChange: function handleUrlChange(url) {
        var a = document.createElement('a');
        a.href = url;
        var path = a.pathname;
        var result = match(path, this.routes);
        if (result) {
            var _router = result.router,
                params = result.params,
                value = result.value;
            var component = value.component,
                _value$props = value.props,
                props = _value$props === undefined ? {} : _value$props;

            render(component, Object.assign({}, props, { params: params }), document.body);
        }
    },
    getFullPath: function getFullPath(url) {
        return this.hash ? "" + location.pathname + location.search + "#" + url : url;
    },
    getPathname: function getPathname() {
        return (this.hash ? location.hash.slice(1) : location.pathname) || '/';
    }
};
function router(config) {
    Router = Object.assign({}, Router, config);
    window.addEventListener('popstate', function () {
        Router.handleUrlChange(Router.getPathname());
    });
    Router.handleUrlChange(Router.getPathname());
}
register('Link', (_a = function (_Component) {
    inherits(Link, _Component);

    function Link() {
        classCallCheck(this, Link);

        var _this = possibleConstructorReturn(this, (Link.__proto__ || Object.getPrototypeOf(Link)).apply(this, arguments));

        _this.click = function (e) {
            var _this$props = _this.props,
                click = _this$props.click,
                _this$props$replace = _this$props.replace,
                replace = _this$props$replace === undefined ? false : _this$props$replace,
                _this$props$redirect = _this$props.redirect,
                redirect = _this$props$redirect === undefined ? false : _this$props$redirect,
                _this$props$href = _this$props.href,
                href = _this$props$href === undefined ? '' : _this$props$href;

            e.preventDefault();
            click && click(e);
            if (redirect) {
                replace ? location.replace(href) : location.href = href;
            } else if (replace) {
                Router.replace(href);
            } else {
                Router.push(href);
            }
        };
        return _this;
    }

    createClass(Link, [{
        key: "render",
        value: function render$$1() {
            return "\n            <a :data-href=\"href\" @click=\"click\" :class=\"props.class\" :style=\"props.style\">\n                <slot />\n            </a>\n        ";
        }
    }]);
    return Link;
}(Component), _a.defaultProps = {
    href: ''
}, _a));
// 路由匹配
function match() {
    var url = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
    var obj = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    var urlItems = url.trim().split('/');
    var params = {};
    var router = '';
    var matched = Object.keys(obj).some(function (route) {
        var routeItems = route.trim().split('/');
        router = '';
        // 全局匹配的级别最低，一般用来处理404
        if (route === '*') return false;
        // 长度相等，或者路由以*为结尾并且routeItems不能比urlItems长
        if (routeItems.length === urlItems.length || routeItems[routeItems.length - 1] === '*' && routeItems.length <= urlItems.length) {
            params = {}; // 获取参数
            router = route; // 匹配到的路由地址
            return routeItems.every(function (i, index) {
                var urlItemsItem = urlItems[index];
                // 参数匹配
                if (i.startsWith(':')) {
                    // 对 /:id的支持
                    var _i$slice$split = i.slice(1).split('@'),
                        _i$slice$split2 = slicedToArray(_i$slice$split, 2),
                        key = _i$slice$split2[0],
                        reg = _i$slice$split2[1];

                    params[key] = urlItemsItem;
                    // 对正则表达式的支持 /:name@aa.+
                    if (reg) {
                        return new RegExp("^" + reg + "$").test(urlItemsItem);
                    }
                    return true;
                }
                // * 匹配所有
                if (i === '*') {
                    return true;
                }
                // 常规性匹配 Abc*
                if (i.includes('*')) {
                    var _reg = i.replace('*', '.*');
                    return new RegExp("^" + _reg + "$").test(urlItemsItem);
                }
                // 纯文匹配
                return i === urlItemsItem;
            });
        }
        return false;
    });
    if (matched) {
        return {
            params: params,
            url: url,
            router: router,
            value: obj[router]
        };
    } else if (obj['*']) {
        // 观察是否配置了全局匹配
        // 其实此时应该跳转404
        return {
            params: params,
            url: url,
            router: '*',
            value: obj['*']
        };
    }
    return null;
}
var _a;

var index = {
    Component: Component,
    render: render,
    autorun: autorun,
    observer: observer,
    isObserve: isObserve,
    addObserve: addObserve,
    observerDeep: observerDeep,
    register: register,
    addEventAlias: addEventAlias,
    registerComponents: registerComponents,
    addPipe: addPipe,
    forceUpdate: forceUpdate,
    addUpdateQueue: addUpdateQueue,
    router: router
};

exports['default'] = index;
exports.Component = Component;
exports.render = render;
exports.autorun = autorun;
exports.observer = observer;
exports.isObserve = isObserve;
exports.addObserve = addObserve;
exports.observerDeep = observerDeep;
exports.register = register;
exports.addEventAlias = addEventAlias;
exports.registerComponents = registerComponents;
exports.addPipe = addPipe;
exports.forceUpdate = forceUpdate;
exports.addUpdateQueue = addUpdateQueue;
exports.router = router;

Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=yisec.js.map
