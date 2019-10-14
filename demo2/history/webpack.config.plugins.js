const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin') // 引入的是里面的属性，否则会报错：CleanWebpackPlugin is not a constructor
const CopyWebpackPlugin = require('copy-webpack-plugin')
const Webpack = require('webpack')

/**
 *  使用小插件：
 *  1、CleanWebpackPlugin
 *  2、CopyWebpackPlugin
 *  3、BannerPlugin
 */
module.exports = {
  mode: 'development',
  entry: './src/index.js',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist')
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './index.html',
      filename: 'home.html',
    }),
    new CleanWebpackPlugin(), // 在打包时将原来dist目录下的文件清空
    new CopyWebpackPlugin([ // 接收一个数组，每一项是一个对象，即可以拷贝多个文件或文件夹
      { from: './doc1' },
      { from: './doc2', to: './doc2' }
    ]),
    new Webpack.BannerPlugin('Created by Vince, 2019')
  ]
}