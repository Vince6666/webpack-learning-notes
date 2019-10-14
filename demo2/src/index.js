require('./other')

// import 'bootstrap'

// console.log('vince')
// console.log('vince')
// console.log('vince')
console.log('vince')


// var a = 'dd'
// console.log(a)

/*
let xhr = new XMLHttpRequest();

// localhost:8080  是 webpack-dev-server 的服务， 而请求的服务端是3000 端口 
xhr.open('GET', '/user', true)

xhr.onload = function() {
  console.log(xhr.response);
}

xhr.send()

*/

let url;

if(DEV === 'dev') {
  url = 'http://localhost:3000';
} else {
  url = 'http://localhost:8080';
}

console.log(url)
console.log(EXPRESSION)