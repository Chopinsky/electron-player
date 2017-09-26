const path = require('path');

const HtmlWebpackPlugin = require('html-webpack-plugin');
const HtmlWebpackPluginConfig = new HtmlWebpackPlugin({
  template: './renderer/index.html',
  filename: 'index.html',
  inject: 'body'
});

module.exports = {
  entry: './renderer/index.js',
  output: {
    path: path.resolve('dist'),
    filename: 'bundle.js'
  },
  target: 'electron-renderer',
  module: {
    loaders: [
      { test: /\.js$/, loader: 'babel-loader', exclude: /node_modules/ },
      { test: /\.jsx$/, loader: 'babel-loader', exclude: /node_modules/ },
      { test: /\.css$/, loader: "style-loader!css-loader", exclude: /node_modules/  }
    ]
  },
  plugins: [ HtmlWebpackPluginConfig ],
  devServer: {
    contentBase: path.join(__dirname, "dist"),
    compress: true,
    port: 9000
  }
}