var webpack = require('webpack');
var path = require('path');
const nodeExtenerals = require('webpack-node-externals');

function root(args) {
    var _root = path.resolve(__dirname);
    args = Array.prototype.slice.call(arguments, 0);
    return path.join.apply(path, [_root].concat(args));
}

module.exports = [
{
    target: 'node',
    entry: root('src', 'WOLF.ts'),
    output: {
        path: root('dist'),
        filename: 'WOLF-TS.node.min.js',
        libraryTarget: 'commonjs'
    },
    resolve: {
        extensions: ['.ts', '.tsx', '.js'],
        alias: {
            'socket.io-client': root('node_modules', 'socket.io-client', 'dist', 'socket.io.js')
        }
    },
    module: {
        rules: [{
            test: /\.tsx?$/,
            include: [
                root('src')
            ],
            loader: 'ts-loader'
        }]
    },
    optimization: {
        minimize: false
    },
    externals: [nodeExtenerals()]
}];