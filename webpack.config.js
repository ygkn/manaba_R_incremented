const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');
const manifestJSON = require('./public/manifest.json');

const srcDir = './src/';
const isDev = process.env.NODE_ENV === 'dev';

const getJSFileName = (jsPath) => path.parse(jsPath).name;

const contentScripts = manifestJSON.content_scripts
  .filter(({ js }) => js !== undefined)
  .flatMap(({ js }) => js)
  .map(getJSFileName);

const backgroundScripts = manifestJSON.background.scripts.map(getJSFileName);

module.exports = {
  mode: isDev ? 'development' : 'production',
  devtool: isDev && 'source-map',
  watch: isDev,
  entry: Object.fromEntries(
    [...contentScripts, ...backgroundScripts].map((distFileName) => [
      distFileName,
      path.resolve(__dirname, srcDir, distFileName, 'index.ts'),
    ])
  ),
  output: {
    path: path.resolve(__dirname, './dist/js'),
    filename: '[name].js',
  },
  resolve: {
    extensions: ['.js', '.jsx', '.ts', '.tsx'],
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
        },
      },
    ],
  },
  plugins: [
    new CopyPlugin({
      patterns: [{ from: 'public', to: '../' }],
    }),
  ],
};
