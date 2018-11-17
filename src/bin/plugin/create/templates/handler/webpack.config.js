const path = require('path');
const nodeExternals = require('webpack-node-externals');
module.exports = {
	target: "node",
	mode: "production",
	entry: {
		app: ["./index.js"]
	},
	output: {
		path: path.resolve(__dirname, "./dist"),
		filename: "plugin-bundle.js",
		libraryTarget: "commonjs2",
	},
	module: {
		rules: [
			{
				test: /\.m?js$/,
				exclude: /(node_modules|bower_components)/,
				use: {
					loader: 'babel-loader',
					options: {
						presets: ['@babel/preset-env']
					}
				}
			}
		]
	},
	externals: [nodeExternals()],
};
