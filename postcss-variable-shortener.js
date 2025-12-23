const { aliasMap } = require('./config/css-optimization/variable-aliases');

module.exports = () => ({
	postcssPlugin: 'postcss-variable-shortener',
	Declaration(decl) {
		Object.entries(aliasMap).forEach(([longName, shortName]) => {
			if (decl.prop === longName) {
				decl.prop = shortName;
			}
			if (decl.value && decl.value.includes(longName)) {
				decl.value = decl.value.replaceAll(longName, shortName);
			}
		});
	},
});
module.exports.postcss = true;
