import Watcher from './watcher';

let uid = 0;

// 依赖收集类Dep,发布者
export default class Dep {
    static target;

    constructor() {
        this.id = uid++;
        this.subs = [];
    }

    //添加一个订阅者对象
    addSub(sub) {
        this.subs.push(sub);
    }

    // 移除一个订阅者对象*
    removeSub(sub) {
        let index = this.subs.indexOf(sub);
        if (index != -1) {
            this.subs.splice(index, 1);
        }
    }

    // 依赖收集,根据依赖添加订阅者
    depend() {
        Dep.target.addDep(this);
    }

    // 通知所有订阅者
    notify() {
        this.subs.forEach(sub => sub.update());
    }
}