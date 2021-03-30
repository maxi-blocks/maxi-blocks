/**
 * External dependencies
 */
const defaultBabel = require('@wordpress/scripts/config/babel-transform.js');

module.exports = defaultBabel.createTransformer({
	presets: ['@babel/preset-react', '@babel/preset-env'],
	plugins: [
		'@babel/plugin-proposal-class-properties',
		[
			'@babel/plugin-transform-spread',
			{
				loose: true,
			},
		],
		'@babel/plugin-transform-classes',
		'@babel/plugin-proposal-object-rest-spread',
		[
			'transform-react-jsx',
			{
				pragma: 'wp.element.createElement',
			},
		],
	],
});
