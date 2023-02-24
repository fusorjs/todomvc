const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const isDevelopment =
  process.env.NODE_ENV?.trim().toLowerCase() === 'development';

module.exports = {
  entry: './js/index.ts',
  output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, 'dist'),
    publicPath: '/', // for the historyApiFallback to function
    clean: true,
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: 'TodoMVC',
    }),
  ],
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.ts$/,
        use: 'ts-loader',
        // use: {
        //   loader: 'ts-loader',
        //   options: {
        //     compilerOptions: {
        //       sourceMap: isDevelopment,
        //     },
        //   },
        // },
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: ['.ts', '...'],
  },

  ...(isDevelopment
    ? {
        mode: 'development',
        devtool: 'inline-source-map',
        devServer: {
          historyApiFallback: true,
        },
      }
    : {
        mode: 'production',
      }),
};
