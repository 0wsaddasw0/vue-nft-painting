

var path = require('path');
const resolve = dir => path.resolve(__dirname, dir);
const VueLoaderPlugin = require('vue-loader/lib/plugin');//注意
module.exports = {
    entry: './app/plugin.js', // 项目入口文件
    output: { // 配置输出选项
        path: path.resolve(__dirname, ''), // 配置输出的路径
        filename: 'index.js', // 配置输出的文件名
        library: 'nftpainting', // 指定的就是你使用require时的模块名
        libraryTarget: 'umd', // libraryTarget会生成不同umd的代码,可以只是commonjs标准的，也可以是指amd标准的，也可以只是通过script标签引入的
        umdNamedDefine: true // 会对 UMD 的构建过程中的 AMD 模块进行命名。否则就使用匿名的 define
    },
    resolve: {
        // 设置别名
        alias: {
            '@': resolve('app/src'),
            '@view': resolve('app/views'),
            '@style': resolve('app/style'),
        }
    },
    plugins: [ 
        new VueLoaderPlugin()
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
    mode: "production"
}