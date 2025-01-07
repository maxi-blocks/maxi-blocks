import getCustomFormatValue from '@extensions/text/formats/getCustomFormatValue';
import '@wordpress/rich-text';

jest.mock('@wordpress/blocks', () => {
	return {
		getActiveFormat: jest.fn(),
	};
});
jest.mock('src/components/block-inserter/index.js', () => jest.fn());
jest.mock('@extensions/styles/transitions/getTransitionData.js', () => jest.fn());
jest.mock('@extensions/attributes/getBlockData.js', () => jest.fn());
jest.mock('src/components/transform-control/utils.js', () => jest.fn());
jest.mock('src/extensions/DC/constants.js', () => ({}));

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
		const blockStyle = 'light';

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
