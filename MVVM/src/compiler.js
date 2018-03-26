import Watcher from './watcher';
import observer from './observer';

const tagRE = /\{\{\{(.*?)\}\}\}|\{\{(.*?)\}\}/g,
    htmlRE = /^\{\{\{(.*)\}\}\}$/,
    paramsRE = /\((.+)\)/g,
    stringRE = /\'(.*)\'/g;


export default class Compiler {

    constructor(el, vm) {
        this.$vm = vm;
        this.$el = this.isElementNode(el) ? el : document.querySelector(el);

        if (this.$el) {
            this.$fragment = this.createFragment(this.$el);
            this.compileElement(this.$fragment);
            this.$el.appendChild(this.$fragment);
        }
    }

    createFragment(el) {
        var fragment = document.createDocumentFragment(),
            child;

        //遍历原始node子节点，会删除文档树中该dom节点，并且加入生成dom片段中。
        while (child = el.firstChild) {
            fragment.appendChild(child);
        }

        return fragment;
    }

    compileElement(el) {
        let childNodes = el.childNodes,
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

    compileNodeAttr(node) {
        let nodeAttrs = node.attributes,
            self = this,
            lazyComplier,
            lazyExp;

        [].slice.call(nodeAttrs).forEach(function (attr) {
            let attrName = attr.name;
            //是vue指令
            if (self.isDirective(attrName)) {
                //expression就是属性的值，v-if="data"中的data
                let expression = attr.value;
                // directicve 指令名称， v-if="data"中的if
                let directive = attrName.substring(2);

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

    compileText(node) {
        const tokens = this.parseText(node.wholeText);
        let fragment = document.createDocumentFragment();
        tokens.forEach(token => {
            let el;
            //是模板字符串
            if (token.tag) {
                //是text还是html
                if (token.html) {
                    el = document.createDocumentFragment();
                    el.$parent = node.parentNode;
                    el.$oncetime = true;
                    directiveUtil.html(el, this.$vm, token.value);

                } else {
                    el = document.createTextNode(" ");
                    directiveUtil.text(el, this.$vm, token.value);
                }
            } else {
                el = document.createTextNode(token.value);
            }
            el && fragment.appendChild(el);
        });
        node.parentNode.replaceChild(fragment, node);
    }

    parseText(text) {
        //不存在需要解析的文本，直接返回
        if (!tagRE.test(text)) {
            return;
        }
        const tokens = [];

        //下次匹配的起始索引
        let lastIndex = tagRE.lastIndex = 0;

        let match, index, html, value;

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

    isDirective(attr) {
        return attr.indexOf('v-') === 0;
    }

    isEventDirective(dir) {
        return dir.indexOf('on') === 0;
    }

    isElementNode(node) {
        return node.nodeType === 1;
    }

    isTextNode(node) {
        return node.nodeType === 3;
    }
}


//指令处理
const directiveUtil = {
    text: function (node, vm, expression) {
        this.bind(node, vm, expression, 'text');
    },

    html: function (node, vm, expression) {
        this.bind(node, vm, expression, 'html');
    },

    class: function (node, vm, expression) {
        this.bind(node, vm, expression, 'class');
    },

    for: function (node, vm, expression) {
        let itemName = expression.split('in')[0].replace(/\s/g, ''),
            arrayName = expression.split('in')[1].replace(/\s/g, '').split('.'),
            parentNode = node.parentNode,
            startNode = document.createTextNode(''),
            endNode = document.createTextNode(''),
            range = document.createRange();

        parentNode.replaceChild(endNode, node);
        parentNode.insertBefore(startNode, endNode);

        let value = vm;
        arrayName.forEach(function (curVal) {
            value = value[curVal];
        });

        value.forEach(function (item, index) {
            let cloneNode = node.cloneNode(true);
            parentNode.insertBefore(cloneNode, endNode);
            let forVm = Object.create(vm);
            forVm.$index = index;
            forVm[itemName] = item;
            new Compiler(cloneNode, forVm);
        });

        new Watcher(vm, arrayName + ".length", function (newValue, oldValue) {
            range.setStart(startNode, 0);
            range.setEnd(endNode, 0);
            range.deleteContents();
            value.forEach((item, index) => {
                let cloneNode = node.cloneNode(true);
                parentNode.insertBefore(cloneNode, endNode);
                let forVm = Object.create(this);
                forVm.$index = index;
                forVm[itemName] = item;
                new Compiler(cloneNode, forVm);
            });
        });

    },

    model: function (node, vm, expression) {
        this.bind(node, vm, expression, 'model');

        let value = this._getVMVal(vm, expression);

        let composing = false;

        node.addEventListener('compositionstart', () => {
            composing = true;
        }, false);

        node.addEventListener('compositionend', event => {
            composing = false;
            if (value !== event.target.value) {
                this._setVMVal(vm, expression, event.target.value);
            }
        }, false);

        node.addEventListener('input', event => {
            if (!composing && value !== event.target.value) {
                this._setVMVal(vm, expression, event.target.value);
            }
        }, false);
    },

    bind: function (node, vm, expression, directive) {
        var updaterFn = updater[directive + 'Updater'];
        let value = this._getVMVal(vm, expression);
        updaterFn && updaterFn(node, value);
        new Watcher(vm, expression, function (newValue, oldValue) {
            updaterFn && updaterFn(node, newValue, oldValue);
        });
    },

    addEvent: function (node, vm, directive, expression) {
        let eventType = directive.split(':');
        let fn = vm.$options.methods && vm.$options.methods[expression];

        if (eventType[1] && typeof fn === 'function') {
            node.addEventListener(eventType[1], fn.bind(vm), false);
        } else {
            let match = paramsRE.exec(expression),
                fnName = expression.replace(match[0], ''),
                paramNames = match[1].split(','),
                params = [];

            paramsRE.exec("remove(todo)");
            fn = vm.$options.methods[fnName];
            for (let i = 0; i < paramNames.length; i++) {
                let name = paramNames[i].trim(),
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

    _getVMVal: function (vm, expression) {
        log('expression', expression);

        expression = expression.trim();
        let value = vm;
        expression = expression.split('.');
        expression.forEach((key) => {
            if (value.hasOwnProperty(key)) {
                value = value[key];
            } else {
                throw new Error("can not find the property: " + key);
            }

        });

        if (typeof value === 'object') {
            return JSON.stringify(value);
        } else {
            return value;
        }
    },

    _setVMVal: function (vm, expression, value) {
        expression = expression.trim();
        let data = vm._data;
        expression = expression.split('.');
        expression.forEach((key, index) => {
            if (index == expression.length - 1) {
                data[key] = value;
            } else {
                data = data[key];
            }
        });
    }
}

const cacheDiv = document.createElement('div');

const updater = {
    textUpdater: function (node, value) {
        // v-text指令
        node.textContent = typeof value === 'undefined' ? '' : value;
    },

    htmlUpdater: function (node, value) {
        if (node.$parent) {
            cacheDiv.innerHTML = value;
            const childNodes = cacheDiv.childNodes,
                doms = [];
            let len = childNodes.length,
                tempNode;
            if (node.$oncetime) {
                while (len--) {
                    tempNode = childNodes[0];
                    node.appendChild(tempNode);
                    doms.push(tempNode);
                }
                node.$doms = doms;
                node.$oncetime = false;
            } else {
                let newFragment = document.createDocumentFragment();
                while (len--) {
                    tempNode = childNodes[0];
                    newFragment.appendChild(tempNode);
                    doms.push(tempNode);
                }
                node.$parent.insertBefore(newFragment, node.$doms[0]);
                node.$doms.forEach(childNode => {
                    node.$parent.removeChild(childNode);
                });
                node.$doms = doms;
            }

        } else {
            // v-html指令
            node.innerHTML = typeof value === 'undefined' ? '' : value;
        }
    },

    classUpdater: function (node, value, oldValue) {
        var nodeNames = node.className;
        if (oldValue) {
            nodeNames = nodeNames.replace(oldValue, '').replace(/\s$/, '');
        }
        var space = nodeNames && value ? ' ' : '';
        node.className = nodeNames + space + value;
    },

    modelUpdater: function (node, value) {
        node.value = typeof value === 'undefined' ? '' : value;
    },
}
