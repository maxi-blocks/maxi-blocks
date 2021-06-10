module.exports = function (api) {
	if (api) {
		api.cache(true);
		api.debug = process.env.NODE_ENV === 'development' || false;
	}

	const presets = [
		'@babel/preset-react',
		'@wordpress/babel-preset-default',
		[
			'@babel/preset-env',
			{
				// Do not transform modules to CJS.
				modules: false,
				targets: {
					browsers: [
						'last 2 Chrome versions',
						'last 2 Firefox versions',
						'last 2 Safari versions',
						'last 2 iOS versions',
						'last 1 Android version',
						'last 1 ChromeAndroid version',
						'ie 11',
					],
				},
			},
		],
	];
	const plugins = [
		'@babel/plugin-proposal-class-properties',
		'@babel/plugin-transform-classes',
		'@babel/plugin-syntax-async-generators',
		'@babel/plugin-syntax-object-rest-spread',
		'@wordpress/babel-plugin-import-jsx-pragma',
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
		[
			'module:react-native-dotenv',
			{
				moduleName: '@env',
				safe: true,
				path: '.env',
				allowUndefined: true,
			},
		],
	];

	return {
		presets,
		plugins,
	};
};
