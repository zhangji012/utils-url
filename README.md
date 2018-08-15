# TDUrl

> 前端对url的基本处理方法

# API

## parseURL(url) 
### 把url的所有信息转化成json对象(url默认值:window.location.href)
- request
```javascript
'http://localhost:8080/a/b/c?a=1&b=2#abc'
```
- response
```javascript
{
  "source": "http://localhost:8080/a/b/c?a=1&b=2#abc",
  "protocol": "http",
  "hostname": "localhost",
  "port": "8080",
  "search": "?a=1&b=2",
  "origin": "http://localhost:8080",
  "params": {
    "a": "1",
    "b": "2"
  },
  "file": "c",
  "hash": "#abc",
  "hashName": "abc",
  "pathname": "/a/b/c",
  "originPath": "http://localhost:8080/a/b/c",
  "relative": "/a/b/c?a=1&b=2#abc",
  "segments": [
    "a",
    "b",
    "c"
  ]
}
```
## parseURLParams(url)
### 把url的参数部分转化成json对象(url默认值:window.location.href)
- request
```javascript
'http://localhost:8080/a/b/c?a=1&b=2#abc'
```
- response
```javascript
{
  "a": "1",
  "b": "2"
}
```
## getURLParam(key, url)
### 通过key获取url中的参数值(url默认值:window.location.href)
- request
```javascript
'a'
'http://localhost:8080/a/b/c?a=1&b=2#abc'
```
- response
```javascript
1
```
## appendParam(key, value, url)
### 向url中添加参数(url默认值:window.location.href)
- request
```javascript
'a'
'b'
'http://localhost:8080/a/b/c?a=1&b=2#abc'
```
- response
```javascript
'http://localhost:8080/a/b/c?a=b&b=2#abc'
```
## appendParams(params, url)
### 向url中添加多个参数(url默认值:window.location.href)
- request
```javascript
{"ssq":1111}
'http://localhost:8080/a/b/c?a=1&b=2#abc'
```
- response
```javascript
'http://localhost:8080/a/b/c?a=1&b=2&ssq=1111#abc'
```
## removeParams(arr, url)
### 向url中去除多个参数(url默认值:window.location.href)
- request
```javascript
["a", "b" ]
'http://localhost:8080/a/b/c?a=1&b=2#abc'
```
- response
```javascript
'http://localhost:8080/a/b/c#abc'
```

#启动
```javascript
 yarn // 下载依赖
 yarn build // 打包src => lib
 yarn start // 浏览器查看API并可以验证函数
```
