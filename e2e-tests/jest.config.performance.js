module.exports = {
	...require('@wordpress/scripts/config/jest-e2e.config'),
	testMatch: ['**/?(*.)perf.[jt]s?(x)'],
	setupFilesAfterEnv: ['<rootDir>/setup-test-framework.js'],
	maxConcurrency: 20,
};
