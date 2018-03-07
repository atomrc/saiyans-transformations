const path = require("path");

module.exports = {
  entry: "./src/application.js",
  output: {
    path: path.resolve(__dirname, "dist")
  },
  module: {
    rules: [{
      test: /\.svg/,
      use: "raw-loader"
    }]
  }
}
