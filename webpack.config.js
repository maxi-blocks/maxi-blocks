/**
 * WordPress Dependencies
 */
const defaultConfig = require('@wordpress/scripts/config/webpack.config');

/**
 * External Dependencies
 */
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const { resolve } = require('path');
const { sync: glob } = require('fast-glob');

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
};

// Blocks config
const blocksConfig = {
	...defaultConfig,
	entry: {
		...defaultConfig.entry(),
		admin: ['./core/admin/admin.js', './core/admin/admin.scss'],
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
			'react/jsx-runtime': resolve('react/jsx-runtime'),
		},
	},
};

module.exports = [blocksConfig, scriptsConfig];
