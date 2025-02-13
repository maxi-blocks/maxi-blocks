import getIconWithColor from '@extensions/styles/getIconWithColor';
import { setSVGContent, setSVGContentHover } from '@extensions/svg';
import getAttributeValue from '@extensions/styles/getAttributeValue';

jest.mock('@extensions/svg', () => ({
	setSVGContent: jest.fn(content => content),
	setSVGContentHover: jest.fn(content => content),
}));
jest.mock('@extensions/styles/getColorRGBAString', () =>
	jest.fn(() => 'rgba(0,0,0,1)')
);
jest.mock('@extensions/styles/getAttributeValue', () => jest.fn(() => '1'));

describe('getIconWithColor', () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	it('Handles basic icon with default stroke type', () => {
		const attributes = {
			'icon-content': '<svg>test</svg>',
			blockStyle: {},
		};

		const result = getIconWithColor(attributes);

		expect(setSVGContent).toHaveBeenCalledWith(
			'<svg>test</svg>',
			'rgba(0,0,0,1)',
			'stroke'
		);
		expect(result).toBe('<svg>test</svg>');
	});

	it('Respects icon-only flag', () => {
		const attributes = {
			'icon-content': '<svg>test</svg>',
			'icon-only': true,
			blockStyle: {},
		};

		getIconWithColor(attributes);

		expect(getAttributeValue).toHaveBeenCalledWith(
			expect.objectContaining({
				target: 'icon-stroke-palette-color',
			})
		);
	});

	it('Handles hover state', () => {
		const attributes = {
			'icon-content': '<svg>test</svg>',
			blockStyle: {},
		};

		const args = {
			isHover: true,
		};

		getIconWithColor(attributes, args);

		expect(setSVGContentHover).toHaveBeenCalled();
	});

	it('Handles multiple types (stroke and fill)', () => {
		const attributes = {
			'icon-content': '<svg>test</svg>',
			blockStyle: {},
		};

		const args = {
			type: ['stroke', 'fill'],
		};

		getIconWithColor(attributes, args);

		expect(setSVGContent).toHaveBeenCalledTimes(2);
		expect(setSVGContent).toHaveBeenCalledWith(
			'<svg>test</svg>',
			'rgba(0,0,0,1)',
			'stroke'
		);
		expect(setSVGContent).toHaveBeenCalledWith(
			'<svg>test</svg>',
			'rgba(0,0,0,1)',
			'fill'
		);
	});

	it('Uses raw icon from args if provided', () => {
		const attributes = {
			'icon-content': '<svg>original</svg>',
			blockStyle: {},
		};

		const args = {
			rawIcon: '<svg>raw</svg>',
		};

		getIconWithColor(attributes, args);

		expect(setSVGContent).toHaveBeenCalledWith(
			'<svg>raw</svg>',
			'rgba(0,0,0,1)',
			'stroke'
		);
	});

	it('Should use the button color if icon is inheriting color', () => {
		const attributes = {
			'icon-content': '<svg>test</svg>',
			blockStyle: {},
		};

		const args = {
			type: ['stroke'],
			isInherit: true,
		};

		const result = getIconWithColor(attributes, args);

		expect(getAttributeValue).toHaveBeenCalledWith(
			expect.objectContaining({
				target: 'palette-color',
			})
		);
		expect(result).toBe('<svg>test</svg>');
	});
});
