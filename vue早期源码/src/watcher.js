import Dep from './dep'

//观察者对象
export default class Watcher {

    constructor(vm, expression, callback) {
        this.callback = callback;
        //vm实例
        this.vm = vm;
        // 指令的表达式
        this.expression = expression;
        this.callback = callback;
        this.depIds = {};
        this.oldValue = this.get();
    }

    // 更新视图
    update() {
        let newValue = this.get();
        let oldValue = this.oldValue;
        if (newValue !== this.oldValue) {
            this.oldValue = newValue;
            this.callback.call(this.vm, newValue, oldValue);
        }
    }

    addDep(dep) {
        if (!this.depIds.hasOwnProperty(dep.id)) {
            dep.addSub(this);
            this.depIds[dep.id] = dep;
        }
    }

    get() {
        Dep.target = this;
        let value = this.getVMVal();
        Dep.target = null;
        return value;
    }

    getVMVal() {
        let expression = this.expression.split('.');
        let value = this.vm;
        // log("vm:", value);
        // expression.forEach(function (curVal) {
        //     value = value[curVal];
        // });
        // log('expression', this.expression);
        expression.forEach(val => {
            value = value[val];
        })
        return value;
    }
}