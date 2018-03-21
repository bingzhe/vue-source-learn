import { def } from './util';

//遇到原生数组的原型
const arrayProto = Array.prototype;
export const arrayMethods = Object.create(arrayProto);

//不污染原型的情况下重写下列数组方法
[
    'push',
    'pop',
    'shift',
    'unshift',
    'splice',
    'sort',
    'reverse'
].forEach(function (method) {

    //缓存原生方法
    const original = arrayProto[method];

    //覆盖原始方法
    def(arrayMethods, method, function () {
        let i = arguments.length;
        const args = new Array(i);
        while (i--) {
            args[i] = arguments[i];
        }

        // 调用原生的数组方法
        const result = original.apply(this, args);

        //新插入元素需要重新observer
        const ob = this.__ob__;
        let inserted;
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