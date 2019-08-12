const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
module.exports = {
  mode: 'development',
  entry: './src/index.js',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist')
  },
  plugins: [  //  插件的配置是一个数组，存放所有的 webpack 插件
    new HtmlWebpackPlugin({
      template: './index.html',  // 指定html模板
      filename: 'index.html',  // 生成的html文件名
    })
  ],
  module: { // 模块
    rules: [ // 规则，是一个数组
      {
        test: /\.css$|\.less$/,  // test 是一个匹配相应文件的正则 
        use: [  // use 一般是一个数组，每一项是一个loader。
          {     //loader可以是一个字符串，如果需要其他的参数选项，loader也可以是一个对象
            loader: 'style-loader',  // 把样式插入到页面里的 <style> 标签
            options: {
              // 其他参数选项...
            }
          },
          'css-loader',  // 加载css文件，并且把css文件包装成webpack能认识的状态,让样式成为js文件的一部分
          'less-loader'  // less => css
        ]
      }
    ]
  }
}