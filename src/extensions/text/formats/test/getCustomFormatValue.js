import getCustomFormatValue from '../getCustomFormatValue';
import '@wordpress/rich-text';

jest.mock('@wordpress/blocks', () => {
	return {
		getActiveFormat: jest.fn(),
	};
});
jest.mock('../../../attributes/transitions/getTransitionData.js', () =>
	jest.fn()
);
jest.mock('../../../attributes/getBlockData.js', () => jest.fn());

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
			'_fs.u-xxl': 'px',
			'_ls.u-xxl': 'px',
			'_fs.u-xl': 'px',
			'_ls.u-xl': 'px',
			'_fs.u-l': 'px',
			'_ls.u-l': 'px',
			'_fs.u-m': 'px',
			'_ls.u-m': 'px',
			'_fs.u-s': 'px',
			'_ls.u-s': 'px',
			'_fs.u-xs': 'px',
			'_ls.u-xs': 'px',
		};
		const styleCard = {
			light: {
				defaultStyleCard: {
					p: {},
				},
				styleCard: {
					p: {
						'_fs-xl': '16',
						'_fs-unit-xl': 'px',
					},
				},
			},
		};
		const prop = '_fs';
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
