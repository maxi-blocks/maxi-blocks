module.exports = {
	presets: [
		'@wordpress/babel-preset-default',
		['@babel/preset-env', { targets: { node: 'current' } }],
	],
	plugins: [
		'@babel/plugin-transform-runtime',
		'@babel/plugin-proposal-class-properties',
		'@babel/plugin-proposal-object-rest-spread',
	],
};
