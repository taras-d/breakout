var webpack = require('webpack');

module.exports = {
    entry: './src/breakout/game.ts',
    output: {
        path: __dirname + '/src',
        filename: 'bundle.js'
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
        new webpack.DefinePlugin({
            LOG: JSON.stringify(true)
        })
    ]
};