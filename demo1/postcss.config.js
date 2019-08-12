/**
 * 默认情况下如果使用到 postcss-loader，就会来调用这个文件
 */
module.exports = {
  plugins: [require('autoprefixer')]
}