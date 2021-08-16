const path = require('path');
const { DefinePlugin, ProvidePlugin } = require('webpack');
const MonacoWebpackPlugin = require('monaco-editor-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const WorkboxWebpackPlugin = require('workbox-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const VERSION = require("./src/scripts/version");

/** @type {import('webpack').Configuration} */
const config = {
  entry: './src/index.tsx',
  resolve: {
    fallback: {
      "path": require.resolve("path"),
      "buffer": require.resolve("buffer"),
      "util": require.resolve("util"),
      "fs": false,
      "stream": require.resolve("stream-browserify"),
      "crypto": require.resolve("crypto-browserify")
    },
    extensions: ['.tsx', '.ts', '.js']
  },
  node: {
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    publicPath: "",
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
            name: 'js/[fullhash].worklet.js'
          }
        }],
        exclude: /node_modules/
      }, {
        test: /\.worker\.(ts|js)$/,
        use: [{
          loader: 'worker-loader',
          options: {
            filename: 'js/[fullhash].worker.js',
            publicPath: "../"
          }
        }],
        exclude: /node_modules/
      }, {
        test: /\.(ts|js)x?$/,
        use: 'babel-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.s[ac]ss$/,
        use: ['style-loader', 'css-loader', 'sass-loader']
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
        use: ['source-map-loader'],
        include: /faust2webaudio/,
        enforce: 'pre'
      }
    ]
  },
  plugins: [
    new DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify(process.env.NODE_ENV || 'development')
      },
      'process.platform': {}
    }),
    new ProvidePlugin({
      Buffer: ['buffer', 'Buffer'],
    }),
    new CleanWebpackPlugin(),
    new CopyWebpackPlugin({
      patterns: [
        { from: './src/html', to: './' },
        { from: './node_modules/@ffmpeg/core/dist/ffmpeg-core.*', to: './deps/[name][ext]' },
        { from: './src/misc/monaco-faust/primitives.lib', to: './deps/' },
        { from: './src/misc/gen2faust.lib', to: './deps/' },
        { from: './node_modules/faust2webaudio/dist/libfaust-wasm.*', to: './deps/[name][ext]' },
        { from: './node_modules/@grame/libmusicxml/libmusicxml.wasm', to: './deps/' },
        { from: './node_modules/@shren/guidolib/libGUIDOEngine.wasm', to: './deps/' },
        { from: './node_modules/@jspatcher/package-std/dist', to: './packages/std/' }
      ],
      
    }),
    new MonacoWebpackPlugin({
      filename : 'js/[hash].worker.js',
      languages: ['javascript', 'html', 'json']
    }),
    new WorkboxWebpackPlugin.GenerateSW({
      cacheId: VERSION,
      cleanupOutdatedCaches: true,
      clientsClaim: true,
      skipWaiting: true,
      maximumFileSizeToCacheInBytes: 32 * 1024 * 1024,
    })
    // new BundleAnalyzerPlugin()
  ],
  // watch: true,
  watchOptions: {
    ignored: /node_modules/
  }
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