const path = require('path');
const resolve = dir => path.resolve(__dirname, dir);
const VueLoaderPlugin = require('vue-loader/lib/plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
module.exports = {
  entry: './app/main.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'main.js'
  },
  mode: 'development',
  devServer: {
    contentBase: path.resolve(__dirname, 'dist'),
    proxy: {
      '/backend': {
        target: "http://localhost:8000"
      },
      '/images': {
        target: "http://localhost:8000"
      },
    }
  },
  plugins: [
    new VueLoaderPlugin(),
    new HtmlWebpackPlugin({
      template: 'app/index.html',
    }),
    new CopyPlugin({
      patterns: [
        { from: path.resolve(__dirname, 'app/images'), to: path.resolve(__dirname, 'dist') }
      ]
    })
  ],
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
  }
};

