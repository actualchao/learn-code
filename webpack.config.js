
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: './src/index',
  output: {
    filename: 'main.js'
  },
  resolve: {
    extensions: ['.js']
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      }
    ]
  },
  devtool: process.env.NODE_ENV === 'production' ? false : 'cheap-module-eval-source-map',
  devServer: {
    contentBase: './dist',
    stats: 'errors-only',
    compress: false,
    host: 'localhost',
    port: 8089
  },
  plugins: [
    new CleanWebpackPlugin({
      cleanOnceBeforeBuildPatterns: ['./dist']
    }),
    new HtmlWebpackPlugin({
      template: './public/index.html'
    })
  ]
};
