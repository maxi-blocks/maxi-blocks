const baseConfig = require('@wordpress/scripts/config/jest-unit.config');

module.exports = {
	...baseConfig,
	rootDir: '../../../..',
	roots: ['<rootDir>/src/components/ai-chat-panel'],
	testEnvironment: 'jsdom',
	setupFilesAfterEnv: ['<rootDir>/src/components/ai-chat-panel/jest/setupTests.js'],
	testMatch: [
		'<rootDir>/src/components/ai-chat-panel/**/__tests__/**/*.test.js',
	],
	moduleNameMapper: {
		...(baseConfig.moduleNameMapper || {}),
		'\\.(css|scss)$': '<rootDir>/src/components/ai-chat-panel/jest/styleMock.js',
	},
};

