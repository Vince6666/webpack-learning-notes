const express = require('express')

/**
 *  webpack-dev-server 实际上就是启用了一个 express 的服务
 */

let app = express()

// app.get('/user', (req, res) => {
//   res.json({name: 'vince6'})
// })

app.listen(3000)