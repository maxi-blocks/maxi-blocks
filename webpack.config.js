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

glob(resolve(process.cwd(), 'js/*')).forEach(file => {
	if (
		file.endsWith('.js') &&
		file.startsWith(resolve(process.cwd(), 'js/maxi-'))
	) {
		const name = file
			.replace('.js', '')
			.replace(resolve(process.cwd(), 'js'), '')
			.replace('/', '');

		jsFiles[name] = resolve(process.cwd(), 'js', file);
	}
});

const scriptsConfig = {
	mode: defaultConfig.mode,
	target: defaultConfig.target,
	entry: jsFiles,
	output: {
		filename: '[name].min.js',
		path: resolve(process.cwd(), 'js/min'),
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
	},
};

module.exports = [blocksConfig, scriptsConfig];
