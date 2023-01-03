const path = require('path');
const fs = require("fs");
const { DefinePlugin, ProvidePlugin } = require('webpack');
const MonacoWebpackPlugin = require('monaco-editor-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const WorkboxWebpackPlugin = require('workbox-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const { version } = require("./package.json");

const internalPackagesPath = "./src/scripts/internal-packages.json";
/** @type {string[]} */
const INTERNAL_PACKAGES = require(internalPackagesPath);

const timestamp = new Date().getTime();

fs.writeFileSync(path.join(__dirname, "./src/version.ts"), `export default ${JSON.stringify(`${version}.${timestamp}`)};\n`);

module.exports = (env, argv) => {

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
        "crypto": require.resolve("crypto-browserify"),
        "url": false
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
      chunkFilename: 'js/[chunkhash].js',
      assetModuleFilename: 'assets/[hash][ext][query]'
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
          use: {
            loader: 'esbuild-loader',
            options: {
              loader: 'tsx',
              target: 'es2017'
            }
          },
          exclude: /node_modules/
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
          type: 'asset',
          generator: {
              filename: 'assets/[hash][ext][query]'
          }
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
          NODE_ENV: JSON.stringify(process.env.NODE_ENV || 'development'),
          WS_DOMAIN: JSON.stringify(env.WS_DOMAIN),
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
          { from: './node_modules/@shren/faustwasm/libfaust-wasm/libfaust-wasm.*', to: './deps/[name][ext]' },
          { from: './node_modules/@grame/libmusicxml/libmusicxml.wasm', to: './deps/' },
          { from: './node_modules/@shren/guidolib/libGUIDOEngine.wasm', to: './deps/' },
          { from: internalPackagesPath, to: './packages/[name][ext]' },
          ...INTERNAL_PACKAGES.map(p => ({ from: `./node_modules/@jspatcher/package-${p}/dist`, to: `./packages/${p}/` }))
        ],
      }),
      new MonacoWebpackPlugin({
        filename : 'js/[hash].worker.js',
        languages: ['javascript', 'typescript', 'html', 'json'],
        globalAPI: true
      }),
      new WorkboxWebpackPlugin.GenerateSW({
        cacheId: "JSPatcher",
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
  // process.traceDeprecation = true;

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