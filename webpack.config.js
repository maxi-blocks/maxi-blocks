/**
 * WordPress Dependencies
 */
const defaultConfig = require('@wordpress/scripts/config/webpack.config');

const isProduction = process.env.NODE_ENV === 'production';
const mode = isProduction ? 'production' : 'development';

module.exports = {
	...defaultConfig,
	resolve: {
		...defaultConfig.resolve,
		fallback: { https: false },
	},
};
