const path = require('path');
const nodeExternals = require('webpack-node-externals');

module.exports = {
  mode: 'development', // This will, in the end tell Webpack that here we're building for development and that it will do fewer optimizations to improve our development experience, make debugging even easier, and give us more meaningful error messages, for example.
  stats: 'verbose',
  entry: './src/server.ts',
  target: 'node',
  externals: [nodeExternals()], // in order to ignore all modules in node_modules folder
  externalsPresets: {
    node: true // in order to ignore built-in modules like path, fs, etc.
  },
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
    publicPath: 'dist' // This is just an additional configuration that is needed for the Webpack dev server to really understand where the output is written to and where this is relative to the index HTML file because by default the Webpack dev server serves an index HTML file it finds in the same folder as you run this script
  },
  devtool: 'inline-source-map', // This tells Webpack that there will be generated source maps already, which it should extract and basically wire up correctly to the bundle it generates so that once we get such a bundle, we still have a great development experience.
  module: {
    rules: [
      {
        test: /\.ts$/, // This describes a test Webpack will perform on any file it finds to find out whether this rule here applies to that file or not - a regexp that says any file that ends with .ts should be checked
        use: 'ts-loader', // specifies what wp should do with files found by test - here we say it should be handled by ts-loader
        exclude: /node_modules/
      }
    ]
  },
  resolve: {
    modules: [path.resolve('src'), 'node_modules'],
    // We tell Webpack which file extensions it adds to the imports it finds. Now here we want Webpack to look for these files and therefore here in resolve we can add an extensions
    extensions: ['.ts', '.js']
  }
};
