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
const Dotenv = require('dotenv-webpack');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const { exec } = require('child_process');

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

class GenerateBlocksJsonPlugin {
	constructor() {
		this.hasRun = false;
	}

	apply(compiler) {
		compiler.hooks.done.tap('GenerateBlocksJsonPlugin', stats => {
			if (!stats.hasErrors() && !this.hasRun) {
				this.runScript(compiler);
				this.hasRun = true;
			}
		});
	}

	runScript(compiler) {
		exec('npm run update-blocks-json', (error, stdout, stderr) => {
			if (error) {
				console.error(`exec error: ${error}`);
				console.error(`stderr: ${stderr}`);
				compiler.hooks.compilation.tap('GenerateBlocksJsonPlugin', compilation => {
					compilation.errors.push(new Error('Failed to generate blocks.json'));
				});
				return;
			}
			console.log(`stdout: ${stdout}`);
			if (stderr) {
				console.error(`stderr: ${stderr}`);
			}
		});
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
		...(isAnalyze
			? [new BundleAnalyzerPlugin({ analyzerPort: 'auto' })]
			: []),
		new GenerateBlocksJsonPlugin(),
	],
	watchOptions: {
		ignored: /node_modules/,
	},
};

module.exports = [blocksConfig, scriptsConfig];
