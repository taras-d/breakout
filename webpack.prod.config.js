var webpack = require('webpack');

module.exports = {
    entry: './src/breakout/game.ts',
    output: {
        path: __dirname + '/dist',
        filename: 'breakout.min.js'
    },
    devtool: 'source-map',
    resolve: {
        extensions: ['.ts']
    },
    module: {
        loaders: [
            { test: /\.ts$/, loader: 'awesome-typescript-loader' }
        ]
    },
    plugins: [
        new webpack.optimize.UglifyJsPlugin(),
        new webpack.DefinePlugin({
            LOG: false
        })
    ]
};