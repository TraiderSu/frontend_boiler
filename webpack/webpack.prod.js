const path = require('path');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const autoprefixer = require('autoprefixer');
const MiniCss = require('mini-css-extract-plugin');
const { version, seo } = require('../package.json');

const htmlMinify = {
  removeComments: true,
  preserveLineBreaks: true,
  collapseWhitespace: true,
  removeRedundantAttributes: true,
  useShortDoctype: true,
  removeEmptyAttributes: true,
  removeStyleLinkTypeAttributes: true,
  keepClosingSlash: true,
  minifyJS: true,
  minifyCSS: true,
  minifyURLs: true
};

module.exports = {
  mode: 'production',
  entry: {
    app: path.resolve('src', 'index.js')
  },
  output: {
    filename: 'js/[name].[chunkhash].js',
    path: path.resolve('static/dist'),
    publicPath: '/dist/'
  },
  resolve: {
    modules: ['node_modules'],
    extensions: ['.jsx', '.js', '.json', '.svg', '.gql']
  },
  devtool: false,
  stats: {
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
  },
  performance: {
    hints: false
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        use: 'babel-loader',
        exclude: /node_modules/
      },
      {
        test: /\.css$/,
        use: [MiniCss.loader, 'css-loader'],
        include: /node_modules/
      },
      {
        test: /\.less$/,
        use: [
          MiniCss.loader,
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
        loader: 'svg-sprite-loader'
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
        test: /\.png$/,
        use: 'file-loader'
      }
    ]
  },
  optimization: {
    runtimeChunk: 'single',
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
    new HtmlWebpackPlugin({
      chunks: ['app', 'vendors', 'runtime'],
      filename: 'index.html',
      template: path.resolve('templates', 'prod.template.html'),
      favicon: path.resolve('static', 'favicon.png'),
      version,
      seo,
      minify: { ...htmlMinify }
    }),
    new MiniCss({ filename: 'css/[name].[contenthash].css' }),
    new OptimizeCssAssetsPlugin({
      assetNameRegExp: /\.css$/,
      cssProcessorOptions: {
        zindex: false,
        discardComments: { removeAll: true }
      }
    })
  ]
};
