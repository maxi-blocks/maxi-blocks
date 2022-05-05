/**
 * WordPress Dependencies
 */
const defaultConfig = require('@wordpress/scripts/config/webpack.config');

/**
 * External Dependencies
 */
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');

module.exports = {
	...defaultConfig,
	optimization: {
		...defaultConfig.optimization,
		minimizer: [
			new CssMinimizerPlugin({
				minimizerOptions: {
					preset: [
						'default',
						{
							discardComments: { removeAll: true },
						},
					],
				},
			}),
			...defaultConfig.optimization.minimizer,
		],
	},
	resolve: {
		...defaultConfig.resolve,
		fallback: { ...defaultConfig.resolve.fallback, https: false },
	},
	entry: {
		admin: ['./core/admin/admin.js', './core/admin/admin.scss'],
		index: ['./src/index.js'],
	},
};
