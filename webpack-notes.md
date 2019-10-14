# Webpack 笔记  

- [Webpack 笔记](#webpack-笔记)
  - [1. webpack 的作用](#1-webpack-的作用)
  - [2. 安装 webpack](#2-安装-webpack)
  - [3. 使用 webpack](#3-使用-webpack)
    - [3.1 默认配置](#31-默认配置)
    - [3.2 webpack.config.js](#32-webpackconfigjs)
  - [4. 使用插件](#4-使用插件)
  - [5. 使用loader](#5-使用loader)
    - [5.1 抽离 css 样式](#51-抽离-css-样式)
    - [5.2 自动添加浏览器兼容性前缀](#52-自动添加浏览器兼容性前缀)
    - [5.3 压缩 css 和 js](#53-压缩-css-和-js)
    - [5.4 转化 ES6](#54-转化-es6)
    - [5.5 处理 js 语法](#55-处理-js-语法)
    - [5.6 校验语法](#56-校验语法)
    - [5.7 使用第三方模块](#57-使用第三方模块)
    - [5.8图片处理](#58图片处理)
      - [file-loader：](#file-loader)
      - [url-loader：](#url-loader)
  - [6. 多入口/出口文件打包](#6-多入口出口文件打包)
  - [7. watch 和 watchOptions](#7-watch-和-watchoptions)
    - [7.1 watch](#71-watch)
    - [7.2watchOptions](#72watchoptions)
  - [8. devtool 源码映射](#8-devtool-源码映射)
  - [9. 一些实用的 webpack 小插件](#9-一些实用的-webpack-小插件)
    - [9.1 clearWebpackPlugin](#91-clearwebpackplugin)
    - [9.2 CopyWebpackPlugin](#92-copywebpackplugin)
    - [9.3 BannerPlugin](#93-bannerplugin)
  - [10. resolve 属性的配置](#10-resolve-属性的配置)
  - [11. 跨域问题](#11-跨域问题)
    - [11.1 proxy 代理](#111-proxy-代理)
    - [11.2 前端模拟数据](#112-前端模拟数据)
    - [11.3 服务端使用 webpack 编译](#113-服务端使用-webpack-编译)
  - [12. 定义环境变量](#12-定义环境变量)
  - [13. 区分不同的环境](#13-区分不同的环境)
    - [13.1 公共配置](#131-公共配置)
    - [13.2 开发环境配置](#132-开发环境配置)
    - [13.3 生产环境配置](#133-生产环境配置)
    - [13.4 使用的命令](#134-使用的命令)

## 1. webpack 的作用  

webpack 是一个现代 JavaScript 应用程序的**静态模块打包器**(module bundler)。它所做的事情就是分析你的项目结构，找到 JavaScript 模块以及其他一些浏览器不能直接处理的语言(Sass , TypeScript 等)，将其转换和打包为合适的格式供浏览器使用。  

大致可以概括为以下几点：  
**代码转换、文件优化、代码分割、模块合并、自动刷新、代码校验、自动发布**  

<br>  

## 2. 安装 webpack  

准备一个项目文件夹，在安装 webpack 之前，我们先要进行初始化，也就是记录安装依赖：  

    npm init -y  

执行以上命令之后，项目文件夹下多出一个 package.json 文件，里面记录的是我们的项目所需要的各种依赖。  

接着安装 webpack ,可以选择本地安装，也就是安装到你的项目文件夹：  

    npm install webpack webpack-cli -D

当然你也可以选择全局安装：  

    npm install -g webpack webpack-cli  

由于我们使用的是 webpack 4.0 以上版本，所以需要附加安装 webpack-cli。  

<br>  

## 3. 使用 webpack  

### 3.1 默认配置

在默认情况下， webpack 可以进行 0 配置，也就是使用默认配置。这种情况下，我们不需要使用一个 webpack 的配置文件，当我们执行 webpack 命令对项目进行打包的时候，webpack 会自动找到项目的入口文件，并且找到所有的依赖进行打包，输出一个打包好的文件夹 dist。  

然而，默认的 0 配置毕竟是不能满足我们的要求，因此，我们通常需要自己使用一个配置文件，通常将这个文件命名为 webpack.config.js。  

### 3.2 webpack.config.js  

首先我们是要知道的一点是，webpack 是 nodejs 写的，因此它支持 nodejs 模块化的语法。  

接下来我们通过一个最基础的配置文件来分析这些配置的作用： 

```JavaScript
const path = require('path')  // 引入nodejs的path模块

module.exports = {
  mode: 'development',  // 模式选择，有开发版本和生产版本（production）两种
  entry: './src/index.js',  // 项目入口文件，webpack 将从这个文件开始，找到所有的依赖进行打包
  output: {  // 打包后输出配置
    filename: 'bundle.js',  // 打包后文件名
    path: path.resolve(__dirname, 'dist')  // 存放的文件夹，这里表示存放在当前路径的 dist 文件夹下。这一项必须为绝对路径
  }
}
```  

通过上面的简单的配置，webpack 就可以帮我们将项目打包为一个文件 bundle.js，这个文件可以被引入到 html 文档中直接执行。  

实际上，webpack 打包好的这个 bundle.js 文件是一个**自执行函数**，我们可以来分析一下这个自执行函数, 了解 webpack 进行模块打包的大致过程：

```JavaScript
(function(modules) { // webpackBootstrap，这是一个 webpack 的启动函数  
  // The module cache，模块缓存
  var installedModules = {}; // 在该对象中： key => moduleId, value => {}
   
  // The require function，因为 require() 函数无法在浏览器中运行，所以这里实现了一个 require() 方法
  function __webpack_require__(moduleId) { // "./src/index.js"
   
    // 检查传入该函数的 moduleId 是否在缓存中
    if(installedModules[moduleId]) {
      return installedModules[moduleId].exports; // 在缓存中，则直接返回该模块的 exports 对象
    }
     
    // 不在缓冲中，则创建一个模块对象，并加入到模块缓存中
    var module = installedModules[moduleId] = { // 即给模块缓存对象添加了一个键值对儿
      i: moduleId,
      l: false,
      exports: {} 
    }; // 每个新加入的模块对象: key => moduleId（模块路径），value => Object, 其中的exports对象就是该模块要导出的东西

    // 执行模块路径对应的函数，执行时会再调用__webpack_require__函数，在函数中去找到其他的模块路径，执行相应的模块
    // 这个过程就是从一个入口文件开始，递归地寻找出所有的依赖关系的过程
    modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

    // Flag the module as loaded
    module.l = true;

    // Return the exports of the module
    return module.exports; // __webpack_require__函数返回的是传入模块的 exports（即每个模块导出的东西）
  }
   
  // expose the modules object (__webpack_modules__)
  __webpack_require__.m = modules;

  // expose the module cache
  __webpack_require__.c = installedModules;

  // define getter function for harmony exports
  __webpack_require__.d = function(exports, name, getter) {
    if(!__webpack_require__.o(exports, name)) {
      Object.defineProperty(exports, name, { enumerable: true, get: getter });
    }
  };
   
  // define __esModule on exports
  __webpack_require__.r = function(exports) {
    if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
      Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
    }
    Object.defineProperty(exports, '__esModule', { value: true });
  };

  // create a fake namespace object
  // mode & 1: value is a module id, require it
  // mode & 2: merge all properties of value into the ns
  // mode & 4: return value when already ns object
  // mode & 8|1: behave like require
  __webpack_require__.t = function(value, mode) {
    if(mode & 1) value = __webpack_require__(value);
    if(mode & 8) return value;
    if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
    var ns = Object.create(null);
    __webpack_require__.r(ns);
    Object.defineProperty(ns, 'default', { enumerable: true, value: value });
    if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
    return ns;
  };

  // getDefaultExport function for compatibility with non-harmony modules
  __webpack_require__.n = function(module) {
    var getter = module && module.__esModule ?
      function getDefault() { return module['default']; } :
      function getModuleExports() { return module; };
    __webpack_require__.d(getter, 'a', getter);
    return getter;
  };
   
  // Object.prototype.hasOwnProperty.call
  __webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };

  // __webpack_public_path__
  __webpack_require__.p = "";
   
  // 入口模块，该函数会在 webpack 启动函数启动时执行，将 "./src/index.js" 赋值给 moduleId
  return __webpack_require__(__webpack_require__.s = "./src/index.js"); 
})

  ({ // 该自执行函数传入的参数是一个对象，将其赋值给最上面的 modules
    "./src/a.js":  // key => 模块的路径 
      (function(module, exports) {  // values => 匿名函数
        eval("module.exports = function() {\r\n\talert('hello')\r\n}\n\n//# sourceURL=webpack:///./src/a.js?");
      }),
    "./src/index.js":
      (function(module, exports, __webpack_require__) {
        eval("const fn = __webpack_require__(\"./src/a.js\")\r\n\r\nconsole.log(fn())\n\n//# sourceURL=webpack:///./src/index.js?");
      })
  });
```  
  
上面我们已经通过使用 webpack 将一些 js 模块打包成一个文件，我们可以将这个文件引入到本地的 html 文档中。  

但在实际开发中，我们希望能够通过 localhost 或 ip 地址的方式来访问，这是我们就需要安装 webpack 内置的一个开发服务：webpack-dev-server  

    npm install webpack-dev-server -D  

启动服务：  

    npx webpack-dev-server  

由于 webpack-dev-server 不能直接启动，而是要借助 webpack-cli 启动，所以直接在命令行输入 webpack-dev-server 是无效的，必须向上面一样通过**npx**来启动。（执行命令时会先去本地的node_modules里面找webpack-dev-server）它是以项目的根目录为基准来启动的。  

或者，我们在开发中一般是将 webpack-dev-server 命令放在package.json的"script"里面：  

```JavaScript
"scripts": {
  "dev": "webpack-dev-server"
}
```  

这样就能使用命令： **npm run dev** 来启动。

执行 webpack-dev-server 时会去读取 webpack 的配置文件 webpack.config.js，其中 module.exports 的 mode 必须是"development"，它会监听入口文件和输出文件的变化。在执行 webpack-dev-server 编译后，一旦修改了**文件内容**，webpack-dev-server 就会自动重新编译，浏览器就会随着文件内容的修改自动更新。原因：webpack-dev-server 的工作原理：为了速度起见，它在编译的时候并不是编译到文件里（磁盘上），而是**编译到内存里**，如果浏览器端运行的我们编译好的文件，就会随着编译而实时更新。  

**注意：如果修改的是配置文件的内容，则需要重新打包再编译运行。**  

执行该命令后，我们的项目就会默认运行在 http://localhost:8080/ , 这时我们访问该地址，如果此时我们的项目根目录下没有一个 index.html 文件，则显示的是当前项目的目录，并不会显示我们的页面。因此我们需要在项目目录下手动添加一个 index.html 来引用我们打包好的文件。  

在 webpack.config.js 文件中的 devSerer 来配置开发服务:  

```JavaScript
const path = require('path')  // 引入nodejs的path模块

module.exports = {
  mode: 'development',
  entry: './src/index.js',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist')
  },
  devServer: {  // 开发服务配置
    port: 8081,  // 指定端口
    progress: true,  // 显示进度条
    //contentBase: './dist',  // 指定 index.html 所在的目录，如果在根目录则不需要此项
    compress: true  // 启动 gzip 压缩
  }
}
```  

通过以上的配置，当我们启动开发服务后，webpack 就能找到我们的 html 文件，从而在我们访问 localhost 的时候，显示我们自己的页面。至此我们这样我们就搭建好了一个基本的开发环境。  

<br>  

## 4. 使用插件

webpack 本身内置了一些常用的插件，除此之外还可以通过 npm 安装第三方插件。想要使用一个插件，只需要通过 require() 引入它，然后把它添加到 plugins 数组中。内置插件则不需要 require，直接使用即可。  

在上面的例子中，我们需要在提前准备好的 html 中引出打包好的文件。如果我们想要 webpack 帮我们建立一个 html 文件，并引用打包好的文件，只需要使用一个叫 HtmlWebpackPlugin 的插件：  

    npm install html-webpack-plugin -D  

HtmlWebpackPlugin 插件会根据我们指定的 html 模板在指定的打包目录下生成一个 html 文档，该 html 文档会自动引入我们打包好的文件。下面这个例子中，我们以根目录下的 index.html 为模板，在打包目录 dist 下生成一个 index.html 文件：  

```JavaScript
const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')  // 引入插件
module.exports = {
  mode: 'development',
  entry: './src/index.js', 
  output: {
    filename: 'bundle.[hash].js',  // 打包后文件名,加上 hash 后每次打包都会生成一个新的文件，而不会覆盖原先的文件
    path: path.resolve(__dirname, 'dist')
  },
  devServer: {  // 开发服务配置
    // port: 8081,
    progress: true,
    contentBase: './dist',  // 指定打包的目录
    compress: true
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
```  

<br>  

## 5. 使用loader  

默认情况下，webpack 只能打包 js 模块，而不能处理 css 等其他文件。因此，如果我们要在项目中呀=要做到以下几件事，就需要安装相应的 loader。  

- 像引用 js 模块那样来引入 css 模块  
- 将文件从不同的语言（如 TypeScript）转换为 JavaScript  
- 将内联图像转换为 data URL让 webpack 也能将这些文件进行打包  

loader 用于对模块的源代码进行转换，它可以使你在 **import** 或 **加载** 模块时预处理文件。通俗地讲就是替 webpack 去预处理一些文件（读取，编译...），把这些文件处理成 webpack 能认识的状态。  

    npm install css-loader style-loader -D  

安装 css 预处理器（三种常用预处理器的安装）：  

    npm install less less-loader -D
    npm install stylus stylue-loader -D
    npm install node-sass sass-loader -D  

安装好 loader 之后，在配置文件中添加相应的配置：  

```JavaScript
module.exports = {
  // 省略其他配置...

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
```  
**注意：** use 的加载 loader 的顺序是从后面到前面（不能倒换），即 css 预处理器放在最后面，其次是 css-loader, 而 style-loader 放在最前面。  

### 5.1 抽离 css 样式  

在上面的例子中，经过 loader 处理后的样式最终会被插入到 html 头部的 style 标签中。在样式很多的情况下，会使得 html 文档很臃肿，因此，我们可以使用 mini-css-exrtract-plugin 插件,将样式抽离出来，然后通过 link 便签来引入。  

安装 postcss-loader ：  

    npm install mini-css-exrtract-plugin -D  

```JavaScript
const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')

module.exports = {
  mode: 'development',
  entry: './src/index.js',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist')
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './index.html', 
      filename: 'index.html',
    }),
    new MiniCssExtractPlugin({  // 使用了这个插件，里面的 loader 属性可以替换掉 style-loader
      filename: 'index.css'  // 抽离出来的 css 文件名，
    })
  ],
  module: {
    rules: [
      {
        test: /\.css$|\.less$/,
        use: [
          MiniCssExtractPlugin.loader, // css文件加载后会在 html 中创建 <link> 标签引入index.css 
          'css-loader',
          'less-loader'
        ]
      }
    ]
  }
}
```  

这样在打包就会将 css 文件抽离，生成的 index.html 的头部就会自动加入 link 标签。  

### 5.2 自动添加浏览器兼容性前缀  

要给样式自动添加一些兼容性前缀，需要安装 postcss-loader 和 autoperfixer 插件：  

    npm install postcss-loader autoprefixer -D  

安装完之后，在项目根目录下创建一个 postcss.config.js 配置文件： 

```JavaScript
/**
 * 如果使用到了 postcss-loader，就会来调用这个文件
 */
module.exports = {
  plugins: [require('autoprefixer')]
}
```  

*无法添加前缀，暂未找到原因*

```JavaScript
{
  test: /\.css$|\.less$/,
  use: [
    MiniCssExtractPlugin.loader,
    'css-loader',
    'postcss-loader',  // 在css-loader之前使用
    'less-loader'
  ]
}
```  

### 5.3 压缩 css 和 js  

如果使用了 mini-css-extract-plugin 插件，就需要自己来压缩 css：  
```JavaScript
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')  // 用于压缩 js

module.exports = {
  // 省略其他....
  mode: 'prudoction',  // mode 为生产模式时，以下的压缩才会生效
  optimization: {  // 优化项(生产模式才会执行这一项)
    minimizer: [   // 压缩体积，默认是 new UglifyJsPlugin({})
      new UglifyJsPlugin({
        cache: true,   // 缓存
        parallel: true,  // 并发打包
        sourceMap: true  // 源码映射
      }),
      new OptimizeCSSAssetsPlugin() //压缩 css
    ]
  }
}
```  
  
### 5.4 转化 ES6    

在上面进行打包和压缩处理的 js 文件中，如果使用了 ES6 等高级语法，webpack 本身并不认识，所以编译打包过程会给出错误警告。因此，我们需要对 ES6 等语法进行转化。  

将 ES6 转化为 ES5 使用的是 babel:  

    npm install babel-loader @babel/core @babel/preset-env -D  

其中：

- babel-loader：进行转化  
- @babel/core：babel 的核心模块，转化源代码
- @babel/preset-env  

接着在项目中进行配置：  

```JavaScript
{
  test: /\.js$/,
  use: {
    loader: 'babel-loader',
    options: {  // 用babel-loader 把es6 => es5
      presets: [  // 是一个大插件的集合
        '@babel/preset-env'
      ],
      // plugins: [
      //   // 处理 js 语法的其他插件...
      // ]
    }
  }
}
```  

这样，我们就能在 js 文件中使用 ES6 语法，webpack 将其编译打包的过程中会转化为 ES5 代码。如果要支持 ES7 等更多语法，还需要安装相应的 loader 。  

### 5.5 处理 js 语法  

这些模块用于对一些高级语法进行转化：  

- @babel/plugin-transform-runtime
- babel/runtime  补丁模块，生产环境也需要，安装时 -S
- @babel/polyfill  补丁模块，生产环境也需要，安装时 -S

### 5.6 校验语法  

使用 eslint 来校验 js 代码：  

    npm install eslint eslint-loader -D

安装好之后，需要在项目根目录下创建一个配置文件： **.eslintrc.json**  

```JavaScript
{
  test: /\.js$/,
  use: {
    loader: 'eslint-loader',
    options: {
      enforce: 'pre'   // 强制置于其他 loader 之前
    }
  }
}
```  

这样在编译打包的时候就会校验 js 语法。  

### 5.7 使用第三方模块  

有时我们会引用一些第三方模块，这些模块可能会依赖于 jQuery, 接下来我们以 jquery 为例来说明如果引用全局变量。  

安装 jquery:  

    npm install jquery -D  

- 使用 ES6 语法引入： 

```JavaScript
import $ from 'jquery'  
```

- 使用 webpack 插件引入：在每个模块中都注入 $ 对象：    

```JavaScript
const Webpack = require('webpack')

module.exports = {
  // ....
  Plugins: [
    new Webpack.providePlugin({  // 在每个模块中都注入 $ 对象
      $: 'jquery'
    })
  ]
}
```

### 5.8图片处理

我们在项目中有三张方式可以引入图片资源：  

- 在 js 中创建图片来引入  
- 在 css 中引入 background('url')  
- <img src="" alt=""\>  

#### file-loader：

在 webpack 进行打包时，这三种方式的情况不同：  

**1、在 js 引入：**  

```JavaScript
let image = new Image()
image.src = './src/xxx.png'
document.body.appendChild(image)
```

这种情况下，webpack 并没有对我们的图片进行打包，'./src/xxx.png' 只是被当做一个普通的字符串来处理。  
如果想要对图片进行打包，就要用引入模块的方式来引入我们的图片, 并且使用相应的 loader：  

```JavaScript
// 把图片引入，返回的结果是一个新的图片地址， img表示我们打包后生成的图片的url (这个过程由 file-loader 来处理)
import img from './src/xxx.png'  
// 或者用 require()的方式也可以

let image = new Image()
image.src = img
document.body.appendChild(image)
```  
```JavaScript
module.exports = {
  module: {
    rules: [
      {
        test: /\.(png|jpg|gif)$/,
        use: 'file-loader'
      }
    ]
  }
}
```  

file-loader 并不会对文件内容进行任何转换，只是复制一份文件内容，并根据配置为他生成一个唯一的文件名。  

在打包之后，会在 dist 文件夹下新增文件 <code>09751c67b6befa1e1a74b12b25a6dacc.jpg</code>。  

当运行项目时，会在 html 文档中自动加上 <code><img src="09751c67b6befa1e1a74b12b25a6dacc.jpg"\></code>

**2、在 css 中引入 background('url')：**  

```CSS
body {
  background: url('./photo.jpg');
}
```

在入口文件引入该 css 文件：

```JavaScript
require('./index.css')
```  

经过处理之后：

```CSS
body {
  background: url(09751c67b6befa1e1a74b12b25a6dacc.jpg);
}
```

**3、在模板 html 中直接使用 <img src="" alt=""\>：**  

这种情况下， 在项目运行时能够找到 <code><img src="./photo.jpg" alt=""\></code> 标签, 但是图片并不能加载出来， 需要使用 **html-withimg-loader** 来处理：  

    npm install html-withimg-loader -D  

```JavaScript
module.exports = {
  module: {
    rules: [
      {
        test: /\.html$/,
        use: 'html-whitimg-loader'
      },
      {
        test: /\.(png|jpg|gif)$/,
        use: 'file-loader'
      }
    ]
  }
}
```

```HTML
<!-- HTML 模板中 -->
<img src="./photo.jpg" alt="">

<!-- 项目运行时html / 打包后的 html -->
<img src="09751c67b6befa1e1a74b12b25a6dacc.jpg" alt="">
```

#### url-loader：

使用 file-loader 对图片进行处理，在加载的每张图片的时候都需要发起 http 请求。当图片的大小比较小的时候，我们希望不用发起 http 请求，这时候就常使用 **url-loader** 来处理：  

    npm install url-loader -D  

使用 url-loader 处理图片可以做一个限制，即在图片大小小于某个值时，用 base64 来转化，否则就用 file-loader 来处理： 

```JavaScript
module.exports = {
  module: {
    rules: [
      {
        test: /\.html$/,
        use: 'html-whitimg-loader'
      },
      {
        test: /\.(png|jpg|gif)$/,
        use: {
          loader: 'url-loader',
          options: {
            limit: 200*1024,  // 当图片小于 200k 时，将其转化为 base64 格式
          }
        }
      }
    ]
  }
}
```

除此之外，url-loader 还有其他常用配置： 

```JavaScript
{
  test: /\.(png|jpg|gif)$/,
  use: {
    loader: 'url-loader',
    options: {
      limit: 20*1024,  // 当图片小于 20k 时，将其转化为 base64 格式
      outputPath: '/img/',  // 打包后图片存放的目录
      publicPath: 'http://wwww.xxx.com/'  // 公共路径，在引用资源时统一加上
    }
  }
}
```

<br>  

## 6. 多入口/出口文件打包  

有时候，我们的项目可能不只一个入口和出口，这时我们可以配置多个入口和出口：  

```JavaScript
const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
  mode: 'development',
  entry: {
    home: './src/index.js',  // 入口： home
    other: './src/other.js'  // 入口： other
  },
  output: {  // 出口
    filename: '[name].js',  // 使用占位符来确保每个文件具有唯一的名称，[name] 表示 home、other
    path: path.resolve(__dirname, 'dist')
  },
  plugins: [
    new HtmlWebpackPlugin({  // 两个出口对应两个 html 
      template: './index.html',
      filename: 'home.html'  // 根据 index.html 模板 打包生成 home.html
    }),
    new HtmlWebpackPlugin({
      template: './index.html',
      filename: 'other.html'  // 根据 index.html 模板 打包生成 other.html
    })
  ]
}
```

根据以上配置，我们在进行打包之后，dist 文件夹下会生成 **home.js、other.js、home.html、other.html** 四个文件。其中，**home.html、other.html** 中默认都引用了 **home.js、other.js** ：

```HTML
<!-- home.html 和 other.html --> 
<script type="text/javascript" src="home.js"></script>
<script type="text/javascript" src="other.js"></script>
```

如果我们想要在不同 html 中引入不同的 js, 应该加上 chunks:  

```JavaScript
plugins: [
  new HtmlWebpackPlugin({
    template: './index.html',
    filename: 'home.html',
    chunks: ['home']  // 对应 entry 中的 home
  }),
  new HtmlWebpackPlugin({
    template: './index.html',
    filename: 'other.html',
    chunks: ['other']  // 对应 entry 中的 other,
    // chunks: ['home', 'other']  //  也可以对用多个入口
  })
]
```

这样进行打包后， html 中引入 js 文件的结果如下：  

```HTML
<!-- home.html --> 
<script type="text/javascript" src="home.js"></script>

<!-- other.html -->
<script type="text/javascript" src="other.js"></script>
```

<br>  

## 7. watch 和 watchOptions  

webpack 可以监听文件变化，当它们修改后会重新编译。  

### 7.1 watch  

启用 Watch 模式, 意味着在初始构建之后，webpack 将继续监听任何已解析文件的更改：  

```JavaScript
module.exports = {
  // .....
  watch: true
}
```

开启 watch 模式后, 进行打包后，终端会显示 <code>webpack is watching the files…</code>, 在每次修改文件内容的时候，webpack 都会自动重新编译。  

开启 watch 模式的另一种方式是在执行 **webpack** 命令时加上 **--watch** 参数：  

**Watch 模式默认是关闭的。** 而通常情况下我们在开发时使用了 webpack-dev-server , 修改文件内容时会自动编译，是因为在webpack-dev-server 和 webpack-dev-middleware 里 Watch 模式是默认开启的。  

### 7.2watchOptions  

watchOptions 是一组用来定制 Watch 模式的选项：  

```JavaScript
module.exports = {
  // .....
  watch: true,
  watchOptions: {
    poll: 1000,  // 每秒检查一次变动。（判断文件是否变化时通过轮询实现的）
    aggregateTimeout: 300, // 防抖，在重新构建前增加延迟
    ignore: /node_modules/,  // 对于某些系统，监听大量文件系统会导致大量的 CPU 或内存占用。这个选项可以排除文件夹

  }
}
```

<br>  

## 8. devtool 源码映射  



<br>

## 9. 一些实用的 webpack 小插件  

### 9.1 clearWebpackPlugin  

使用该插件可以在编译打包时将原来 `dist` 目录下的文件清空。  

安装：  

    npm install clean-webpack-plugin -D  

```js
// 引入的是里面的属性，否则会报错：CleanWebpackPlugin is not a constructor
const { CleanWebpackPlugin } = require('clean-webpack-plugin') 

module.exports = {
  // ....
  plugins: [
    new CleanWebpackPlugin() // 在打包时将原来dist目录下的文件清空
  ]
}
```

### 9.2 CopyWebpackPlugin   

使用这个插件可以编译打包的时候将指定目录或文件拷贝到构建目录 dist :  

安装：  

    npm install copy-webpack-plugin -D  

```js
const CopyWebpackPlugin = require('copy-webpack-plugin')

module.exports = {
  // ....
  plugins: [
    new CleanWebpackPlugin(), // 在打包时将原来dist目录下的文件清空
    new CopyWebpackPlugin([   // 接收一个数组，每一项是一个对象，即可以拷贝多个文件或文件夹
      { from: './doc1' },
      { from: './doc2', to: './doc2' }
    ])
  ]
}
```

`{ from: './doc1' }` 表示构建时将 `doc1` 目录下的所有文件拷贝到 `dist` 目录下（默认）  
`{ from: './doc2', to: './doc2' }` 表示构建时将 `doc2` 目录下的所有文件拷贝到 `dist` 目录下的 `doc2` 文件夹。  

每个对象中的 `from` 是必需的，其他则可以省略。  

### 9.3 BannerPlugin    

`BannerPlugin` 是 webpack **内置**的一个插件，不需要安装第三方模块即可使用，它用于在我们构建的文件中**添加版权申明的注释**

```js
const Webpack = require('webpack')

module.exports = {
  // ....
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist')
  },
  plugins: [
    new CleanWebpackPlugin(), // 在打包时将原来dist目录下的文件清空
    new CopyWebpackPlugin([   // 接收一个数组，每一项是一个对象，即可以拷贝多个文件或文件夹
      { from: './doc1' },
      { from: './doc2', to: './doc2' }
    ]),
    new Webpack.BannerPlugin('Created by Vince, 2019')
  ]
}
```

在构建之后，在 `bundle.js` 的最顶部，就会加上 `/*! Created by Vince, 2019 */ ` 这样一段注释。  

<br>

## 10. resolve 属性的配置  

webpack 配置中的 `resolve` 配置，用于解析我们安装的第三方模块：  

```js
module.exports = {
  // ....
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      }
    ]
  },
  resolve: { // 解析第三方模块
    modules: [path.resolve('node_modules'), path.resolve('xxx')],  // 第三方模块的查找路径
    mainFields: ['style', 'main'], // 查找的入口字段, 表示先查找style字段再查找mai字段
    // mainFiles: [''], // 入口文件的名字，默认是 index.js
    extensions: ['js', 'css', 'json'] // 查找的文件的扩展名
    // alias: { // 别名
    //   bootstrap: 'bootstrap/dist/css/bootstrap.css'
    // },
  }
}
```

- `modules`： 第三方模块的查找路径  
默认情况下，我们安装的第三方模块都是在 `node_modules`中。在上面的示例中，`modules` 配置表示在寻找第三方模块依赖时，先到 `node_modules` 目录下找， 再到 `xxx` 目录下找。  
<br>

- `mainFields`： 模块的入口字段  
在我们安装的每个第三方模块中，都有一个 `package.json` 文件，其中定义了一些入口的字段（即入口路径）， 默认情况下，引入模块的入口都是其中定义的 `main` 字段。 通过 `mainFields` 配置，我们可以指定首先查找的入口字段，上面示例中就表示先查找 `style` 字段表示的路径，再去查找 `main` 字段表示的路径。  
<br>

- `mainFiles`： 入口文件的名字  
同理，`mainFiles` 表示的就是入口文件的名字，默认情况下都是 `index.js`，们可以直接指定其他的文件名。  
<br>

- `extensions`： 查找的文件的扩展名  
很多情况下如果我们在引入一个路径下的 js 文件时，都省略了 `.js` 文件后缀。如果该路径下没有 `.js` 的文件，我们想要引入的是 `.css` 或其他文件，就可以使用 `extensions` 配置。 例如，在上面的示例中，假设 `xxx` 目录下有几种类型的文件，则表示优先引入 `xxx.js` 文件，若没有则引入 `xxx.css` 文件，最后再引入 `xxx.json` 文件。  
<br>

- `alias`： 别名  
以键值对的形式，给一些常用的路径配置一个别名，方便引用。  

<br>

## 11. 跨域问题  

**场景**：服务端在 **3000** 端口启动了一个服务  

```js
// server.js 服务端
const express = require('express')

let app = express()

app.get('/user', (req, res) => {
  res.json({name: 'vince'})
})

app.listen(3000)
```

在我们的程序中需要请求上面的接口：  

```js
let xhr = new XMLHttpRequest();

// localhost:8080  是 webpack-dev-server 的服务， 而请求的服务端是 3000 端口 
xhr.open('GET', '/api/user', true)

xhr.onload = function() {
  console.log(xhr.response);
}

xhr.send()
```

当我们启动 `webpack-dev-server` 服务时，默认的端口是 **8080** ，如果我们要访问 **3000** 端口，就需要跨域。 在开发的过程中，我们可以通过以下几种方式来**解决跨域问题**：  

### 11.1 proxy 代理  

使用 **proxy 代理** 是最常用的方式，其原理是使用了 `http-proxy` 模块，将跨域请求**转发**到响应的地址。  

```js
module.exports = {
  //....
  mode: 'development',

  devServer: {
    proxy: { // 主要就是使用了 http-proxy 模块 
      '/api': { // 当请求 '/api' 时，进行转发
        target: 'http://localhost:3000',  // 配置了一个代理
        pathRewrite: { '/api': '' } // 用重写路径的方式把请求代理到 express 服务器上
      }
    }
  }
}
```

在该示例中，当我们发送请求 `http://localhost:8080/api/user` 时，就会自动转发到 `http://localhost:3000/user`。  

### 11.2 前端模拟数据  

这种方法将服务端的接口写到了前端，主要是用于开发时模拟数据：

```js
module.exports = {
  //....
  mode: 'development',

  devServer: {
    before(app) { // app 就是服务端的创建的服务实例
      app.get('/user', (req, res) => {
        res.json({name: 'vince6'})
      })
    }
}
```

`webpack-dev-server` 启动服务的原理，就是启用了 `node.js` 的 `express` 服务，所以我们可以直接使用 `express` 中的一个钩子函数 `before()`，在其中定义接口。  

### 11.3 服务端使用 webpack 编译  

这种方式是直接在服务端启动 `webpack` 进行编译, 端口使用服务端的端口 **3000**，这样就没有跨域的问题。  

```js
// 前端请求：
xhr.open('GET', '/user', true)
xhr.onload = function() {
  console.log(xhr.response);
}
xhr.send()
```

```js
// 新建一个 server.webpack.js 服务端
const express = require('express')
const webpack = require('webpack') // 服务端引入 webpack

let app = express()

// 引入中间件
let middleware = require('webpack-dev-middleware'); // 需安装

// 引入 webpack 的配置对象
let config = require('./webpack.config.js');

// webpack 通过配置对象进行编译，输出编译结果
let compiler = webpack(config);

// 使用中间件
app.use(middleware(compiler));

app.get('/user', (req, res) => { // 请求 '/user' 时，返回结果，并没有跨域问题
  res.json({name: 'vince6666'})
})

app.listen(3000)

```

这个时候，我们不需要启动自己 `webpack-dev-server` 服务，只需要运行 `server.webpack.js`, 相当于就在服务端启动`webpack-dev-server`，端口就是 **3000**。  

在启动服务的时候，`webpack` 先找到配置对象 `config`， 根据配置进行编译后输出编译结果 `compiler`，然后使用引入的 `webpack-dev-middleware` 中间件对编译结果进行处理， 最后我们只需要 `use` 这个中间件，就能够实现在服务端使用 webpackk 进行编译。这时我们访问只需 **3000** 端口，就能得到请求的结果。  

以上就是在开发过程中遇到跨域问题的一些处理方式。  

<br>

## 12. 定义环境变量  

使用 webpack 的内置插件 `DefinePlugin`，允许创建一个在编译时可以配置的**全局常量**。这可能会对开发模式和发布模式的构建允许不同的行为非常有用。  

```js
// webpack.config.js
module.exports = {
  // ....

  plugins: [
    new webpack.DefinePlugin({
      // DEV: "dev", // 这样是定义了一个变量 dev, 而不是字符串 'dev'
      DEV: JSON.stringify("dev"), //字符串 'dev'
      // EXPRESSION: JSON.stringify('1+1') , // 字符串 1+1 
      EXPRESSION: '1+1' // 表达式，等于2 
    })
  ]
}
```

```js
// 示例： 
let url;

if(DEV === 'dev') {
  url = 'http://localhost:3000';
} else {
  url = 'http://localhost:8080';
}

console.log(url) // http://localhost:3000
console.log(EXPRESSION) // 2
```

## 13. 区分不同的环境  

当我们项目比较大的时候，通常需要比较多的 webpack 配置，就可能使 `webpack.config.js` 比较臃肿，这种情况下我们可以把开发环境的配置和生产环境的配置分开放到不同的配置文件，将公共配置放到另一个配置文件。  

需要安装 `webpack-merge` ：  

    npm install webpack-merge  

### 13.1 公共配置  

```js
// webpack.base.js
const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')

/**
 * 基本配置, 包含 入口文件，出口文件等
 */
module.exports = {
  entry: './src/index.js',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist')
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './index.html',
      filename: 'index.html',
    })
}
```

### 13.2 开发环境配置  

```js
// webpack.dev.js
const {smart} = require('webpack-merge'); // 引入用于合并的方法
const base = require('./webpack.config.js'); // 如要引入公共配置

/**
 * 开发环境配置
 */
module.exports = smart(base, { // 合并公共配置
  mode: 'development',
  devServer: { // 开发服务
    // ....
  },
  devtool: 'source-map' // 源码映射
})
```

### 13.3 生产环境配置  

```js
// webpack.prod.js
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
```

### 13.4 使用的命令  

默认情况下，当我们执行 <code>webpack</code> 命令进行打包的时候，webpack 会默认找到 `webpack.config.js` 文件的配置进行编译打包。  

现在我们想要根据环境的不同来执行不同的配置文件，应该使用如下命令：  

    webpack --config webpack.dev.js  
    或：
    webpack -- config webpack.prod.js  

上述情况分别是执行开发环境和生产环境的配置文件，但是每次执行这样的命令，就显得很麻烦。 因此，我们将命令配置在 `package.json` 文件中：  

```js
"scripts": {
    // 其他 ...
    "dev": "webpack-dev-server",
    "build": "webpack --config webpack.prod.js"
  }
```

当我们需要构建生产环境的包时，就可以使用以上的配置，执行 `npm run build` 就相当于真执行 `webpack --config webpack.prod.js`。  


