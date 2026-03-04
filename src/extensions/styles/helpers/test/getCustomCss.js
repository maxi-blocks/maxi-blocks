/**
 * Internal dependencies
 */
import getCustomCssObject from '@extensions/styles/helpers/getCustomCss';

// Mock dependencies
jest.mock('src/extensions/styles/getLastBreakpointAttribute', () => {
	return jest.fn(({ target, breakpoint, attributes }) => {
		if (!attributes) return null;
		return attributes[
			`${target}${breakpoint === 'general' ? '' : `-${breakpoint}`}`
		];
	});
});

jest.mock('src/extensions/styles/getGroupAttributes', () => {
	return jest.fn((props, group) => {
		if (group === 'customCss') {
			return props.customCss || {};
		}
		return {};
	});
});

describe('getCustomCssObject', () => {
	it('should return empty object when no selectors provided', () => {
		const result = getCustomCssObject({}, {});
		expect(result).toEqual({});
	});

	it('should process single selector with custom CSS', () => {
		const selectors = {
			block: {
				0: {
					target: '.my-block',
				},
			},
		};

		const props = {
			customCss: {
				'custom-css': {
					block: {
						0: '.my-block { color: red; }',
					},
				},
			},
		};

		const result = getCustomCssObject(selectors, props);
		expect(result).toEqual({
			'.my-block': {
				customCss: {
					general: {
						css: '.my-block { color: red; }',
					},
				},
			},
		});
	});

	it('should handle multiple selectors and categories', () => {
		const selectors = {
			block: {
				0: {
					target: '.block-main',
				},
			},
			hover: {
				0: {
					target: '.block-main:hover',
				},
			},
		};

		const props = {
			customCss: {
				'custom-css': {
					block: {
						0: 'padding: 20px;',
					},
					hover: {
						0: 'background: blue;',
					},
				},
			},
		};

		const result = getCustomCssObject(selectors, props);
		expect(result).toEqual({
			'.block-main': {
				customCss: {
					general: {
						css: 'padding: 20px;',
					},
				},
			},
			'.block-main:hover': {
				customCss: {
					general: {
						css: 'background: blue;',
					},
				},
			},
		});
	});

	it('should ignore empty or invalid CSS values', () => {
		const selectors = {
			block: {
				0: {
					target: '.block-1',
				},
				1: {
					target: '.block-2',
				},
			},
		};

		const props = {
			customCss: {
				'custom-css': {
					block: {
						0: 'margin: 10px;',
						1: '', // empty CSS
					},
				},
			},
		};

		const result = getCustomCssObject(selectors, props);
		expect(result).toEqual({
			'.block-1': {
				customCss: {
					general: {
						css: 'margin: 10px;',
					},
				},
			},
		});
	});

	it('should handle missing or undefined properties', () => {
		const selectors = {
			block: {
				0: {
					target: '.block',
				},
			},
		};

		const props = {
			customCss: {
				'custom-css': {
					block: {
						1: 'color: green;', // index doesn't match selector
					},
				},
			},
		};

		const result = getCustomCssObject(selectors, props);
		expect(result).toEqual({});
	});

	it('should process CSS across different breakpoints', () => {
		const selectors = {
			block: {
				0: {
					target: '.responsive-block',
				},
			},
		};

		const props = {
			customCss: {
				'custom-css': {
					block: {
						0: 'font-size: 16px;',
					},
				},
				'custom-css-m': {
					block: {
						0: 'font-size: 14px;',
					},
				},
			},
		};

		const result = getCustomCssObject(selectors, props);
		expect(result).toEqual({
			'.responsive-block': {
				customCss: {
					general: {
						css: 'font-size: 16px;',
					},
					m: {
						css: 'font-size: 14px;',
					},
				},
			},
		});
	});
});
