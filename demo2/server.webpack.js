const express = require('express')
const webpack = require('webpack')

let app = express()

// 引入中间件
let middleware = require('webpack-dev-middleware');

// 引入webpack的配置对象
let config = require('./webpack.config.js');

// webpack 通过配置对象进行编译，输出编译结果
let compiler = webpack(config);

// 使用中间件
app.use(middleware(compiler));

app.get('/user', (req, res) => {
  res.json({name: 'vince6666'})
})

console.log('server listening 3000')

app.listen(3000)