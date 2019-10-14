const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const Webpack = require('webpack')

module.exports = {
  mode: 'development',
  entry: './src/index.js',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist')
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      }
    ]
  },
  resolve: { // 解析第三方模块
    modules: [path.resolve('node_modules'), path.resolve('xxx')],  // 第三方模块的查找路径
    // alias: { // 别名
    //   bootstrap: 'bootstrap/dist/css/bootstrap.css'
    // },
    mainFields: ['style', 'main'], // 查找的入口字段, 表示先查找style字段再查找mai字段
    // mainFiles: [''], // 入口文件的名字，默认是 index.js
    extensions: ['js', 'css', 'json'] // 查找的文件的扩展名
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './index.html',
      filename: 'home.html',
    })
  ]
}