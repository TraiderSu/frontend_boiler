const config = require('./webpack.prod');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');

module.exports = {
  ...config,
  optimization: {
    ...config.optimization,
    concatenateModules: false
  },
  plugins: [...config.plugins, new BundleAnalyzerPlugin()]
};