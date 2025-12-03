/**
 * ESLint configuration for performance monitoring
 *
 * This is a development-only debugging tool where console statements,
 * incrementing operators, and other patterns are intentional.
 */

module.exports = {
	rules: {
		'no-console': 'off', // Console logging is intentional for debugging
		'no-plusplus': 'off', // Incrementing operators are fine for counters
		'class-methods-use-this': 'off', // Some methods don't need 'this'
		'consistent-return': 'off', // Detection methods may conditionally return
		'func-names': 'off', // Anonymous functions are acceptable here
		'no-unused-vars': 'warn', // Downgrade to warning instead of error
	},
};
