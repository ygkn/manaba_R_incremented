import path from 'path';
import CopyPlugin from 'copy-webpack-plugin';
import type { Configuration } from 'webpack';
import { z } from 'zod';

import manifestJSON from './public/manifest.json';

const Env = z.object({
  mode: z.union([z.literal('development'), z.literal('production')]),
});

const srcDir = './src/';

const contentScripts = manifestJSON.content_scripts
  .filter(({ js }) => js !== undefined)
  .flatMap(({ js }) => js)
  .map((jsPath) => path.parse(jsPath).name);

const config = (env: unknown): Configuration => {
  const { mode } = Env.parse(env);

  return {
    mode,
    devtool: mode === 'development' && 'inline-source-map',
    watch: mode === 'development',
    entry: Object.fromEntries(
      [...contentScripts].map((distFileName) => [
        distFileName,
        path.resolve(__dirname, srcDir, `${distFileName}.ts`),
      ])
    ),
    output: {
      path: path.resolve(__dirname, './dist'),
      filename: '[name].js',
      clean: mode === 'production',
    },
    resolve: {
      extensions: ['.js', '.ts', '.tsx'],
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
        patterns: [{ from: '**/*', context: 'public' }],
      }),
    ],
  };
};

export default config;
