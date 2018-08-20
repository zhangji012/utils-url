/**
 * URL处理封装
 * @param config
 */
import TDLog4j from '@tongdun/utils-log4j'
// 2：prototype.typeCheck为什么不能和上面写在一起
class TDUrl {
  constructor() {

  }
  parseURL = (url = window.location.href) => { // 把url的所有信息转化成json对象
    try {
      if (!this.typeCheck.isString(url)) {
        this.printErrorLog({ name: 'parseURL', message: '参数url非字符类型' })
        return {}
      }
      let a = document.createElement('a')
      a.href = url
      return {
        source: url,
        protocol: a.protocol.replace(':', ''),
        hostname: a.hostname,
        port: a.port,
        search: a.search,
        origin: a.origin,
        params: (function () {
          let ret = {}
          let seg = a.search.replace(/^\?/, '').split('&')
          let len = seg.length
          let i = 0
          let s
          for (; i < len; i++) {
            if (!seg[i]) {
              continue
            }
            s = seg[i].split('=')
            ret[s[0]] = s[1]
          }
          return ret
        })(),
        file: (a.pathname.match(/\/([^\/?#]+)$/i) || ['', ''])[1],
        hash: a.hash,
        hashName: a.hash.replace('#', ''),
        pathname: a.pathname,
        originPath: a.origin + a.pathname,
        relative: (a.href.match(/tps?:\/\/[^\/]+(.+)/) || ['', ''])[1],
        segments: a.pathname.replace(/^\//, '').split('/')
      }
    } catch (e) {
      this.printErrorLog(e)
      return {}
    }
  }

  parseURLParams = (url = window.location.href) => { // 把url的参数部分转化成json对象
    try {
      if (!this.typeCheck.isString(url)) {
        this.printErrorLog({ name: 'parseURLParams', message: '参数url非字符类型' })
        return {}
      }
      let a = document.createElement('a')
      a.href = url
      let ret = {}
      let seg = a.search.replace(/^\?/, '').split('&')
      let len = seg.length
      let i = 0
      let s
      for (; i < len; i++) {
        if (!seg[i]) {
          continue
        }
        s = seg[i].split('=')
        ret[s[0]] = s[1]
      }
      return ret
    } catch (e) {
      this.printErrorLog(e)
      return {}
    }
  }

  getURLParam = (key, url = window.location.href) => { // 通过key获取url中的参数值
    try {
      let e = {}
      if (!this.typeCheck.isString(key)) {
        e = { name: 'getURLParam', message: '参数key非字符类型' }
      }
      if (!this.typeCheck.isString(url)) {
        if (e.message) {
          e.message = '参数key和url非字符类型'
        } else {
          e = { name: 'getURLParam', message: '参数url非字符类型' }
        }
      }
      if (Object.keys(e).length) {
        this.printErrorLog(e)
        return url
      }
      let a = document.createElement('a')
      a.href = url
      let reg = new RegExp('[?&]' + key + '=([^&]+)')
      return a.search.match(reg) ? RegExp.$1 : ''
    } catch (e) {
      this.printErrorLog(e)
      return ''
    }
  }

  appendParam = (key, value, url = window.location.href) => { // 向url中添加字段
    let e = {}
    if (!this.typeCheck.isString(key)) {
      e = { name: 'appendParam', message: '参数key非字符类型' }
    }
    if (this.typeCheck.isObject(value)) {
      if (e.message) {
        e.message = e.message + ',参数value不能是对象类型'
      } else {
        e = { name: 'appendParam', message: '参数value不能是对象类型' }
      }
    }
    if (!this.typeCheck.isString(url)) {
      if (e.message) {
        e.message = e.message + ',参数url非字符类型'
      } else {
        e = { name: 'appendParam', message: '参数url非字符类型' }
      }
    }
    if (Object.keys(e).length) {
      this.printErrorLog(e)
      return url
    }
    return this.appendParams({ [key]: value }, url)
  }

  appendParams = (params, url = window.location.href) => { // 向url中添加多个字段
    try {
      let e = {}
      if (!this.typeCheck.isObject(params)) {
        e = { name: 'appendParams', message: '参数params非json对象' }
      }
      if (!this.typeCheck.isString(url)) {
        if (e.message) {
          e.message = e.message + ',参数url非字符类型'
        } else {
          e = { name: 'appendParams', message: '参数url非字符类型' }
        }
      }
      if (Object.keys(e).length) {
        this.printErrorLog(e)
        return url
      }
      let a = document.createElement('a')
      a.href = url
      let temp = this.parseURL(url)
      let originPath = temp.originPath
      let search = '?'
      params = { ...temp.params, ...params }
      for (let i in params) {
        search += i + '=' + params[i] + '&'
      }
      search = search === '?' ? '' : search.substring(0, search.length - 1)
      return originPath + search + temp.hash
    } catch (e) {
      this.printErrorLog(e)
      return url
    }
  }

  removeParams = (arr, url = window.location.href) => { // 从url中去除多个字段
    try {
      let e = {}
      if (!this.typeCheck.isArray(arr)) {
        e = { name: 'removeParams', message: '参数arr非数组' }
        return url
      } else {
        if (arr.findIndex(item => !this.typeCheck.isString(item)) !== -1) {
          e.message = { name: 'removeParams', message: '参数arr数组元素有非字符类型' }
        }
      }
      if (!this.typeCheck.isString(url)) {
        if (e.message) {
          e.message = e.message + ',参数url非字符类型'
        } else {
          e = { name: 'removeParams', message: '参数url非字符类型' }
        }
      }
      if (Object.keys(e).length) {
        this.printErrorLog(e)
        return url
      }
      const temp = this.parseURL(url)
      arr.forEach((item) => {
        delete temp.params[item]
      })
      return this.appendParams(temp.params, temp.originPath) + temp.hash
    } catch (e) {
      this.printErrorLog(e)
      return url
    }
  }

  printErrorLog = (e) => { // 打印参数日志
    TDLog4j.error('error name:', e.name)
    TDLog4j.error('error message:', e.message)
    TDLog4j.error('error description:', e.description)
  }
}

TDUrl.prototype.typeCheck = (function () { // 类型校验
  let __isType = function (type) {
    return function (obj) {
      return Object.prototype.toString.call(obj) === '[object ' + type + ']'
    }
  }
  return {
    isObject: function (obj) {
      return __isType('Object')(obj)
    },
    isArray: function (obj) {
      return Array.isArray(obj) || __isType('Array')(obj)
    },
    isString: function (obj) {
      return __isType('String')(obj)
    },
    isUndefined: function (obj) {
      return __isType('Undefined')(obj)
    },
    isNumber: function (obj) {
      return __isType('Number')(obj) && isFinite(obj) && !isNaN(obj)
    },
    isNullOrUndefined: function (obj) {
      return (obj === undefined || obj === null)
    }
  }
}())

export default new TDUrl()
