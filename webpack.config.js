/**
 * WordPress Dependencies
 */
const defaultConfig = require('@wordpress/scripts/config/webpack.config');

/**
 * External Dependencies
 */
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const { resolve, relative } = require('path');
const { sync: glob } = require('fast-glob');
const Dotenv = require('dotenv-webpack');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const JsonMinimizerPlugin = require('json-minimizer-webpack-plugin');

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

class UpdateBlocksJsonWarningPlugin {
	apply(compiler) {
		compiler.hooks.watchRun.tap(
			'UpdateBlocksJsonWarningPlugin',
			compilation => {
				const changedFiles = compilation.modifiedFiles || new Set();

				const shouldWarn = Array.from(changedFiles).some(file => {
					const relativePath = relative(compiler.context, file);
					return (
						relativePath.includes('attributes.js') ||
						relativePath.startsWith(
							'src/extensions/styles/defaults'
						)
					);
				});

				if (shouldWarn) {
					console.warn(
						'\x1b[33m%s\x1b[0m',
						"Warning: Changes detected in attributes.js or styles defaults. Don't forget to run npm run update-blocks-json"
					);
				}
			}
		);
	}
}

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
			new JsonMinimizerPlugin(),
		],
	},
	resolve: {
		...defaultConfig.resolve,
		fallback: { ...defaultConfig.resolve.fallback, https: false },
		alias: {
			...defaultConfig.resolve.alias,
		},
	},
	plugins: [
		...defaultConfig.plugins,
		new Dotenv(),
		new UpdateBlocksJsonWarningPlugin(),
		...(isAnalyze
			? [new BundleAnalyzerPlugin({ analyzerPort: 'auto' })]
			: []),
	],
	watchOptions: {
		ignored: /node_modules/,
	},
};

module.exports = [blocksConfig, scriptsConfig];
