import getIconWithColor from '@extensions/styles/getIconWithColor';
import { setSVGColor } from '@extensions/svg';
import getAttributeValue from '@extensions/styles/getAttributeValue';

jest.mock('@extensions/svg', () => ({
	setSVGColor: jest.fn(({ svg }) => svg),
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

		expect(setSVGColor).toHaveBeenCalledWith({
			svg: '<svg>test</svg>',
			color: 'rgba(0,0,0,1)',
			type: 'stroke',
		});
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

		expect(setSVGColor).toHaveBeenCalled();
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

		expect(setSVGColor).toHaveBeenCalledTimes(2);
		expect(setSVGColor).toHaveBeenCalledWith({
			svg: '<svg>test</svg>',
			color: 'rgba(0,0,0,1)',
			type: 'stroke',
		});
		expect(setSVGColor).toHaveBeenCalledWith({
			svg: '<svg>test</svg>',
			color: 'rgba(0,0,0,1)',
			type: 'fill',
		});
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

		expect(setSVGColor).toHaveBeenCalledWith({
			svg: '<svg>raw</svg>',
			color: 'rgba(0,0,0,1)',
			type: 'stroke',
		});
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
