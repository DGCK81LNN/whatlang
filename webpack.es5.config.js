const TerserPlugin = require("terser-webpack-plugin")

/** @type {import('webpack').Configuration} */
module.exports = {
  mode: "development",
  devtool: false,
  entry: "./script.js",
  target: ["web", "es5"],
  resolve: {
    extensions: [".js", ".html"],
  },
  module: {
    rules: [
      {
        test: /\.[cm]?js$/,
        exclude: /babel|core-js/,
        use: {
          loader: "babel-loader",
          options: {
            sourceType: "unambiguous",
            presets: [
              [
                "@babel/preset-env",
                {
                  useBuiltIns: "usage",
                  corejs: "3",
                  targets: "ie 11, safari 5",
                },
              ],
            ],
          },
        },
      },
      {
        test: /\.html$/,
        use: "html-loader",
      },
    ],
  },
  optimization: {
    minimizer: [
      new TerserPlugin({
        extractComments: false,
      }),
    ],
  },
  output: {
    path: __dirname,
    filename: "es5.js",
  },
}
