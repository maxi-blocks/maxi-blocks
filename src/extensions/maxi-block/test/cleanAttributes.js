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
			'test-status-general': true,
			'test-general': 4,
			'test-opacity-general': 1,
		};
		const attributes = {
			'test-status-general': true,
			'test-general': 4,

			'test-status-m': true,
			'test-opacity-m': 1,
			'test-m': 8,
			'test-opacity-general': 1,
		};

		const result = cleanAttributes({
			newAttributes: obj,
			attributes,
		});

		const expectedResult = {
			'test-status-general': true,
			'test-general': 4,
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
		const newAttributes = {
			'test-status-general': true,
			'test-general': 7,
			'test-m': 7,
		};
		const attributes = {
			'test-status-general': true,
			'test-general': 4,

			'test-m': 8,
		};
		const defaultAttributes = {
			'test-status-general': true,
			'test-general': 4,

			'test-m': 8,
		};

		const result = cleanAttributes({
			newAttributes,
			attributes,
			defaultAttributes,
		});

		const expectedResult = {
			'test-general': 7,
			'test-m': undefined,
			'test-status-general': true,
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
				'border-color-l': undefined,
				'border-palette-color-l': undefined,
				'border-palette-opacity-l': 1,
				'border-palette-status-l': undefined,
			},
			attributes: {
				'border-palette-color-general': 2,
				'border-palette-color-l': 4,
				'border-palette-color-m': 2,
			},
			defaultAttributes: {
				'border-palette-color-general': 2,
			},
		};

		const expectedResult = {
			'border-color-l': undefined,
			'border-palette-color-l': undefined,
			'border-palette-color-m': undefined,
			'border-palette-opacity-l': 1,
			'border-palette-status-l': undefined,
		};

		const result = cleanAttributes(obj);

		expect(expectedResult).toStrictEqual(result);
	});
});
