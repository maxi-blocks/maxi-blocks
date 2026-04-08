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
		'^@blocks/search-maxi/data$': '<rootDir>/src/components/ai-chat-panel/jest/mocks/blocks.search-maxi.data.js',
		'^@blocks/(.*)$': '<rootDir>/src/blocks/$1',
		'^@components$': '<rootDir>/src/components/ai-chat-panel/jest/mocks/components.js',
		'^@components/(.*)$': '<rootDir>/src/components/$1',
		'^@editor/style-cards/utils$': '<rootDir>/src/components/ai-chat-panel/jest/mocks/editor.style-cards.utils.js',
		'^@extensions/(.*)$': '<rootDir>/src/extensions/$1',
		'^@maxi-core/(.*)$': '<rootDir>/core/$1',
		'^@maxi-icons$': '<rootDir>/src/icons.js',
		'\\.(css|scss)$': '<rootDir>/src/components/ai-chat-panel/jest/styleMock.js',
	},
};

