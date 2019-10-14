const {smart} = require('webpack-merge');
const base = require('./webpack.config.js');

/**
 * 生产环境配置
 */
module.exports = smart(base, {
  mode: 'production',
  optimization: { // 优化项
    minimize: [
      // .....
    ]
  },
  plugins: [
    // ....
  ]
})