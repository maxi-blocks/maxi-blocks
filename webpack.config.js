/**
 * WordPress Dependencies
 */
const defaultConfig = require('@wordpress/scripts/config/webpack.config');

/**
 * External Dependencies
 */
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');

const isProduction = process.env.NODE_ENV === 'production';
const mode = isProduction ? 'production' : 'development';

module.exports = {
	...defaultConfig,
	...{
		optimization: {
			concatenateModules:
				mode === 'production' && !process.env.WP_BUNDLE_ANALYZER,
			splitChunks: {
				cacheGroups: {
					style: {
						test: /[\\/]style(\.module)?\.(sc|sa|c)ss$/,
						chunks: 'all',
						enforce: true,
						automaticNameDelimiter: '-',
					},
					default: false,
				},
			},
			minimizer: [
				new OptimizeCSSAssetsPlugin({
					cssProcessorPluginOptions: {
						preset: [
							'default',
							{ discardComments: { removeAll: true } },
						],
					},
				}),
			],
		},
	},
};
