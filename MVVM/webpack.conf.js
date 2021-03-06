var path = require('path');
var htmlWebpackPlugin = require('html-webpack-plugin');


module.exports = {
    entry: './src/MVVM.js',
    output: {
        path: path.resolve(__dirname, './dist'),
        filename: '[name].bundle.js'
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                include: path.resolve(__dirname, './src'),
                exclude: [path.resolve(__dirname,'./node_modules'), path.resolve(__dirname,'./src/js/util.js')],
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['env','stage-2']
                    }
                }
            }
        ]
    }
}
