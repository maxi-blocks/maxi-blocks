/**
 * WordPress Dependencies
 */
const defaultConfig = require('@wordpress/scripts/config/webpack.config');

/**
 * External Dependencies
 */
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const RtlCssPlugin = require('rtlcss-webpack-plugin');
const { resolve } = require('path');
const { sync: glob } = require('fast-glob');
const Dotenv = require('dotenv-webpack');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');

// Check if ANALYZE is set to true
const isAnalyze = process.env.ANALYZE === 'true';

// Frontend scripts config
const jsFiles = {};

// glob doesn't work with backslash (Windows) paths, this function is required to normalize paths between platforms.
// https://github.com/mrmlnc/fast-glob#how-to-write-patterns-on-windows
const resolveNormalized = (...pathSegments) =>
	resolve(...pathSegments).replace(/\\/g, '/');

glob(resolveNormalized(__dirname, 'js/*')).forEach(file => {
	if (
		file.endsWith('.js') &&
		file.startsWith(resolveNormalized(__dirname, 'js/maxi-'))
	) {
		const name = file
			.replace('.js', '')
			.replace(resolveNormalized(__dirname, 'js'), '')
			.replace('/', '');

		jsFiles[name] = resolveNormalized(__dirname, 'js', file);
	}
});

const scriptsConfig = {
	mode: defaultConfig.mode,
	target: defaultConfig.target,
	entry: jsFiles,
	output: {
		filename: '[name].min.js',
		path: resolveNormalized(__dirname, 'js/min'),
	},
	plugins: [new Dotenv()],
};

// Blocks config
const blocksConfig = {
	...defaultConfig,
	entry: {
		...defaultConfig.entry(),
		admin: ['./core/admin/admin.js', './core/admin/admin.scss'],
	},
	output: {
		...defaultConfig.output,
		filename: '[name].min.js', // Add .min to filename so WP.org i18n skips it
		chunkFilename: '[name].min.js',
	},
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
		alias: {
			...defaultConfig.resolve.alias,
			'@blocks': resolve(__dirname, 'src/blocks'),
			'@components': resolve(__dirname, 'src/components'),
			'@css': resolve(__dirname, 'src/css'),
			'@editor': resolve(__dirname, 'src/editor'),
			'@extensions': resolve(__dirname, 'src/extensions'),
			'@maxi-icons': resolve(__dirname, 'src/icons'),
			'@maxi-core': resolve(__dirname, 'core'),
		},
		extensions: ['.js', '.json', ...defaultConfig.resolve.extensions],
	},
	plugins: [
		...defaultConfig.plugins.filter(
			// Remove default MiniCssExtractPlugin and RtlCssPlugin so we can add our own with .min.css
			plugin =>
				!(plugin instanceof MiniCssExtractPlugin) &&
				!(plugin instanceof RtlCssPlugin)
		),
		new MiniCssExtractPlugin({
			filename: '[name].min.css', // Add .min to CSS filename
		}),
		new RtlCssPlugin({
			filename: '[name]-rtl.min.css', // Add .min to RTL CSS filename
		}),
		new Dotenv(),
		...(isAnalyze
			? [new BundleAnalyzerPlugin({ analyzerPort: 'auto' })]
			: []),
	],
};

module.exports = [blocksConfig, scriptsConfig];
