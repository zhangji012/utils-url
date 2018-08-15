'use strict'

const path = require('path')
const webpack = require('webpack')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')

const resolve = dir => path.join(__dirname, '.', dir)

const isProd = process.env.NODE_ENV === 'production'

module.exports = {
  entry: {
    index: './src/index.js'
  },
  output: {
    path: resolve('lib'), // 输出目录
    filename: '[name].js', // 输出文件
    libraryTarget: 'umd', // 采用通用模块定义
    library: 'TDUrl', // 库名称
    libraryExport: 'default', // 兼容 ES6(ES2015) 的模块系统、CommonJS 和 AMD 模块规范
    globalObject: 'this' // 兼容node和浏览器运行，避免window is not undefined情况
  },
  devtool: '#source-map',
  module: {
    rules: [
      {
        test: /\.(js)$/,
        loader: 'eslint-loader',
        enforce: 'pre',
        include: [resolve('src'), resolve('test')],
        options: {
          formatter: require('eslint-friendly-formatter')
        }
      },
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /(node_modules)/
      }
    ]
  },
  plugins: isProd
    ? [
      new UglifyJsPlugin({
        parallel: true, // 使用多进程并行运行和文件缓存来提高构建速度
        uglifyOptions: {
          compress: {
            // 在UglifyJs删除没有用到的代码时不输出警告
            warnings: false,
            // 删除所有的 `console` 语句
            // 还可以兼容ie浏览器
            drop_console: false,
            // 内嵌定义了但是只用到一次的变量
            collapse_vars: true,
            // 提取出出现多次但是没有定义成变量去引用的静态值
            reduce_vars: true

          },
          output: {
            comments: false, // 删除所有的注释
            beautify: false // 最紧凑的输出
          },
          mangle: true
        },

        sourceMap: true
      })
    ]
    : [
      new webpack.HotModuleReplacementPlugin(),
      new webpack.NamedModulesPlugin(),
      new webpack.NoEmitOnErrorsPlugin()
    ]
}
