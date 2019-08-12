const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const OptimizeCss = require('optimize-css-assets-webpack-plugin')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

module.exports = {
  mode: 'production',  // mode 为生产模式时，以下的压缩才会生效
  entry: './src/index.js',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist')
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/index.html', 
      filename: 'index.html',
    }),
    new MiniCssExtractPlugin({  // 使用了这个插件，里面的 loader 属性可以替换掉 style-loader
      filename: 'main.css'  // 抽离出来的 css 文件名，
    }),
  ],
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          MiniCssExtractPlugin.loader, // css文件加载后会在 html 中创建 <link> 标签引入index.css 
          // 'style-loader',
          'css-loader',
          'postcss-loader'
        ]
      },
      {
        test: /\.less$/,
        use: [
          MiniCssExtractPlugin.loader, // css文件加载后会在 html 中创建 <link> 标签引入index.css 
          // 'style-loader',
          'css-loader',
          'postcss-loader',
          'less-loader'
        ]
      }
    ]
  },
  optimization: {  // 优化项
    minimizer: [   // 压缩体积，默认是 new UglifyJsPlugin({})
      new UglifyJsPlugin({
        cache: true,   // 缓存
        parallel: true,  // 并发打包
        sourceMap: true  // 源码映射
      }),
      new OptimizeCss() //压缩 css
    ]
  },

}