import getCustomFormatValue from '../getCustomFormatValue';
import '@wordpress/block-editor';

jest.mock('../../../style-cards/getActiveStyleCard', () => {
	return jest.fn(() => {
		return {
			value: {
				styleCard: {
					light: {},
					dark: {},
				},
				styleCardDefaults: {
					dark: {},
					light: {
						'p-font-size-general': '16px',
					},
				},
			},
		};
	});
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
			'font-size-unit-general': 'px',
			'letter-spacing-unit-general': 'px',
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
		const prop = 'font-size';
		const breakpoint = 'general';
		const textLevel = 'p';
		const blockStyle = 'maxi-light';

		const result = getCustomFormatValue({
			formatValue,
			typography,
			prop,
			breakpoint,
			textLevel,
			blockStyle,
		});

		expect(result).toStrictEqual(16);
	});
});
