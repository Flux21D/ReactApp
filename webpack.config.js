let path = require('path');
let argv = require('yargs').argv;
let webpack = require('webpack');

let BUILD_DIR = path.resolve(__dirname, 'lib/public/js');
let APP_DIR = path.resolve(__dirname, 'src/public/js');

module.exports = {
    entry: APP_DIR + '/index.js',
    output: {
        path: BUILD_DIR,
        filename: 'bundle.js'
    },
    plugins: [
        new webpack.DefinePlugin({
            'process.env': {
                'NODE_ENV': argv.p ? JSON.stringify('production') : JSON.stringify('development')
            }
        })
    ],
    module: {
        loaders: [{
            test: /\.(js|jsx)?/,
            include: APP_DIR,
            loader: 'babel',
            query: {
                presets: ["es2015", "stage-2", "react"]
            }
    	},
    	{
    	    test: /\.json$/,
    	    loader: 'json-loader'
    	}
    	]
    },
    resolve: {
        extensions: [
            '', '.js', '.jsx'
        ]
    }
};