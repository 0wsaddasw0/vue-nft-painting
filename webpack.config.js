

var path = require('path');
const resolve = dir => path.resolve(__dirname, dir);
var htmlWebpackPlugin = require('html-webpack-plugin');
const VueLoaderPlugin = require('vue-loader/lib/plugin');//注意
module.exports = {
    entry: './app/main.js', // 项目入口文件
    output: { // 配置输出选项
        path: path.resolve(__dirname, 'dist'), // 配置输出的路径
        filename: 'bundle'+Date.parse(new Date())+'.js' // 配置输出的文件名
    },
    resolve: {
        // 设置别名
        alias: {
            '@': resolve('app/src'),
            '@view': resolve('app/views'),
            '@cmp': resolve('app/compents'),
            '@util': resolve('app/util'),
            '@style': resolve('app/style'),
            '@img': resolve('app/images')
        }
    },
    plugins: [ // 添加plugins节点配置插件
        new htmlWebpackPlugin({
            template: './app/index.html',//模板路径
            filename: './index.html'//自动生成的HTML文件的名称
        }),
        new VueLoaderPlugin()//注意
    ],
    module: {
        rules: [
            {
                test: /\.vue$/,
                loader: 'vue-loader' // 处理以.vue结尾的文件
            },
            {
                test: /\.css$/, // 处理css文件
                use: [
                    'vue-style-loader',
                    'style-loader',
                    'css-loader'
                ]
            },
            {
                test: /\.(gif|jpg|jpeg|png|svg)$/, // 处理图片文件
                use: [
                    {
                        loader: 'url-loader',
                        options: {
                            limit: 0,
                            name: '[name].[ext]'
                        }
                    }
                ]
            },
            {
                test: /\.(eot|svg|ttf|woff|woff2)(\?\S*)?$/,
                loader: 'file-loader'
            },
            {
                test: /\.scss$/,
                use: [
                    {
                        loader: "file-loader"
                    },
                    {
                        loader: "style-loader" // 将 JS 字符串生成为 style 节点
                    }, {
                        loader: "css-loader" // 将 CSS 转化成 CommonJS 模块
                    }, {
                        loader: "sass-loader" // 将 Sass 编译成 CSS
                    }]
            }
        ]
    },
    mode: "development"
}