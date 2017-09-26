const path = require('path')
var webpack = require("webpack");
var HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
    entry: {
        app: path.resolve(__dirname, "./src/main.js")
    },
    output: {
        path: path.resolve(__dirname, './dist/asset'),
        filename: 'bundle.js',
        publicPath: '/'//如果不是/，那么热加载会出问题
    },
    plugins: [
        // Webpack 1.0
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NoEmitOnErrorsPlugin(),
        new HtmlWebpackPlugin({
            filename: './index.html',
            //渲染输出html文件名,路径相对于 output.path 的值
             
            template: path.resolve(__dirname, './src/index.html'),
            //渲染源模版文件
             
            inject: true
            //这个东西非常重要，true: 自动写入依赖文件; false: 不写入依赖，构建多页面非常有用
            //自动引入js的时候会在前面加上output的publicPath
        })
    ]
}