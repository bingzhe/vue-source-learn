import { inBrowser } from './env'

export let mark
export let measure

//不是生产环境则继续，生产环境下导出的两个变量为undefined
if (process.env.NODE_ENV !== 'production') {
  //是浏览器环境perf值为window.performance，否则是false
  //performance 接口https://developer.mozilla.org/zh-CN/docs/Web/API/Performance
  const perf = inBrowser && window.performance

  //确保接口可以用，初始化mark, measure两个变量
  /* istanbul ignore if */
  if (
    perf &&
    perf.mark &&
    perf.measure &&
    perf.clearMarks &&
    perf.clearMeasures
  ) {
    mark = tag => perf.mark(tag)
    measure = (name, startTag, endTag) => {
      perf.measure(name, startTag, endTag)
      perf.clearMarks(startTag)
      perf.clearMarks(endTag)
      perf.clearMeasures(name)
    }
  }
}
