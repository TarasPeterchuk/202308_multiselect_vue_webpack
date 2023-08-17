const webpack = require('webpack')
const path = require('path')
const { VueLoaderPlugin } = require('vue-loader')
const CopyWebpackPlugin = require('copy-webpack-plugin')

const config = {
  entry: './src/main.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js'
  },
  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: 'vue-loader'
      },
      {
        test: /\.s[ac]ss$/i,
        use: ['style-loader', 'css-loader', 'sass-loader']
      }
    ]
  },
  resolve: {
    extensions: ['.js', '.vue']
  },
  plugins: [
    new VueLoaderPlugin(),
    new CopyWebpackPlugin({
      // Add the CopyWebpackPlugin configuration
      patterns: [
        {
          from: path.resolve(__dirname, 'public', 'index.html'),
          to: path.resolve(__dirname, 'dist')
        }
      ]
    })
  ]
}

module.exports = config
