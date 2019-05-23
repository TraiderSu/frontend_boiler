const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const StyleLintPlugin = require('stylelint-webpack-plugin');
const autoprefixer = require('autoprefixer');
const { version, seo } = require('../package.json');
require('dotenv').config();

const stats = {
  assets: true,
  colors: true,
  errors: true,
  errorDetails: true,
  modules: false,
  performance: true,
  hash: false,
  version: false,
  timings: true,
  warnings: true,
  children: false
};

module.exports = {
  mode: 'development',
  entry: {
    app: path.resolve('src', 'index.js')
  },
  output: {
    filename: '[name].bundle.js',
    path: path.resolve('static/dist'),
    publicPath: '/'
  },
  resolve: {
    modules: ['node_modules'],
    extensions: ['.jsx', '.js', '.json', '.svg']
  },
  devtool: 'source-map',
  devServer: {
    contentBase: path.resolve('dist'),
    historyApiFallback: true,
    stats,
    port: process.env.PORT,
    hot: true,
    watchOptions: {
      poll: true
    },
    proxy: {
      '/api': {
        target: 'http://localhost:8000',
        changeOrigin: true
      }
    }
  },
  stats,
  module: {
    rules: [
      {
        test: /\.(js|jsx)/,
        enforce: 'pre',
        loader: 'eslint-loader',
        exclude: [/node_modules/]
      },
      {
        test: /\.(js|jsx)$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
        query: {
          cacheDirectory: true
        }
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      },
      {
        test: /\.less$/,
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              sourceMap: false,
              modules: true,
              localIdentName: '[name]__[local]--[hash:base64:5]'
            }
          },
          {
            loader: 'postcss-loader',
            options: {
              plugins: () => [autoprefixer({ remove: false, browsers: ['last 2 versions'] })]
            }
          },
          {
            loader: 'less-loader',
            options: {
              sourceMap: false
            }
          }
        ]
      },
      {
        test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
        loader: 'svg-sprite-loader',
        exclude: /node_modules/
      },
      {
        test: /\.svg$/,
        issuer: /\.(less$|js$)/,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 10000,
              mimetype: 'image/svg+xml'
            }
          }
        ],
        exclude: /node_modules/
      },
      {
        test: /\.(png|jpg|gif|svg|eot|ttf|woff|woff2)$/,
        use: 'file-loader'
      }
    ]
  },
  optimization: {
    splitChunks: {
      cacheGroups: {
        vendors: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          chunks: 'all'
        }
      }
    }
  },
  plugins: [
    new CleanWebpackPlugin(['static/dist'], {
      root: path.resolve()
    }),
    new StyleLintPlugin({
      configFile: '.stylelintrc.yaml',
      context: 'src',
      files: '**/*.less',
      failOnError: false,
      quiet: false
    }),
    new HtmlWebpackPlugin({
      chunks: ['app', 'vendors'],
      filename: 'index.html',
      template: path.resolve('templates', 'dev.template.html'),
      favicon: path.resolve('static', 'favicon.png'),
      version,
      seo
    }),
    new webpack.HotModuleReplacementPlugin()
  ]
};
