module.exports = function (api) {
	if (api) {
		api.cache(true);
		api.debug = process.env.NODE_ENV === 'development' || false;
	}

	const presets = ['@babel/preset-react', '@wordpress/babel-preset-default'];
	const plugins = [
		'@babel/plugin-proposal-class-properties',
		'@babel/plugin-transform-classes',
		'@babel/plugin-syntax-async-generators',
		'@babel/plugin-syntax-object-rest-spread',
		[
			'@babel/plugin-proposal-object-rest-spread',
			{
				loose: true,
				useBuiltIns: true,
			},
		],
		[
			'@babel/plugin-transform-spread',
			{
				loose: true,
				allowArrayLike: true,
			},
		],
		[
			'@babel/plugin-transform-runtime',
			{
				helpers: false,
				regenerator: true,
			},
		],
	];

	return {
		presets,
		plugins,
	};
};
