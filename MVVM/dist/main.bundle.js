/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 5);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _dep = __webpack_require__(2);

var _dep2 = _interopRequireDefault(_dep);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

//观察者对象，订阅者
var Watcher = function () {
    function Watcher(vm, expression, callback) {
        _classCallCheck(this, Watcher);

        this.callback = callback;
        //vm实例
        this.vm = vm;

        // watch的属性
        this.expression = expression;
        this.callback = callback;

        //订阅的发布者属性id
        this.depIds = {};
        this.oldValue = this.get();
    }

    // 更新视图


    _createClass(Watcher, [{
        key: 'update',
        value: function update() {
            var newValue = this.get();
            var oldValue = this.oldValue;
            if (newValue !== this.oldValue) {
                this.oldValue = newValue;
                this.callback.call(this.vm, newValue, oldValue);
            }
        }

        //添加dep的id,
        //在depIds中没有该dep.id时候，才添加该watch到触发了getter的数据的dep.subs中

    }, {
        key: 'addDep',
        value: function addDep(dep) {
            if (!this.depIds.hasOwnProperty(dep.id)) {
                dep.addSub(this);
                this.depIds[dep.id] = dep;
            }
        }

        //取observer了数据的value,会触发getter,
        //在getter中会判断，Dep.target是否存在，存在，将该watchs添加到Dep的subs,
        //访问到数据的dep,调用到dep.depend
        //进一步调用到Watch的addDep
        //相当于发布者的subs中把订阅了该属性的watch添加进去
        //在该watch中的depIds添加了发布者的id

    }, {
        key: 'get',
        value: function get() {
            _dep2.default.target = this;
            var value = this.getVMVal();
            _dep2.default.target = null;
            return value;
        }

        //取observer的data的value,这里会触发observer了数据的getter,

    }, {
        key: 'getVMVal',
        value: function getVMVal() {
            var expression = this.expression.split('.');
            var value = this.vm;

            expression.forEach(function (val) {
                value = value[val];
            });
            return value;
        }
    }]);

    return Watcher;
}();

exports.default = Watcher;

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };
//arrayMethods是劫持了数组方法的对象


exports.default = observer;

var _dep = __webpack_require__(2);

var _dep2 = _interopRequireDefault(_dep);

var _util = __webpack_require__(3);

var _array = __webpack_require__(6);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

//数组的原型继承
function protoAugment(target, src) {
    target.__proto__ = src;
}
//赋值继承
function copyAugment(target, src, keys) {
    for (var i = 0; i < keys.length; i++) {
        (0, _util.def)(target, key[i], src[key[i]]);
    }
}

function observer(data) {
    //data不存在，或者data不是objuct时返回
    if (!data || (typeof data === 'undefined' ? 'undefined' : _typeof(data)) !== 'object') {
        return;

        //data有__ob__属性并且 Observer.prototype是在data["__ob__"]的原型链上时返回
    } else if (data.hasOwnProperty("__ob__") && data["__ob__"] instanceof Observer) {
        return;
    }

    //Observer data 
    return new Observer(data);
}

var Observer = function () {
    function Observer(data) {
        _classCallCheck(this, Observer);

        this.dep = new _dep2.default();
        (0, _util.def)(data, "__ob__", this);
        this.data = data;

        if (Array.isArray(data)) {
            // 是数组是时候
            var argment = data.__proto__ ? protoAugment : copyAugment;
            //用劫持的对象覆盖数组原型
            argment(data, _array.arrayMethods, Object.keys(_array.arrayMethods));
            //observer arrray
            this.observerArray(data);
        } else {
            this.walk(data);
        }
    }

    //递归observer


    _createClass(Observer, [{
        key: 'walk',
        value: function walk(data) {
            var self = this;
            Object.keys(this.data).forEach(function (key) {
                self.defineReactive(data, key, data[key]);
            });
        }
    }, {
        key: 'observerArray',
        value: function observerArray(items) {
            for (var i = 0; i < items.length; i++) {
                observer(items[i]);
            }
        }
    }, {
        key: 'defineReactive',
        value: function defineReactive(data, key, value) {
            var dep = new _dep2.default(),

            //取到属性的属性描述符
            descriptor = Object.getOwnPropertyDescriptor(data, key);
            log("dep:", dep, data, key, value);

            //属性描述符存在并且属性描述符的configurable为false时返回，configurable为false时不能修改
            if (descriptor && !descriptor.configurable) {
                return;
            }

            //递归监听，是对象的时候返回new Observer(value), 否则undefined
            var childObserver = observer(value);

            Object.defineProperty(data, key, {
                enumerable: true,
                configurable: false,
                get: function get() {

                    if (_dep2.default.target) {
                        // 为这个属性添加观察者watcher
                        dep.depend();
                        if (childObserver) {
                            childObserver.dep.depend();
                        }
                    }
                    return value;
                },
                set: function set(newValue) {
                    if (newValue == value) {
                        return;
                    }
                    if ((typeof newValue === 'undefined' ? 'undefined' : _typeof(newValue)) === 'object') {
                        //观察新值
                        observer(newValue);
                    }
                    value = newValue;
                    // log('dep',dep);
                    // 告诉所有订阅了这个属性的Watcher，数据更新了！
                    dep.notify();
                }
            });
        }
    }]);

    return Observer;
}();

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _watcher = __webpack_require__(0);

var _watcher2 = _interopRequireDefault(_watcher);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var uid = 0;

// 依赖收集类Dep,发布者

var Dep = function () {
    function Dep() {
        _classCallCheck(this, Dep);

        this.id = uid++;
        this.subs = [];
    }

    //添加一个订阅者对象


    _createClass(Dep, [{
        key: 'addSub',
        value: function addSub(sub) {
            this.subs.push(sub);
        }

        // 移除一个订阅者对象*

    }, {
        key: 'removeSub',
        value: function removeSub(sub) {
            var index = this.subs.indexOf(sub);
            if (index != -1) {
                this.subs.splice(index, 1);
            }
        }

        // 依赖收集,根据依赖添加订阅者

    }, {
        key: 'depend',
        value: function depend() {
            Dep.target.addDep(this);
        }

        // 通知所有订阅者

    }, {
        key: 'notify',
        value: function notify() {
            this.subs.forEach(function (sub) {
                return sub.update();
            });
        }
    }]);

    return Dep;
}();

exports.default = Dep;

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.def = def;
exports.debounce = debounce;
function def(obj, key, value, enumerable) {
  Object.defineProperty(obj, key, {
    value: value,
    writeable: true,
    configurable: true,
    enumerable: !!enumerable
  });
}

function debounce(func, wait, immediate) {
  var timeout = null;

  return function () {
    var delay = function delay() {
      timeout = null;
      if (!immediate) {
        func.apply(this, arguments);
      }
    };
    var callnow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(delay, wait);
    console.log(callnow);
    if (callnow) {
      func.apply(this, arguments);
    }
  };
}

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _watcher = __webpack_require__(0);

var _watcher2 = _interopRequireDefault(_watcher);

var _observer = __webpack_require__(1);

var _observer2 = _interopRequireDefault(_observer);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var tagRE = /\{\{\{(.*?)\}\}\}|\{\{(.*?)\}\}/g,
    htmlRE = /^\{\{\{(.*)\}\}\}$/,
    paramsRE = /\((.+)\)/g,
    stringRE = /\'(.*)\'/g;

var Compiler = function () {
    function Compiler(el, vm) {
        _classCallCheck(this, Compiler);

        this.$vm = vm;
        this.$el = this.isElementNode(el) ? el : document.querySelector(el);

        if (this.$el) {
            this.$fragment = this.createFragment(this.$el);
            this.compileElement(this.$fragment);
            this.$el.appendChild(this.$fragment);
        }
    }

    _createClass(Compiler, [{
        key: 'createFragment',
        value: function createFragment(el) {
            var fragment = document.createDocumentFragment(),
                child;

            //遍历原始node子节点，会删除文档树中该dom节点，并且加入生成dom片段中。
            while (child = el.firstChild) {
                fragment.appendChild(child);
            }

            return fragment;
        }
    }, {
        key: 'compileElement',
        value: function compileElement(el) {
            var childNodes = el.childNodes,
                self = this;

            [].slice.call(childNodes).forEach(function (node) {
                var text = node.textContent;
                var reg = /\{\{(.*)\}\}/g;

                if (self.isElementNode(node)) {
                    //node类型为元素
                    self.compileNodeAttr(node);
                } else if (self.isTextNode(node) && reg.test(text)) {
                    //node类型为文本，且存在{{data}}文本
                    self.compileText(node);
                }
            });
        }
    }, {
        key: 'compileNodeAttr',
        value: function compileNodeAttr(node) {
            var nodeAttrs = node.attributes,
                self = this,
                lazyComplier = void 0,
                lazyExp = void 0;

            [].slice.call(nodeAttrs).forEach(function (attr) {
                var attrName = attr.name;
                //是vue指令
                if (self.isDirective(attrName)) {
                    //expression就是属性的值，v-if="data"中的data
                    var expression = attr.value;
                    // directicve 指令名称， v-if="data"中的if
                    var directive = attrName.substring(2);

                    if (directive === 'for') {
                        //处理v-for
                        lazyComplier = directive;
                        lazyExp = expression;
                    } else if (self.isEventDirective(directive)) {
                        //处理on
                        // 为该node绑定事件
                        directiveUtil.addEvent(node, self.$vm, directive, expression);
                    } else {
                        //为该node解析指令(不包含for)
                        directiveUtil[directive] && directiveUtil[directive](node, self.$vm, expression);
                    }
                    // 处理完指令后将其移出（我们F12查看元素是没有指令的）
                    node.removeAttribute(attrName);
                }
            });

            //for指令在这里处理
            if (lazyComplier === 'for') {
                directiveUtil[lazyComplier] && directiveUtil[lazyComplier](node, this.$vm, lazyExp);
            } else if (node.childNodes && node.childNodes.length) {
                self.compileElement(node);
            }
        }
    }, {
        key: 'compileText',
        value: function compileText(node) {
            var _this = this;

            var tokens = this.parseText(node.wholeText);
            var fragment = document.createDocumentFragment();
            tokens.forEach(function (token) {
                var el = void 0;
                if (token.tag) {
                    if (token.html) {
                        el = document.createDocumentFragment();
                        el.$parent = node.parentNode;
                        el.$oncetime = true;
                        directiveUtil.html(el, _this.$vm, token.value);
                    } else {
                        el = document.createTextNode(" ");
                        directiveUtil.text(el, _this.$vm, token.value);
                    }
                } else {
                    el = document.createTextNode(token.value);
                }
                el && fragment.appendChild(el);
            });
            node.parentNode.replaceChild(fragment, node);
        }
    }, {
        key: 'parseText',
        value: function parseText(text) {
            //不存在需要解析的文本，直接返回
            if (!tagRE.test(text)) {
                return;
            }
            var tokens = [];

            //下次匹配的起始索引
            var lastIndex = tagRE.lastIndex = 0;

            var match = void 0,
                index = void 0,
                html = void 0,
                value = void 0;
            debugger;

            while (match = tagRE.exec(text)) {
                //匹配到哦{{}} 或者 {{{}}}在文本中的位置
                index = match.index;
                // 先把{{}} 或者 {{{}}} 之前的文本提取
                if (index > lastIndex) {
                    tokens.push({
                        value: text.slice(lastIndex, index)
                    });
                }
                //html解析还是text解析
                html = htmlRE.test(match[0]);
                value = html ? match[1] : match[2];
                tokens.push({
                    value: value,
                    tag: true,
                    html: html
                });
                lastIndex = index + match[0].length;
            }

            if (lastIndex < text.length) {
                tokens.push({
                    value: text.slice(lastIndex)
                });
            }
            return tokens;
        }
    }, {
        key: 'isDirective',
        value: function isDirective(attr) {
            return attr.indexOf('v-') === 0;
        }
    }, {
        key: 'isEventDirective',
        value: function isEventDirective(dir) {
            return dir.indexOf('on') === 0;
        }
    }, {
        key: 'isElementNode',
        value: function isElementNode(node) {
            return node.nodeType === 1;
        }
    }, {
        key: 'isTextNode',
        value: function isTextNode(node) {
            return node.nodeType === 3;
        }
    }]);

    return Compiler;
}();

//指令处理


exports.default = Compiler;
var directiveUtil = {
    text: function text(node, vm, expression) {
        this.bind(node, vm, expression, 'text');
    },

    html: function html(node, vm, expression) {
        this.bind(node, vm, expression, 'html');
    },

    class: function _class(node, vm, expression) {
        this.bind(node, vm, expression, 'class');
    },

    for: function _for(node, vm, expression) {
        var itemName = expression.split('in')[0].replace(/\s/g, ''),
            arrayName = expression.split('in')[1].replace(/\s/g, '').split('.'),
            parentNode = node.parentNode,
            startNode = document.createTextNode(''),
            endNode = document.createTextNode(''),
            range = document.createRange();

        parentNode.replaceChild(endNode, node);
        parentNode.insertBefore(startNode, endNode);

        var value = vm;
        arrayName.forEach(function (curVal) {
            value = value[curVal];
        });

        value.forEach(function (item, index) {
            var cloneNode = node.cloneNode(true);
            parentNode.insertBefore(cloneNode, endNode);
            var forVm = Object.create(vm);
            forVm.$index = index;
            forVm[itemName] = item;
            new Compiler(cloneNode, forVm);
        });

        new _watcher2.default(vm, arrayName + ".length", function (newValue, oldValue) {
            var _this2 = this;

            range.setStart(startNode, 0);
            range.setEnd(endNode, 0);
            range.deleteContents();
            value.forEach(function (item, index) {
                var cloneNode = node.cloneNode(true);
                parentNode.insertBefore(cloneNode, endNode);
                var forVm = Object.create(_this2);
                forVm.$index = index;
                forVm[itemName] = item;
                new Compiler(cloneNode, forVm);
            });
        });
    },

    model: function model(node, vm, expression) {
        var _this3 = this;

        this.bind(node, vm, expression, 'model');

        var value = this._getVMVal(vm, expression);

        var composing = false;

        node.addEventListener('compositionstart', function () {
            composing = true;
        }, false);

        node.addEventListener('compositionend', function (event) {
            composing = false;
            if (value !== event.target.value) {
                _this3._setVMVal(vm, expression, event.target.value);
            }
        }, false);

        node.addEventListener('input', function (event) {
            if (!composing && value !== event.target.value) {
                _this3._setVMVal(vm, expression, event.target.value);
            }
        }, false);
    },

    bind: function bind(node, vm, expression, directive) {
        var updaterFn = updater[directive + 'Updater'];
        var value = this._getVMVal(vm, expression);
        updaterFn && updaterFn(node, value);
        new _watcher2.default(vm, expression, function (newValue, oldValue) {
            updaterFn && updaterFn(node, newValue, oldValue);
        });
    },

    addEvent: function addEvent(node, vm, directive, expression) {
        var eventType = directive.split(':');
        var fn = vm.$options.methods && vm.$options.methods[expression];

        if (eventType[1] && typeof fn === 'function') {
            node.addEventListener(eventType[1], fn.bind(vm), false);
        } else {
            var match = paramsRE.exec(expression),
                fnName = expression.replace(match[0], ''),
                paramNames = match[1].split(','),
                params = [];

            paramsRE.exec("remove(todo)");
            fn = vm.$options.methods[fnName];
            for (var i = 0; i < paramNames.length; i++) {
                var name = paramNames[i].trim(),
                    stringMatch = stringRE.exec(name);
                if (stringMatch) {
                    params.push(stringMatch[1]);
                } else {
                    params.push(vm[name]);
                }
            }
            node.addEventListener(eventType[1], function () {
                fn.apply(vm, params);
            }, false);
        }
    },

    _getVMVal: function _getVMVal(vm, expression) {
        log('expression', expression);

        expression = expression.trim();
        var value = vm;
        expression = expression.split('.');
        expression.forEach(function (key) {
            if (value.hasOwnProperty(key)) {
                value = value[key];
            } else {
                throw new Error("can not find the property: " + key);
            }
        });

        if ((typeof value === 'undefined' ? 'undefined' : _typeof(value)) === 'object') {
            return JSON.stringify(value);
        } else {
            return value;
        }
    },

    _setVMVal: function _setVMVal(vm, expression, value) {
        expression = expression.trim();
        var data = vm._data;
        expression = expression.split('.');
        expression.forEach(function (key, index) {
            if (index == expression.length - 1) {
                data[key] = value;
            } else {
                data = data[key];
            }
        });
    }
};

var cacheDiv = document.createElement('div');

var updater = {
    textUpdater: function textUpdater(node, value) {
        // v-text指令
        node.textContent = typeof value === 'undefined' ? '' : value;
    },

    htmlUpdater: function htmlUpdater(node, value) {
        if (node.$parent) {
            cacheDiv.innerHTML = value;
            var childNodes = cacheDiv.childNodes,
                doms = [];
            var len = childNodes.length,
                tempNode = void 0;
            if (node.$oncetime) {
                while (len--) {
                    tempNode = childNodes[0];
                    node.appendChild(tempNode);
                    doms.push(tempNode);
                }
                node.$doms = doms;
                node.$oncetime = false;
            } else {
                var newFragment = document.createDocumentFragment();
                while (len--) {
                    tempNode = childNodes[0];
                    newFragment.appendChild(tempNode);
                    doms.push(tempNode);
                }
                node.$parent.insertBefore(newFragment, node.$doms[0]);
                node.$doms.forEach(function (childNode) {
                    node.$parent.removeChild(childNode);
                });
                node.$doms = doms;
            }
        } else {
            // v-html指令
            node.innerHTML = typeof value === 'undefined' ? '' : value;
        }
    },

    classUpdater: function classUpdater(node, value, oldValue) {
        var nodeNames = node.className;
        if (oldValue) {
            nodeNames = nodeNames.replace(oldValue, '').replace(/\s$/, '');
        }
        var space = nodeNames && value ? ' ' : '';
        node.className = nodeNames + space + value;
    },

    modelUpdater: function modelUpdater(node, value) {
        node.value = typeof value === 'undefined' ? '' : value;
    }
};

/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _watcher = __webpack_require__(0);

var _watcher2 = _interopRequireDefault(_watcher);

var _observer = __webpack_require__(1);

var _observer2 = _interopRequireDefault(_observer);

var _compiler = __webpack_require__(4);

var _compiler2 = _interopRequireDefault(_compiler);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var MVVM = function () {
    function MVVM(options) {
        var _this = this;

        _classCallCheck(this, MVVM);

        this.$options = options;
        this._data = this.$options.data;
        var self = this;
        //data里的数据代理到vm上。
        Object.keys(this.$options.data).forEach(function (key) {
            _this._proxy(key);
        });
        (0, _observer2.default)(this._data);

        this.$compiler = new _compiler2.default(options.el || document.body, this);
    }

    _createClass(MVVM, [{
        key: '$watch',
        value: function $watch(expression, callback) {
            new _watcher2.default(this, expression, callback);
            // console.log(new Watcher(this, expression, callback))
            log(new _watcher2.default(this, expression, callback));
        }

        //代理

    }, {
        key: '_proxy',
        value: function _proxy(key) {
            var self = this;
            Object.defineProperty(this, key, {
                configurable: false,
                enumerable: true,
                get: function get() {
                    return self._data[key];
                },
                set: function set(value) {
                    self._data[key] = value;
                }
            });
        }
    }]);

    return MVVM;
}();

window.MVVM = MVVM;

/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.arrayMethods = undefined;

var _util = __webpack_require__(3);

//遇到原生数组的原型
var arrayProto = Array.prototype;
var arrayMethods = exports.arrayMethods = Object.create(arrayProto);

//不污染原型的情况下重写下列数组方法
['push', 'pop', 'shift', 'unshift', 'splice', 'sort', 'reverse'].forEach(function (method) {

    //缓存原生方法
    var original = arrayProto[method];

    //覆盖原始方法
    (0, _util.def)(arrayMethods, method, function () {
        var i = arguments.length;
        var args = new Array(i);
        while (i--) {
            args[i] = arguments[i];
        }

        // 调用原生的数组方法
        var result = original.apply(this, args);

        //新插入元素需要重新observer
        var ob = this.__ob__;
        var inserted = void 0;
        switch (method) {
            case 'push':
                inserted = args;
                break;
            case 'unshift':
                inserted = args;
                break;
            case 'splice':
                inserted = args.slice(2);
                break;
        }
        if (inserted) ob.observerArray(inserted);

        //dep通知所有注册的观察者响应式处理
        ob.dep.notify();
        return result;
    });
});

/***/ })
/******/ ]);