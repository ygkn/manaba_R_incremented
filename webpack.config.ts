import path from 'path';
import CopyPlugin from 'copy-webpack-plugin';
import type { Configuration } from 'webpack';

import manifestJSON from './public/manifest.json';

const srcDir = './src/';
const isDev = process.env.NODE_ENV === 'dev';

const getJSFileName = (jsPath: string) => path.parse(jsPath).name;

const contentScripts = manifestJSON.content_scripts
  .filter(({ js }) => js !== undefined)
  .flatMap(({ js }) => js)
  .map(getJSFileName);

const backgroundScripts = manifestJSON.background.scripts.map(getJSFileName);

const config: Configuration = {
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
      {
        test: /\.css$/i,
        exclude: /node_modules/,
        use: {
          loader: 'raw-loader',
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

export default config;
