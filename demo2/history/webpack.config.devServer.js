const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
  mode: 'development',
  entry: './src/index.js',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist')
  },
  // devServer: { // 主要就是使用了 http-proxy 模块 
  //   proxy: {
  //     '/api': 'http://localhost:3000'  // 配置了一个代理
  //   }
  // },
  devServer: {
    // 1、proxy 代理
    // proxy: {
    //   '/api': {
    //     target: 'http://localhost:3000',
    //     pathRewrite: { '/api': '' } // 用重写路径的方式把请求代理到 express 服务器上
    //   }
    // }
    // 2、前端模拟数据 (不需跨域)
    // before(app) { // webpack-dev-server 本身就是启用一个 express 服务，所以我们可以直接使用 express 的一个钩子
    //   app.get('/user', (req, res) => {
    //     res.json({name: 'vince666'})
    //   })
    // }
    // 3、直接在服务端启动webpack进行编译, 端口使用服务端的端口，这样就没有跨域的问题
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './index.html',
      filename: 'index.html',
    })
  ]
}