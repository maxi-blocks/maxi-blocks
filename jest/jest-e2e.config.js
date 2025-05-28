module.exports = {
	...require('@wordpress/scripts/config/jest-e2e.config'),

	rootDir: '../',
	roots: ['<rootDir>/e2e-tests'],

	moduleNameMapper: {
		'^@blocks$': '<rootDir>/src/blocks',
		'^@blocks/(.*)$': '<rootDir>/src/blocks/$1',
		'^@components$': '<rootDir>/src/components',
		'^@components/(.*)$': '<rootDir>/src/components/$1',
		'^@css$': '<rootDir>/src/css',
		'^@css/(.*)$': '<rootDir>/src/css/$1',
		'^@editor$': '<rootDir>/src/editor',
		'^@editor/(.*)$': '<rootDir>/src/editor/$1',
		'^@extensions$': '<rootDir>/src/extensions',
		'^@extensions/(.*)$': '<rootDir>/src/extensions/$1',
		'^@maxi-icons$': '<rootDir>/src/icons',
		'^@maxi-icons/(.*)$': '<rootDir>/src/icons/$1',
		'^@maxi-core/(.*)$': '<rootDir>/core/$1',
	},

	setupFilesAfterEnv: [
		'<rootDir>/e2e-tests/setup-test-framework.js',
		'@wordpress/jest-console',
	],
	maxConcurrency: 20,
};
