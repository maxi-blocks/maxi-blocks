module.exports = {
	...require('@wordpress/scripts/config/jest-e2e.config'),
	setupFilesAfterEnv: [
		'<rootDir>/setup-test-framework.js',
		'@wordpress/jest-console',
	],
	maxConcurrency: 20,
};
