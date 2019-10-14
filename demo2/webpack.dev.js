const {smart} = require('webpack-merge');
const base = require('./webpack.config.js');

/**
 * 开发环境配置
 */
module.exports = smart(base, {
  mode: 'development',
  devServer: { // 开发服务
    // ....
  },
  devtool: 'source-map'
})