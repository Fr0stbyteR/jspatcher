const path = require('path');
const MonacoWebpackPlugin = require('monaco-editor-webpack-plugin');

const config = {
  entry: './src/index.tsx',
  resolve: {
    extensions: ['.tsx', '.ts', '.js']
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    library: 'JSPatcher',
    libraryTarget: 'umd'
  },
  module: {
    rules: [{
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
        use: [ 
          {
            loader: 'file-loader',
            options: {
              outputPath: 'assets/',
              publicPath: 'assets/'
            }
          }
        ]
      }
    ]
  },
  plugins: [
    new MonacoWebpackPlugin({
      output: 'monaco',
      languages: []
    })
  ]
};
module.exports = (env, argv) => {
  if (argv.mode === 'development') {
    config.devtool = 'inline-source-map';
    config.output.filename = 'index.js';
  }
  if (argv.mode === 'production') {
    config.output.filename = 'index.min.js';
  }
  return config;
};