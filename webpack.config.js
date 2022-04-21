/**
 * WordPress Dependencies
 */
const defaultConfig = require('@wordpress/scripts/config/webpack.config');

/**
 * External Dependencies
 */
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const { basename, dirname } = require('path');

const isProduction = process.env.NODE_ENV === 'production';

module.exports = {
	...defaultConfig,
	...{
		optimization: {
			// Only concatenate modules in production, when not analyzing bundles.
			concatenateModules: isProduction && !process.env.WP_BUNDLE_ANALYZER,
			splitChunks: {
				cacheGroups: {
					style: {
						type: 'css/mini-extract',
						test: /[\\/]style(\.module)?\.(sc|sa|c)ss$/,
						chunks: 'all',
						enforce: true,
						name(_, chunks, cacheGroupKey) {
							const chunkName = chunks[0].name;
							return `${dirname(
								chunkName
							)}/${cacheGroupKey}-${basename(chunkName)}`;
						},
					},
					default: false,
				},
			},
			minimizer: [
				new CssMinimizerPlugin(),
				new TerserPlugin({
					parallel: true,
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
	},
	resolve: {
		...defaultConfig.resolve,
		fallback: { ...defaultConfig.resolve.fallback, https: false },
	},
};
