var webpack = require('webpack');
var path = require('path');
var HtmlWebpackPlugin = require('html-webpack-plugin')

// this list was obtained from the package.json file from within the dependencies.
const VENDOR_LIBS = [
  "faker",
  "lodash",
  "react",
  "react-dom",
  "react-input-range",
  "react-redux",
  "react-router",
  "redux",
  "redux-form",
  "redux-thunk",
]

module.exports = {
  // Externam dependencies such as 3rd party packages change at a much slower rate than out own code. We would like to take advantage of the browser caching mechanism to load up these dependency files only when required. This would make the intial download of the build files by the browser much faster. For this, we want to create 2 bundle files (so 2 entry points) - bundle.js for our own code, and one for the dependencies (vendor.js). 
  entry: {
    bundle: './src/index.js',
    vendor: VENDOR_LIBS
  },
  output: {
    path: path.join(__dirname, 'dist'),
    // take name from the entry properties. In most browsers and in most situations, browsers use the cached version of a file if the name hasn;t changes. We don't want this to happen since we're likely to change bundle.js frequently. Hence, we use the chunkhash to check if the file contents itself have changed.
    filename: '[name].[chunkhash].js'
  },
  module: {
    rules: [
      {
        use: 'babel-loader',
        test: /\.js$/,
        exclude: /node_modules/
      }, 
      {
        use: ["style-loader", "css-loader"],
        test: /\.css$/,
      }
    ]
  },
  plugins: [
    // without the plugin, webpack builds files with duplicate imports. Eg. index.js might import some deps that we would ideally want to have only in the vendor file. But because these are part of the initial chunk, they might get included in both bundle,js and vendor.js. To prevent this duplication, we use the CommonsChunkPlugin while doing code splitting.
    // Why do we need manifest? 
    // Webpack  generates and inserts some runtime code at runtime into the vendor file (since this runtime code is common to vendor and bundle). This would chnage the chunkhash each time. In order to prevent this, push the runtime code into manifest. 
    new webpack.optimize.CommonsChunkPlugin({
      names: ["vendor", "manifest"]
    }),
    new HtmlWebpackPlugin({
      template:"src/index.html"
    }),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV)
    })
  ]
};
