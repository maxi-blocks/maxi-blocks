module.exports = {
	...require('@wordpress/scripts/config/jest-unit.config'),

	rootDir: '../',
	roots: ['<rootDir>/src'],

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
};
