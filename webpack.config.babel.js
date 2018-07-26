import webpack from 'webpack'
import path from 'path'

const name = 'ApiAuth'

const production = process.env.NODE_ENV === 'production'

const config = {
    target: 'web',
    entry: [
        'immutable',
        './src/ApiAuthDynamicValue.js'
    ],
    output: {
        path: path.join(__dirname,
            './build/com.dteoh.PawExtensions.ApiAuthDynamicValue'),
        pathInfo: true,
        publicPath: '/build/',
        filename: name + '.js'
    },
    module: {
        loaders: [
            {
                loader: 'babel-loader',
                include: [
                    path.resolve(__dirname, 'src'),
                ],
                test: /\.jsx?$/,
            }
        ]
    }
}
module.exports = config
