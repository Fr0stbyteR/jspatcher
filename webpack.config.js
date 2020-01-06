const path = require('path');
const MonacoWebpackPlugin = require('monaco-editor-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

const config = {
  entry: './src/index.tsx',
  resolve: {
    extensions: ['.tsx', '.ts', '.js']
  },
  node: {
    fs: 'empty'
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    library: 'JSPatcher',
    libraryTarget: 'umd',
    chunkFilename: 'js/[chunkhash].js'
  },
  module: {
    rules: [{
        test: /\.worklet\.(ts|js)$/,
        use: [{
          loader: 'worklet-loader',
          options: {
            name: 'js/[hash].worklet.js'
          }
        }]
      }, {
        test: /\.(ts|js)x?$/,
        use: "babel-loader",
        exclude: /node_modules/,
      },
      {
        test: /\.s[ac]ss$/,
        use: ["style-loader", "css-loader", "sass-loader"]
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      },
      {
        test: /\.(png|woff|woff2|eot|ttf|svg)$/,
        use: [{
          loader: 'file-loader',
          options: {
            outputPath: 'assets/',
            publicPath: 'assets/'
          }
        }]
      },
      {
        test: /\.js$/,
        use: ["source-map-loader"],
        include: /faust2webaudio/,
        enforce: "pre"
      }
    ]
  },
  plugins: [
    new MonacoWebpackPlugin({
      filename : 'js/[hash].worker.js',
      languages: ['javascript']
    }),
    // new BundleAnalyzerPlugin()
  ]
};
module.exports = (env, argv) => {
  if (argv.mode === 'development') {
    config.devtool = 'source-map';
    config.output.filename = 'index.js';
  }
  if (argv.mode === 'production') {
    config.devtool = 'source-map';
    config.output.filename = 'index.min.js';
  }
  return config;
};