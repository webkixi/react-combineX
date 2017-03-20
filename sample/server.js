var WebpackDevServer = require('webpack-dev-server')
var webpack = require('webpack');
var configs = require('./webpack.config');

var compiler = webpack(configs)

new WebpackDevServer( compiler, {
    path: configs.output.path,
    publicPath: configs.output.publicPath,
    hot: true,
    historyApiFallback: true,
    host: '0.0.0.0',
    clientLogLevel: "info",
    stats: { colors: true },
    progress: true,
    watch: true,
    watchOptions: {
        aggregateTimeout: 300,
        poll: 1000
    }
}).listen(3000, 'localhost', function (err, result) {
　　if (err) {
　　　　return console.log(err);
　　}
　　console.log('Listening at http://localhost:3000/');
});