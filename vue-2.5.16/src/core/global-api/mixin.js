/* @flow */

import { mergeOptions } from '../util/index'

//Vue上添加mixin全局api
export function initMixin (Vue: GlobalAPI) {
  Vue.mixin = function (mixin: Object) {
    this.options = mergeOptions(this.options, mixin)
    return this
  }
}
