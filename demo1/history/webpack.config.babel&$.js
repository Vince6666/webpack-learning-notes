const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')

const Webpack = require('webpack')

module.exports = {
  mode: 'development',  // mode 为生产模式时，以下的压缩才会生效
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
    new Webpack.ProvidePlugin({
      $: 'jquery'
    })
  ],
  module: {
    rules: [
      {
        test: /\.js$/,
        use: {
          loader: 'babel-loader',
          options: {  // 用babel-loader 把es6 => es5
            presets: [  // 是一个大插件的集合
              '@babel/preset-env'
            ],
            // plugins: [
            //   // 其他插件...
            // ]
          }
        }
      },
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
  }
}