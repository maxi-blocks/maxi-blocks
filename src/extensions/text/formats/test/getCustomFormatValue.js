import getCustomFormatValue from '../getCustomFormatValue';

jest.mock('@wordpress/data', () => {
	return {
		select: jest.fn(() => {
			return {
				getSelectedBlockCount: jest.fn(() => 1),
			};
		}),
		registerStore: jest.fn(),
	};
});

jest.mock('@wordpress/rich-text', () => {
	return {
		getActiveFormat: jest.fn(() => {
			// return 'maxi-blocks/text-custom-hover';
			return false;
		}),
	};
});

jest.mock('@wordpress/blocks', () => {
	return {
		getActiveFormat: jest.fn(),
	};
});

describe('getCustomFormatValue', () => {
	it('Returns SC value', () => {
		const formatValue = {
			formats: [],
			replacements: [],
			text: '',
			start: 0,
			end: 0,
			activeFormats: [],
		};
		const typography = {
			'font-size-unit-xxl': 'px',
			'letter-spacing-unit-xxl': 'px',
			'font-size-unit-xl': 'px',
			'letter-spacing-unit-xl': 'px',
			'font-size-unit-l': 'px',
			'letter-spacing-unit-l': 'px',
			'font-size-unit-m': 'px',
			'letter-spacing-unit-m': 'px',
			'font-size-unit-s': 'px',
			'letter-spacing-unit-s': 'px',
			'font-size-unit-xs': 'px',
			'letter-spacing-unit-xs': 'px',
		};
		const styleCard = {
			light: {
				defaultStyleCard: {
					p: {},
				},
				styleCard: {
					p: {
						'font-size-xl': '16',
						'font-size-unit-xl': 'px',
					},
				},
			},
		};
		const prop = 'font-size';
		const breakpoint = 'xl';
		const textLevel = 'p';
		const blockStyle = 'maxi-light';

		const result = getCustomFormatValue({
			formatValue,
			typography,
			prop,
			breakpoint,
			textLevel,
			blockStyle,
			styleCard,
		});

		expect(result).toStrictEqual('16');
	});
});
