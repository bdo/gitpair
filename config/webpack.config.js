var webpack = require("webpack");
var path = require("path");

module.exports = {
  devtool: "inline-cheap-source-map",
  target: "node",

  externals: {
    "enquirer": "commonjs enquirer",
    "prompt-choices": "commonjs prompt-choices",
    "ansi-colors": "commonjs ansi-colors"
  },

  entry: path.resolve(__dirname, "..", "src", "index.js"),

  module: {
    rules: [
      { test: /.js$/, loaders: ["babel-loader"] }
    ]
  },

  output: {
    path: path.resolve(__dirname, ".."),
    filename: "gitpair.js"
  },

  plugins: [
    new webpack.IgnorePlugin(/\.(css|less|scss|sass)$/),
    new webpack.BannerPlugin("Version " + require("../package.json").version)
  ]
};
