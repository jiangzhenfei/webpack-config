var express = require("express");
var app = express();
var port = process.env.PORT || 3000;
 
/**
* 引入webpack 及其 配置config
*/
var webpack = require("webpack");
var webpackConfig = require("./webpack.config.js");

//相当于在入口文件变成数组并且成为app:['webpack-hot-middleware/client?noInfo=true&reload=true',path.resolve(__dirname, "./src/main.js")]
var devClient = 'webpack-hot-middleware/client?noInfo=true&reload=true';
Object.keys(webpackConfig.entry).forEach(function (name, i) {
    var extras = [devClient]
    webpackConfig.entry[name] = extras.concat(webpackConfig.entry[name])
})

console.log(webpackConfig.entry)//app: ['webpack-hot-middleware/client?noInfo=true&reload=true',path.resolve(__dirname, "./src/main.js")]


//调用配置,生成 compiler 实例
var compiler = webpack(webpackConfig);
 
//这里是重点，使用 webpack-dev-middleware 插件
var devMiddleware = require('webpack-dev-middleware')(compiler, {
    publicPath: webpackConfig.output.publicPath,//publicPath 就是我們想要存取前端 bundle 的網址，路徑，位置,路径相对于 output.path 的值(我自己认为的,不是/就会出问题)
    stats: {
        colors: true,
        chunks: false
    }
})

var hotMiddleware = require('webpack-hot-middleware')(compiler)
// 监听html文件改变事件
compiler.plugin('compilation', function (compilation) {
    compilation.plugin('html-webpack-plugin-after-emit', function (data, cb) {
    // 发布事件 reload,这个事件会在dev-client.js中接受到，然后刷新
    hotMiddleware.publish({ action: 'reload' })
        cb()
    })
})

// 注册中间件
app.use(devMiddleware);
app.use(hotMiddleware);
 
// 使用静态资源
app.use(express.static(__dirname+'/'));
 
app.listen(port, function (err){
    if (err) {
        throw err;
    }
    console.log('Listening at http://localhost:' + port + '\n')
})