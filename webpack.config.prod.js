import path from 'path'
import nodeExternals from 'webpack-node-externals'

import CleanPlugin from 'clean-webpack-plugin'

export default {
  mode: 'production', // this will tell Webpack to do these optimizations, minify our code and so on.
  entry: './src/server.ts',
  target: 'node',
  externals: [nodeExternals()], // in order to ignore all modules in node_modules folder
  externalsPresets: {
    node: true // in order to ignore built-in modules like path, fs, etc.
  },
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, '/dist')
  },
  devtool: false,
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: 'ts-loader',
        exclude: /node_modules/
      }
    ]
  },
  resolve: {
    extensions: ['.ts', '.js']
  },
  plugins: [new CleanPlugin.CleanWebpackPlugin()] // Plug ins are extra well extensions or plug ins you can add to your Webpack workflow, which will basically be applied to the entire output to the entire project. Rules and modules specifically are applied on a per file level. Plug ins are applied to the general workflow. Here I want to add a plug in which automatically deletes everything in the dist folder before new output is written there so that we always just have the latest most recent output in the dist folder.
};
