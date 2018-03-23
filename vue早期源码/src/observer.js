import Dep from './dep';
import { def } from './util';
//arrayMethods是劫持了数组方法的对象
import { arrayMethods } from './array';

//数组的原型继承
function protoAugment(target, src) {
    target.__proto__ = src;
}
//赋值继承
function copyAugment(target, src, keys) {
    for (let i = 0; i < keys.length; i++) {
        def(target, key[i], src[key[i]]);
    }
}


export default function observer(data) {
    //data不存在，或者data不是objuct时返回
    if (!data || typeof data !== 'object') {
        return;

        //data有__ob__属性并且 Observer.prototype是在data["__ob__"]的原型链上时返回
    } else if (data.hasOwnProperty("__ob__") && data["__ob__"] instanceof Observer) {
        return;
    }

    //Observer data 
    return new Observer(data);
}

class Observer {
    constructor(data) {
        this.dep = new Dep();
        def(data, "__ob__", this);
        this.data = data;

        if (Array.isArray(data)) {
            // 是数组是时候
            const argment = data.__proto__ ? protoAugment : copyAugment;
            //用劫持的对象覆盖数组原型
            argment(data, arrayMethods, Object.keys(arrayMethods));
            //observer arrray
            this.observerArray(data);
        } else {
            this.walk(data);
        }

    }

    //递归observer
    walk(data) {
        let self = this;
        Object.keys(this.data).forEach(function (key) {
            self.defineReactive(data, key, data[key]);
        });
    }

    observerArray(items) {
        for (let i = 0; i < items.length; i++) {
            observer(items[i]);
        }
    }

    defineReactive(data, key, value) {
        let dep = new Dep(),
            //取到属性的属性描述符
            descriptor = Object.getOwnPropertyDescriptor(data, key);
        log("dep:", dep, data, key, value);

        //属性描述符存在并且属性描述符的configurable为false时返回，configurable为false时不能修改
        if (descriptor && !descriptor.configurable) {
            return;
        }

        //递归监听，是对象的时候返回new Observer(value), 否则undefined
        let childObserver = observer(value);

        Object.defineProperty(data, key, {
            enumerable: true,
            configurable: false,
            get: function () {

                if (Dep.target) {
                    // 为这个属性添加观察者watcher
                    dep.depend();
                    if (childObserver) {
                        childObserver.dep.depend();
                    }
                }
                return value;
            },
            set: function (newValue) {
                if (newValue == value) {
                    return;
                }
                if (typeof newValue === 'object') {
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
}

