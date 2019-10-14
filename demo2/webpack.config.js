const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const webpack = require('webpack')

/**
 * 基本配置
 */
module.exports = {
  entry: './src/index.js',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist')
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './index.html',
      filename: 'index.html',
    }),
    new webpack.DefinePlugin({
      // DEV: "dev", // 这样是定义了一个变量 dev, 而不是字符串 'dev'
      DEV: JSON.stringify("dev"), //字符串 'dev'
      // EXPRESSION: JSON.stringify('1+1') , // 字符串 1+1 
      EXPRESSION: '1+1' // 表达式，等于2 
    })
  ]
}