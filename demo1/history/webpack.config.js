const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
module.exports = {
  mode: 'development',  // 模式选择，有开发版本和生产版本（production）两种
  entry: './src/index.js',  // 项目入口文件，webpack 将从这个文件开始，找到所有的依赖进行打包
  output: {  // 打包后输出配置
    filename: 'bundle.js',  // 打包后文件名。 也可以是bundle.[hash].js，表示加上 hash，之后每次打包都会生成一个新的文件，而不会覆盖原先的文件
    path: path.resolve(__dirname, 'dist')  // 存放的文件夹，这里表示存放在当前路径的 dist 文件夹下。这一项必须为绝对路径
  },
  devServer: {  // 开发服务配置
    // port: 8081,  // 指定端口
    progress: true,  // 显示进度条
    contentBase: './dist',  // 指定目录
    compress: true  // 启动 gzip 压缩
  },
  plugins: [  //  插件的配置是一个数组，存放所有的 webpack 插件
    new HtmlWebpackPlugin({
      template: './index.html',  // 指定html模板
      filename: 'index.html',  // 生成的html文件名
      minify: { // 如果是生产版本，可以对 html 进行压缩
        removeAttributeQuotes: true,  // 删除属性的双引号
        collapseWhitespace: true  // 折叠空行
      },
      hash: true // 在引入的打包文件后面加上哈希戳
    })
  ]
}