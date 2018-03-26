import Dep from './dep'

//观察者对象，订阅者
export default class Watcher {

    constructor(vm, expression, callback) {
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
    update() {
        let newValue = this.get();
        let oldValue = this.oldValue;
        if (newValue !== this.oldValue) {
            this.oldValue = newValue;
            this.callback.call(this.vm, newValue, oldValue);
        }
    }

    //添加dep的id,
    //在depIds中没有该dep.id时候，才添加该watch到触发了getter的数据的dep.subs中
    addDep(dep) {
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
    get() {
        Dep.target = this;
        let value = this.getVMVal();
        Dep.target = null;
        return value;
    }

    //取observer的data的value,这里会触发observer了数据的getter,
    getVMVal() {
        let expression = this.expression.split('.');
        let value = this.vm;

        expression.forEach(val => {
            value = value[val];
        })
        return value;
    }
}