module.exports = {
	...require('@wordpress/scripts/config/jest-e2e.config'),

	rootDir: '../',
	roots: ['<rootDir>/e2e-tests'],

	setupFilesAfterEnv: [
		'<rootDir>/e2e-tests/setup-test-framework.js',
		'@wordpress/jest-console',
	],
	maxConcurrency: 20,
};
