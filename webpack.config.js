const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const webpack = require('webpack');

require('dotenv').config();

const outputDirectory = 'dist';
const appUrl = new URL(process.env.APP_URL);

module.exports = {
  // entry: `${__dirname}/src/client/index.js`,
  entry: './src/client/index.js',
  output: {
    path: path.join(__dirname, outputDirectory),
    filename: 'bundle.js',
    publicPath: '/'
  },
  resolve: {
    extensions: ['.js', '.jsx'],
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader'
        }
      },
      {
        test: /\.(css|scss)$/,
        use: [
          // fallback to style-loader in development
          process.env.NODE_ENV !== 'production' ? 'style-loader' : MiniCssExtractPlugin.loader,
          // MiniCssExtractPlugin.loader,  // vs. style-loader
          // 'style-loader',
          'css-loader',
          'sass-loader'
        ]
      },
      {
        test: /\.(woff|woff2|eot|ttf)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        loader: 'url-loader'
      },
      {
        test: /\.(png|jpg|gif|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        loader: 'file-loader'
      }
    ]
  },
  devServer: {
    port: appUrl.port,
    open: true,
    historyApiFallback: true,
    proxy: {
      '/api': process.env.API_URL,
    },
  },
  plugins: [
    new webpack.DefinePlugin({
       // TODO: whitelist env vars for use on client side
      'process.env': JSON.stringify({
        'APP_URL': process.env.APP_URL,
        'API_URL': process.env.API_URL,
        'OKTA_URL': process.env.OKTA_URL,
        'OIDC_CLIENT_ID': process.env.OIDC_CLIENT_ID,
        'AUTH_SERVER_ID': process.env.AUTH_SERVER_ID,
      })
    }),
    new webpack.ProvidePlugin({
      $: 'jquery',
      jQuery: 'jquery'
    }),
    new CleanWebpackPlugin([outputDirectory]),
    new MiniCssExtractPlugin({
      filename: 'style.css'
    }),
    new HtmlWebpackPlugin({
      template: './public/index.html',
      favicon: './public/favicon.ico'
    })
  ]
};
