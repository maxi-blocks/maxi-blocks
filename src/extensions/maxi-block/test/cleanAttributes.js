import cleanAttributes from '../cleanAttributes';

jest.mock('src/extensions/styles/getDefaultAttribute.js', () =>
	jest.fn(() => undefined)
);
jest.mock('@wordpress/data', () => {
	return {
		select: jest.fn(() => {
			return {
				receiveBaseBreakpoint: jest.fn(() => 'm'),
				getPrevSavedAttrs: jest.fn(() => []),
			};
		}),
		createReduxStore: jest.fn(),
		register: jest.fn(),
		dispatch: jest.fn(() => {
			return { savePrevSavedAttrs: jest.fn() };
		}),
	};
});
import { select } from '@wordpress/data';

describe('cleanAttributes', () => {
	it('Should flat the entry object with same value for same attribute with different breakpoints, and just return general one', () => {
		const newAttributes = {
			'test-general': 10,
			'test-xl': 10,
		};

		const attributes = {
			'test-general': 11,
			'test-xl': 11,
		};

		const result = cleanAttributes({ newAttributes, attributes });
		const expectedResult = {
			'test-general': 10,
			'test-xl': undefined,
		};

		expect(result).toStrictEqual(expectedResult);
	});

	it('Should return M value as default, as is equal as its closest valid attribute (general)', () => {
		const newAttributes = {
			'test-m': 100,
		};

		const attributes = {
			'test-general': 100,
			'test-m': 99,
		};

		const result = cleanAttributes({ newAttributes, attributes });
		const expectedResult = {
			'test-m': undefined,
		};

		expect(result).toStrictEqual(expectedResult);
	});

	it('Should return M value as default, as is equal as its closest valid attribute (l)', () => {
		const newAttributes = {
			'test-m': 99,
		};

		const attributes = {
			'test-general': 100,
			'test-l': 99,
			'test-m': 98,
		};

		const result = cleanAttributes({ newAttributes, attributes });
		const expectedResult = {
			'test-m': undefined,
		};

		expect(result).toStrictEqual(expectedResult);
	});

	it('Should return XXL value as default, as is equal as its closest valid attribute (general)', () => {
		const newAttributes = {
			'test-xxl': 100,
		};

		const attributes = {
			'test-general': 100,
		};

		const result = cleanAttributes({
			newAttributes,
			attributes,
		});

		const expectedResult = {
			'test-xxl': undefined,
		};

		expect(result).toStrictEqual(expectedResult);
	});

	it('Should return L value as default, as is equal as its general saving attribute (general)', () => {
		const newAttributes = {
			'test-general': 100,
		};

		const attributes = {
			'test-general': 99,
			'test-l': 100,
		};

		const result = cleanAttributes({ newAttributes, attributes });
		const expectedResult = {
			'test-general': 100,
			'test-l': undefined,
		};

		expect(result).toStrictEqual(expectedResult);
	});

	it('Should return XXL value as default, as is equal as its general saving attribute (general)', () => {
		const newAttributes = {
			'test-general': 100,
		};

		const attributes = {
			'test-general': 99,
			'test-xxl': 100,
		};

		const result = cleanAttributes({ newAttributes, attributes });
		const expectedResult = {
			'test-general': 100,
			'test-xxl': undefined,
		};

		expect(result).toStrictEqual(expectedResult);
	});

	it('Color layer object with defaultAttributes object', () => {
		const newAttributes = {
			'test-status-m': true,
			'test-m': 4,
		};
		const attributes = {
			'test-status-general': true,
			'test-general': 4,

			'test-m': 7,
			'test-status-m': true,
		};
		const defaultAttributes = {
			'test-status-general': true,
			'test-general': 4,
		};

		const result = cleanAttributes({
			newAttributes,
			attributes,
			defaultAttributes,
		});
		const expectedResult = {
			'test-status-m': undefined,
			'test-m': undefined,
		};

		expect(result).toStrictEqual(expectedResult);
	});

	it('On changing general attribute, if coincide with winBreakpoint, it should overwrite it', () => {
		const obj = {
			newAttributes: {
				'test-status-general': true,
				'test-general': 4,
				'test-opacity-general': 1,
			},
			attributes: {
				'test-status-general': true,
				'test-general': 4,
				'test-status-m': true,
				'test-opacity-m': 1,
				'test-m': 8,
				'test-opacity-general': 1,
			},
		};

		const result = cleanAttributes(obj);

		const expectedResult = {
			'test-status-general': true,
			'test-general': 4,
			'test-m': undefined,
			'test-opacity-general': 1,
			'test-status-m': undefined,
			'test-opacity-m': undefined,
		};

		expect(result).toStrictEqual(expectedResult);
	});

	it('On changing general attribute, if there is a smaller breakpoint with same value, it should be returned to its default', () => {
		const obj = {
			'test-general': 8,
		};
		const attributes = {
			'test-status-general': true,
			'test-general': 5,

			'test-m': 8,
		};
		const defaultAttributes = {
			'test-status-general': true,
			'test-general': 5,
		};

		const result = cleanAttributes({
			newAttributes: obj,
			attributes,
			defaultAttributes,
		});

		const expectedResult = {
			'test-general': 8,
			'test-m': undefined,
		};

		expect(result).toStrictEqual(expectedResult);
	});

	it('On changing general attribute, if there is a smaller breakpoint with same value, it should be returned to its default - 2', () => {
		const obj = {
			newAttributes: {
				'test-general': 7,
				'test-m': 7,
			},
			attributes: {
				'test-general': 4,
				'test-m': 8,
			},
			defaultAttributes: {
				'test-general': 4,
			},
		};

		const result = cleanAttributes(obj);

		const expectedResult = {
			'test-general': 7,
			'test-m': undefined,
		};

		expect(result).toStrictEqual(expectedResult);
	});

	it('On changing S attribute to the same than XS, having different attributes for general and XS, XS should disappear', () => {
		const newAttributes = {
			'test-status-s': true,
			'test-s': 8,
		};
		const attributes = {
			'test-status-general': true,
			'test-general': 4,
			'test-status-xs': true,
			'test-xs': 8,
		};
		const defaultAttributes = {
			'test-status-general': true,
			'test-general': 4,
		};

		const result = cleanAttributes({
			newAttributes,
			attributes,
			defaultAttributes,
		});

		const expectedResult = {
			'test-s': 8,
			'test-xs': undefined,
			'test-status-s': undefined,
			'test-status-xs': undefined,
		};

		expect(result).toStrictEqual(expectedResult);
	});

	it('With a General value equal to M value, and a different value on XL, when resetting XL, M should be replaced with default', () => {
		const obj = {
			newAttributes: {
				'test-l': undefined,
			},
			attributes: {
				'test-general': 2,
				'test-l': 4,
				'test-m': 2,
			},
			defaultAttributes: {
				'test-general': 2,
			},
		};

		const expectedResult = {
			'test-l': undefined,
			'test-m': undefined,
		};

		const result = cleanAttributes(obj);

		expect(expectedResult).toStrictEqual(result);
	});

	it('Random test', () => {
		select.mockImplementation(
			jest.fn(() => {
				return {
					receiveBaseBreakpoint: jest.fn(() => 'l'),
					getPrevSavedAttrs: jest.fn(() => []),
				};
			})
		);

		const firstRound = {
			newAttributes: {
				'test-xl': 3,
			},
			attributes: {
				'test-general': 1,
			},
			defaultAttributes: {
				'test-general': 1,
			},
		};
		const secondRound = {
			newAttributes: {
				'test-general': 4,
				'test-l': 4,
			},
			attributes: {
				'test-xl': 3,
				'test-general': 1,
			},
			defaultAttributes: {
				'test-general': 1,
			},
		};

		const resultFirstRound = cleanAttributes(firstRound);
		const resultSecondRound = cleanAttributes(secondRound);

		// Change winBreakpoint to M
		select.mockImplementation(
			jest.fn(() => {
				return {
					receiveBaseBreakpoint: jest.fn(() => 'm'),
					getPrevSavedAttrs: jest.fn(() => []),
				};
			})
		);

		const thirdRound = {
			newAttributes: {
				'test-l': 4,
			},
			attributes: {
				'test-xl': 3,
				'test-general': 4,
			},
			defaultAttributes: {
				'test-general': 1,
			},
		};

		const resultThirdRound = cleanAttributes(thirdRound);

		const expectedFirstRound = {
			'test-xl': 3,
			'test-l': 1,
		};
		const expectedSecondRound = {
			'test-general': 4,
			'test-l': 4,
		};
		const expectedThirdRound = {
			'test-l': 4,
			// 'test-m': 4, //! !
		};

		expect(resultFirstRound).toStrictEqual(expectedFirstRound);
		expect(resultSecondRound).toStrictEqual(expectedSecondRound);
		expect(resultThirdRound).toStrictEqual(expectedThirdRound);

		const resultAttrs = {
			...firstRound.attributes,
			...resultFirstRound,
			...secondRound.attributes,
			...resultSecondRound,
			...thirdRound.attributes,
			...resultThirdRound,
		};

		const expectedResult = {
			'test-xl': 3,
			'test-general': 4,
			'test-l': 4,
			// 'test-m': 4,
		};

		expect(resultAttrs).toStrictEqual(expectedResult);
	});

	it('Random test 2', () => {
		// Change winBreakpoint to M
		select.mockImplementation(
			jest.fn(() => {
				return {
					receiveBaseBreakpoint: jest.fn(() => 'l'),
					getPrevSavedAttrs: jest.fn(() => []),
				};
			})
		);

		const obj = {
			newAttributes: {
				'border-palette-color-general': 2,
			},
			attributes: {
				'border-palette-color-general': 2,
				'border-palette-color-l': 4,
				'border-palette-color-m': 5,
			},
		};

		const result = cleanAttributes(obj);

		const expectedResult = {
			'border-palette-color-general': 2,
			'border-palette-color-l': undefined,
		};

		expect(result).toStrictEqual(expectedResult);
	});

	it('Random test 3', () => {
		const obj = {
			newAttributes: {
				'background-palette-color-general': 4,
			},
			attributes: {
				'background-palette-color-general': 1,
				'background-palette-color-l': 4,
			},

			defaultAttributes: {
				'background-palette-color-general': 1,
				// 'background-palette-color-l': 4,
			},
		};

		const result = cleanAttributes(obj);

		const expectedResult = {
			'background-palette-color-general': 4,
			'background-palette-color-l': undefined,
		};

		expect(result).toStrictEqual(expectedResult);
	});

	it('Saving an attribute higher than winBase, when winBase attribute is default, return the new attribute value and sets general value to winBase attribute', () => {
		// Change winBreakpoint to M
		select.mockImplementation(
			jest.fn(() => {
				return {
					receiveBaseBreakpoint: jest.fn(() => 'm'),
					getPrevSavedAttrs: jest.fn(() => []),
				};
			})
		);

		const obj = {
			newAttributes: {
				'test-l': 4,
			},
			attributes: {
				'test-general': 1,
			},
			defaultAttributes: {
				'test-general': 1,
			},
		};

		const result = cleanAttributes(obj);

		const expectedResult = {
			'test-l': 4,
			'test-m': 1,
		};

		expect(result).toStrictEqual(expectedResult);
	});

	it('Random test 4', () => {
		const obj = {
			newAttributes: {
				'border-palette-opacity-s': 0.45,
			},
			attributes: {
				'border-palette-opacity-general': 0.45,
			},
			defaultAttributes: {
				'border-palette-opacity-general': 100,
			},
		};

		const result = cleanAttributes(obj);

		const expectedResult = {
			'border-palette-opacity-s': undefined,
		};

		expect(result).toStrictEqual(expectedResult);
	});

	it('On change general attribute, if default base breakpoint attribute exist', () => {
		select.mockImplementation(
			jest.fn(() => {
				return {
					receiveBaseBreakpoint: jest.fn(() => 'xl'),
					getPrevSavedAttrs: jest.fn(() => []),
				};
			})
		);

		const obj = {
			newAttributes: {
				'test-general': 'em',
				'test-xl': 'em',
			},
			attributes: {
				'test-general': undefined,
				'test-xl': 'px',
			},
			defaultAttributes: {
				'test-general': undefined,
				'test-xl': 'px',
			},
		};

		const result = cleanAttributes(obj);

		const expectedResult = {
			'test-general': 'em',
			'test-xl': undefined,
		};

		expect(result).toStrictEqual(expectedResult);
	});

	it('Random test 6', () => {
		select.mockImplementation(
			jest.fn(() => {
				return {
					receiveBaseBreakpoint: jest.fn(() => 'l'),
					getPrevSavedAttrs: jest.fn(() => []),
				};
			})
		);

		const obj = {
			newAttributes: {
				'test-general': 'em',
				'test-l': 'em',
			},
			attributes: {
				'text-xxl': 'vw',
				'test-general': undefined,
				'test-xl': 'px',
				'test-l': '%',
			},
			defaultAttributes: {
				'test-general': undefined,
				'test-xl': 'px',
				'text-l': '%',
			},
		};

		const result = cleanAttributes(obj);

		const expectedResult = {
			'test-general': 'em',
			'test-l': 'em',
		};

		expect(result).toStrictEqual(expectedResult);
	});

	it('Random test 7', () => {
		select.mockImplementation(
			jest.fn(() => {
				return {
					receiveBaseBreakpoint: jest.fn(() => 'xl'),
					getPrevSavedAttrs: jest.fn(() => []),
				};
			})
		);

		const obj = {
			newAttributes: {
				'test-general': 'em',
				'test-xl': 'em',
			},
			attributes: {
				'text-xxl': 'px',
				'test-general': undefined,
				'test-xl': 'px',
				'test-l': '%',
			},
			defaultAttributes: {
				'test-xxl': 'px',
				'test-general': undefined,
				'test-xl': 'px',
				'text-l': '%',
			},
		};

		const result = cleanAttributes(obj);

		const expectedResult = {
			'test-general': 'em',
			'test-xl': undefined,
		};

		expect(result).toStrictEqual(expectedResult);
	});

	it('Random test 8', () => {
		select.mockImplementation(
			jest.fn(() => {
				return {
					receiveBaseBreakpoint: jest.fn(() => 'xl'),
					getPrevSavedAttrs: jest.fn(() => []),
				};
			})
		);

		const obj = {
			newAttributes: {
				'test-general': '15',
				'test-xxl': '23',
			},
			attributes: {
				'test-general': '15',
				'test-xxl': '23',
			},
			defaultAttributes: {
				'test-general': '15',
				'test-xxl': '23',
			},
		};

		const result = cleanAttributes(obj);

		const expectedResult = {
			'test-general': '15',
			'test-xxl': '23',
		};

		expect(result).toStrictEqual(expectedResult);
	});

	it('Random test 9 (typical SC typography case)', () => {
		select.mockImplementation(
			jest.fn(() => {
				return {
					receiveBaseBreakpoint: jest.fn(() => 'xl'),
					getPrevSavedAttrs: jest.fn(() => [
						'test-general',
						'test-m',
						'test-xxl',
						'test-xl',
					]),
				};
			})
		);

		const obj = {
			newAttributes: {
				'test-general': 20,
				'test-m': 20,
				'test-xxl': 24,
				'test-xl': 16,
			},
			attributes: {
				'test-general': 20,
				'test-xxl': 24,
				'test-m': 2,
				'test-xl': undefined,
			},
			defaultAttributes: {
				'test-general': 16,
				'test-xxl': 24,
				'test-xl': 16,
			},
		};

		const result = cleanAttributes(obj);

		const expectedResult = {
			'test-general': 20,
			'test-xxl': 24,
			'test-xl': undefined,
			'test-m': undefined,
		};

		expect(result).toStrictEqual(expectedResult);
	});
});
