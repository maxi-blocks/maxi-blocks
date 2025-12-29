const autoprefixer = require('autoprefixer');
const variableShortener = require('./postcss-variable-shortener');

module.exports = ({ env }) => ({
	map: false,
	plugins: [
		autoprefixer,
		...(env === 'production' ? [variableShortener()] : []),
	],
});
