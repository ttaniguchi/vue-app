const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const GitRevisionPlugin = require('git-revision-webpack-plugin');
const NotifierPlugin = require('webpack-notifier');
const VueLoaderPlugin = require('vue-loader/lib/plugin');

const gitRevision = new GitRevisionPlugin();

module.exports = (env, { mode }) => ({
  entry: './src/js/index.js',
  output: {
    path: path.resolve(__dirname, './dist'),
    filename: `bundle.[git-revision-version].js`,
  },
  module: {
    rules: [
      {
        test: /\.(js|vue)$/,
        use: 'eslint-loader',
        include: [path.resolve(__dirname, 'src/js')],
        enforce: 'pre',
      },
      {
        // <style module>に対応
        test: /\.css$/,
        use: ["style-loader", "css-loader"],
      },
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        include: [path.resolve(__dirname, 'src/js')],
        options: {
          // <style scoped>に対応
          loaders: {
            css: 'vue-style-loader!css-loader',
          }
        },
      },
    ]
  },
  devServer: {
    contentBase: path.resolve(__dirname, 'public'),
    host: '0.0.0.0',
    port: 8081,
    open: false,
    openPage: ''
  },
  resolve: {
    extensions: ['.js', '.vue'],
    alias: {
      '@': path.resolve(__dirname, 'src/js'),
      vue$: 'vue/dist/vue.esm.js',
    },
  },
  plugins: [
    gitRevision,
    new HtmlWebpackPlugin({
      hash: false,
      minify: false,
      filename: 'index.html',
      template: './src/index.html',
    }),
    new NotifierPlugin({
      title: 'Webpack ビルド完了',
      excludeWarnings: false,
      alwaysNotify: false,
      skipFirstNotification: false,
    }),
    new VueLoaderPlugin(),
    new webpack.DefinePlugin({
      QIITA_ACCESS_TOKEN: JSON.stringify(process.env.QIITA_ACCESS_TOKEN),
    }),
    new webpack.LoaderOptionsPlugin({
      options: {
        eslint: {
          configFile: './.eslintrc',
        }
      }
    }),
  ]
});
