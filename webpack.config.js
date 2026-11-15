const path = require('path');

module.exports = {
    mode: "development",
    // entry: './src/simpleParticle/index.ts',

    entry: './src/complexParticle/index.ts',

    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules/,
            },
        ],
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js'],
    },
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'dist'),
    },
    devServer: {
        static: './dist',
        host: '0.0.0.0',      // listen on your Wi-Fi network so phones/tablets can connect
        allowedHosts: 'all',
    }
};