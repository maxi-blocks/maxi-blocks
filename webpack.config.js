/**
 * WordPress Dependencies
 */
const defaultConfig = require('@wordpress/scripts/config/webpack.config');

/**
 * External Dependencies
 */
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');

const isProduction = process.env.NODE_ENV === 'production';
const mode = isProduction ? 'production' : 'development';

module.exports = {
	...defaultConfig,
	resolve: {
		...defaultConfig.resolve,
		fallback: { ...defaultConfig.resolve.fallback, https: false },
	},
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
			new TerserPlugin({
				cache: true,
				parallel: true,
				sourceMap: !isProduction,
				terserOptions: {
					output: {
						comments: /translators:/i,
					},
					compress: {
						passes: 2,
					},
					mangle: {
						reserved: ['__', '_n', '_nx', '_x'],
					},
				},
				extractComments: false,
			}),
		],
	},
};
