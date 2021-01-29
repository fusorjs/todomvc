const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = {
  mode: 'development',
  devtool: 'inline-source-map',

  entry: `./js/index.js`,
  output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, `./dist`),
  },
  plugins: [
    new CleanWebpackPlugin(
      {cleanStaleWebpackAssets: false} // --watch - do not delete index.html
    ),
    new HtmlWebpackPlugin({
      title: 'Perform • TodoMVC',
    }),
  ],
};
