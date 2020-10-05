const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');
const manifestJSON = require('./public/manifest.json');

const srcDir = './src/';
const isDev = process.env.NODE_ENV === 'dev';

const contentScripts = manifestJSON.content_scripts
  .flatMap(({ js: jsPaths }) =>
    jsPaths?.map((jsPath) => path.parse(jsPath).name)
  )
  .filter((fileName) => fileName);

module.exports = {
  mode: isDev ? 'development' : 'production',
  entry: Object.fromEntries(
    [contentScripts]
      .flat()
      .map((distFileName) => [
        distFileName,
        path.resolve(__dirname, srcDir, distFileName, 'index.ts'),
      ])
  ),
  output: {
    path: path.resolve(__dirname, './dist/js'),
    filename: '[name].js',
  },
  resolve: {
    extensions: ['.ts', '.tsx'],
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
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
