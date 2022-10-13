import cleanAttributes from '../cleanAttributes';

jest.mock('src/extensions/styles/getDefaultAttribute.js', () =>
	jest.fn(() => undefined)
);
jest.mock('@wordpress/data', () => {
	return {
		select: jest.fn(() => {
			return {
				receiveBaseBreakpoint: jest.fn(() => 'm'),
			};
		}),
		createReduxStore: jest.fn(),
		register: jest.fn(),
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

		const result = cleanAttributes({ newAttributes, attributes });
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
			'background-palette-status-m': true,
			'background-palette-color-m': 4,
		};
		const attributes = {
			type: 'color',
			isHover: false,
			'display-general': 'block',
			'background-palette-status-general': true,
			'background-palette-color-general': 4,
			'background-color-clip-path-status-general': false,
			'background-color-wrapper-position-sync-general': 'all',
			'background-color-wrapper-position-top-unit-general': 'px',
			'background-color-wrapper-position-right-unit-general': 'px',
			'background-color-wrapper-position-bottom-unit-general': 'px',
			'background-color-wrapper-position-left-unit-general': 'px',
			'background-color-wrapper-size-general': 100,
			'background-color-wrapper-size-unit-general': '%',
			order: 1,
			id: 1,
			'background-palette-color-m': 7,
			'background-palette-status-m': true,
		};
		const defaultAttributes = {
			type: 'color',
			isHover: false,
			'display-general': 'block',
			'background-palette-status-general': true,
			'background-palette-color-general': 4,
			'background-color-clip-path-status-general': false,
			'background-color-wrapper-position-sync-general': 'all',
			'background-color-wrapper-position-top-unit-general': 'px',
			'background-color-wrapper-position-right-unit-general': 'px',
			'background-color-wrapper-position-bottom-unit-general': 'px',
			'background-color-wrapper-position-left-unit-general': 'px',
			'background-color-wrapper-size-general': 100,
			'background-color-wrapper-size-unit-general': '%',
			order: 1,
			id: 1,
		};

		const result = cleanAttributes({
			newAttributes,
			attributes,
			defaultAttributes,
		});
		const expectedResult = {
			'background-palette-status-m': undefined,
			'background-palette-color-m': undefined,
		};

		expect(result).toStrictEqual(expectedResult);
	});

	it('On changing general attribute, if coincide with winBreakpoint, it should overwrite it', () => {
		const obj = {
			'background-palette-status-general': true,
			'background-palette-color-general': 4,
			'background-palette-opacity-general': 1,
		};
		const attributes = {
			type: 'color',
			isHover: false,
			'display-general': 'block',
			'background-palette-status-general': true,
			'background-palette-color-general': 4,
			'background-color-clip-path-status-general': false,
			'background-color-wrapper-position-sync-general': 'all',
			'background-color-wrapper-position-top-unit-general': 'px',
			'background-color-wrapper-position-right-unit-general': 'px',
			'background-color-wrapper-position-bottom-unit-general': 'px',
			'background-color-wrapper-position-left-unit-general': 'px',
			'background-color-wrapper-size-general': 100,
			'background-color-wrapper-size-unit-general': '%',
			order: 1,
			id: 1,
			'background-palette-status-m': true,
			'background-palette-opacity-m': 1,
			'background-palette-color-m': 8,
			'background-palette-opacity-general': 1,
		};

		const result = cleanAttributes({
			newAttributes: obj,
			attributes,
		});

		const expectedResult = {
			'background-palette-status-general': true,
			'background-palette-color-general': 4,
			'background-palette-opacity-general': 1,
			'background-palette-status-m': undefined,
			'background-palette-color-m': undefined,
			'background-palette-opacity-m': undefined,
		};

		expect(result).toStrictEqual(expectedResult);
	});

	it('On changing general attribute, if there is a smaller breakpoint with same value, it should be returned to its default', () => {
		const obj = {
			'background-palette-color-general': 8,
		};
		const attributes = {
			type: 'color',
			isHover: false,
			'display-general': 'block',
			'background-palette-status-general': true,
			'background-palette-color-general': 5,
			'background-color-clip-path-status-general': false,
			'background-color-wrapper-position-sync-general': 'all',
			'background-color-wrapper-position-top-unit-general': 'px',
			'background-color-wrapper-position-right-unit-general': 'px',
			'background-color-wrapper-position-bottom-unit-general': 'px',
			'background-color-wrapper-position-left-unit-general': 'px',
			'background-color-wrapper-size-general': 100,
			'background-color-wrapper-size-unit-general': '%',
			order: 1,
			id: 1,
			'background-palette-color-m': 8,
		};
		const defaultAttributes = {
			type: 'color',
			isHover: false,
			'display-general': 'block',
			'background-palette-status-general': true,
			'background-palette-color-general': 5,
			'background-color-clip-path-status-general': false,
			'background-color-wrapper-position-sync-general': 'all',
			'background-color-wrapper-position-top-unit-general': 'px',
			'background-color-wrapper-position-right-unit-general': 'px',
			'background-color-wrapper-position-bottom-unit-general': 'px',
			'background-color-wrapper-position-left-unit-general': 'px',
			'background-color-wrapper-size-general': 100,
			'background-color-wrapper-size-unit-general': '%',
			order: 1,
			id: 1,
			'background-palette-color-m': 8,
		};

		const result = cleanAttributes({
			newAttributes: obj,
			attributes,
			defaultAttributes,
		});

		const expectedResult = {
			'background-palette-color-general': 8,
			'background-palette-color-m': undefined,
		};

		expect(result).toStrictEqual(expectedResult);
	});

	it('On changing general attribute, if there is a smaller breakpoint with same value, it should be returned to its default - 2', () => {
		const newAttributes = {
			'background-palette-status-general': true,
			'background-palette-color-general': 7,
			'background-palette-color-m': 7,
		};
		const attributes = {
			type: 'color',
			isHover: false,
			'display-general': 'block',
			'background-palette-status-general': true,
			'background-palette-color-general': 4,
			'background-color-clip-path-status-general': false,
			'background-color-wrapper-position-sync-general': 'all',
			'background-color-wrapper-position-top-unit-general': 'px',
			'background-color-wrapper-position-right-unit-general': 'px',
			'background-color-wrapper-position-bottom-unit-general': 'px',
			'background-color-wrapper-position-left-unit-general': 'px',
			'background-color-wrapper-size-general': 100,
			'background-color-wrapper-size-unit-general': '%',
			order: 1,
			id: 1,
			'background-palette-color-m': 8,
		};
		const defaultAttributes = {
			type: 'color',
			isHover: false,
			'display-general': 'block',
			'background-palette-status-general': true,
			'background-palette-color-general': 4,
			'background-color-clip-path-status-general': false,
			'background-color-wrapper-position-sync-general': 'all',
			'background-color-wrapper-position-top-unit-general': 'px',
			'background-color-wrapper-position-right-unit-general': 'px',
			'background-color-wrapper-position-bottom-unit-general': 'px',
			'background-color-wrapper-position-left-unit-general': 'px',
			'background-color-wrapper-size-general': 100,
			'background-color-wrapper-size-unit-general': '%',
			order: 1,
			id: 1,
			'background-palette-color-m': 8,
		};

		const result = cleanAttributes({
			newAttributes,
			attributes,
			defaultAttributes,
		});

		const expectedResult = {
			'background-palette-color-general': 7,
			'background-palette-color-m': undefined,
			'background-palette-status-general': true,
		};

		expect(result).toStrictEqual(expectedResult);
	});

	it('On changing S attribute to the same than XS, having different attributes for general and XS, XS should disappear', () => {
		const newAttributes = {
			'background-palette-status-s': true,
			'background-palette-color-s': 8,
			'background-palette-opacity-s': 1,
		};
		const attributes = {
			type: 'color',
			isHover: false,
			'display-general': 'block',
			'background-palette-status-general': true,
			'background-palette-color-general': 4,
			'background-color-clip-path-status-general': false,
			'background-color-wrapper-position-sync-general': 'all',
			'background-color-wrapper-position-top-unit-general': 'px',
			'background-color-wrapper-position-right-unit-general': 'px',
			'background-color-wrapper-position-bottom-unit-general': 'px',
			'background-color-wrapper-position-left-unit-general': 'px',
			'background-color-wrapper-size-general': 100,
			'background-color-wrapper-size-unit-general': '%',
			order: 1,
			id: 1,
			'background-palette-opacity-m': 1,
			'background-palette-status-xs': true,
			'background-palette-color-xs': 8,
		};
		const defaultAttributes = {
			type: 'color',
			isHover: false,
			'display-general': 'block',
			'background-palette-status-general': true,
			'background-palette-color-general': 4,
			'background-color-clip-path-status-general': false,
			'background-color-wrapper-position-sync-general': 'all',
			'background-color-wrapper-position-top-unit-general': 'px',
			'background-color-wrapper-position-right-unit-general': 'px',
			'background-color-wrapper-position-bottom-unit-general': 'px',
			'background-color-wrapper-position-left-unit-general': 'px',
			'background-color-wrapper-size-general': 100,
			'background-color-wrapper-size-unit-general': '%',
			order: 1,
			id: 1,
			'background-palette-opacity-m': 1,
			'background-palette-status-xs': true,
			'background-palette-color-xs': 8,
		};

		const result = cleanAttributes({
			newAttributes,
			attributes,
			defaultAttributes,
		});

		const expectedResult = {
			'background-palette-color-s': 8,
			'background-palette-color-xs': undefined,
			'background-palette-opacity-s': undefined,
			'background-palette-status-s': true,
			'background-palette-status-xs': undefined,
		};

		expect(result).toStrictEqual(expectedResult);
	});
});
