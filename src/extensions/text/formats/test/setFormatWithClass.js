/* eslint-disable no-sparse-arrays */
/**
 * Internal dependencies
 */
import setFormatWithClass, {
	checkFormatCoincidence,
	getFormatClassName,
} from '../setFormatWithClass';
import '@wordpress/data';
import '../../../style-cards';

/**
 * Mocks
 */
jest.mock('../../../attributes/getBlockStyle', () => {
	return jest.fn(() => {
		return 'light';
	});
});
jest.mock('../../../attributes/getBlockData.js', () => jest.fn());

const styleCard = {
	name: 'Maxi (Default)',
	status: 'active',
	dark: {
		styleCard: {},
		defaultStyleCard: {
			color: {
				global: false,
				1: '#081219',
				2: '#062739',
				3: '#9b9b9b',
				4: '#ff4a17',
				5: '#ffffff',
				6: '#c9340a',
				7: '#f5f5f5',
				color: '',
			},
			p: {
				'_col.g': false,
				color: '',
				'font-family-g': 'Roboto',
				'font-size-xxl': 18,
				'font-size-unit-xxl': 'px',
				'font-size-xl': 16,
				'font-size-unit-xl': 'px',
				'line-height-xxl': 1.5,
				'_fwe-g': '400',
				'text-transform-g': 'none',
				'_fst-g': 'normal',
				'letter-spacing-xxl': 0,
				'letter-spacing-unit-xxl': 'px',
				'letter-spacing-xl': 0,
				'letter-spacing-unit-xl': 'px',
				'_td-g': 'unset',
			},
			h1: {
				'_col.g': false,
				color: '',
				'font-family-g': 'Roboto',
				'font-size-xxl': 50,
				'font-size-unit-xxl': 'px',
				'font-size-xl': 45,
				'font-size-unit-xl': 'px',
				'font-size-l': 40,
				'font-size-unit-l': 'px',
				'font-size-m': 36,
				'font-size-unit-m': 'px',
				'font-size-s': 34,
				'font-size-unit-s': 'px',
				'font-size-xs': 32,
				'font-size-unit-xs': 'px',
				'line-height-xxl': 1.18,
				'line-height-xl': 1.1,
				'line-height-l': 1.22,
				'line-height-m': 1.27,
				'_fwe-g': '500',
				'text-transform-g': 'none',
				'_fst-g': 'normal',
				'letter-spacing-xxl': 0,
				'letter-spacing-unit-xxl': 'px',
				'letter-spacing-xl': 0,
				'letter-spacing-unit-xl': 'px',
				'_td-g': 'unset',
			},
			h2: {
				'_col.g': false,
				color: '',
				'font-family-g': 'Roboto',
				'font-size-xxl': 44,
				'font-size-unit-xxl': 'px',
				'font-size-xl': 38,
				'font-size-unit-xl': 'px',
				'font-size-l': 36,
				'font-size-unit-l': 'px',
				'font-size-m': 32,
				'font-size-unit-m': 'px',
				'font-size-s': 30,
				'font-size-unit-s': 'px',
				'font-size-xs': 28,
				'font-size-unit-xs': 'px',
				'line-height-xxl': 1.21,
				'line-height-xl': 1.05,
				'line-height-l': 1.26,
				'line-height-m': 1.33,
				'_fwe-g': '500',
				'text-transform-g': 'none',
				'_fst-g': 'normal',
				'letter-spacing-xxl': 0,
				'letter-spacing-unit-xxl': 'px',
				'letter-spacing-xl': 0,
				'letter-spacing-unit-xl': 'px',
				'_td-g': 'unset',
			},
			h3: {
				'_col.g': false,
				color: '',
				'font-family-g': 'Roboto',
				'font-size-xxl': 34,
				'font-size-unit-xxl': 'px',
				'font-size-xl': 30,
				'font-size-unit-xl': 'px',
				'font-size-m': 26,
				'font-size-unit-m': 'px',
				'font-size-s': 24,
				'font-size-unit-s': 'px',
				'line-height-xxl': 1.25,
				'line-height-xl': 1.3,
				'line-height-l': 1.23,
				'line-height-m': 1.16,
				'_fwe-g': '500',
				'text-transform-g': 'none',
				'_fst-g': 'normal',
				'letter-spacing-xxl': 0,
				'letter-spacing-unit-xxl': 'px',
				'letter-spacing-xl': 0,
				'letter-spacing-unit-xl': 'px',
				'_td-g': 'unset',
			},
			h4: {
				'_col.g': false,
				color: '',
				'font-family-g': 'Roboto',
				'font-size-xxl': 30,
				'font-size-unit-xxl': 'px',
				'font-size-xl': 26,
				'font-size-unit-xl': 'px',
				'font-size-l': 24,
				'font-size-unit-l': 'px',
				'font-size-s': 22,
				'font-size-unit-s': 'px',
				'line-height-xxl': 1.33,
				'line-height-xl': 1.24,
				'line-height-l': 1.38,
				'line-height-m': 1.42,
				'_fwe-g': '500',
				'text-transform-g': 'none',
				'_fst-g': 'normal',
				'letter-spacing-xxl': 0,
				'letter-spacing-unit-xxl': 'px',
				'letter-spacing-xl': 0,
				'letter-spacing-unit-xl': 'px',
				'_td-g': 'unset',
			},
			h5: {
				'_col.g': false,
				color: '',
				'font-family-g': 'Roboto',
				'font-size-xxl': 26,
				'font-size-unit-xxl': 'px',
				'font-size-xl': 22,
				'font-size-unit-xl': 'px',
				'font-size-m': 20,
				'font-size-unit-m': 'px',
				'line-height-xxl': 1.36,
				'line-height-xl': 1.26,
				'line-height-l': 1.45,
				'line-height-m': 1.5,
				'_fwe-g': '500',
				'text-transform-g': 'none',
				'_fst-g': 'normal',
				'letter-spacing-xxl': 0,
				'letter-spacing-unit-xxl': 'px',
				'letter-spacing-xl': 0,
				'letter-spacing-unit-xl': 'px',
				'_td-g': 'unset',
			},
			h6: {
				'_col.g': false,
				color: '',
				'font-family-g': 'Roboto',
				'font-size-xxl': 24,
				'font-size-unit-xxl': 'px',
				'font-size-xl': 20,
				'font-size-unit-xl': 'px',
				'font-size-m': 18,
				'font-size-unit-m': 'px',
				'line-height-xxl': 1.39,
				'line-height-xl': 1.29,
				'line-height-l': 1.5,
				'line-height-m': 1.56,
				'_fwe-g': '500',
				'text-transform-g': 'none',
				'_fst-g': 'normal',
				'letter-spacing-xxl': 0,
				'letter-spacing-unit-xxl': 'px',
				'letter-spacing-xl': 0,
				'letter-spacing-unit-xl': 'px',
				'_td-g': 'unset',
			},
			button: {
				'_col.g': false,
				color: '',
				'h_col.g': false,
				'hover-color': '',
				'font-family-g': 'Roboto',
				'font-size-xxl': 22,
				'font-size-unit-xxl': 'px',
				'font-size-xl': 18,
				'font-size-unit-xl': 'px',
				'font-size-l': 16,
				'font-size-unit-l': 'px',
				'line-height-xxl': 1.5,
				'line-height-xl': 1.625,
				'letter-spacing-xxl': 0,
				'letter-spacing-unit-xxl': 'px',
				'letter-spacing-xl': 0,
				'letter-spacing-unit-xl': 'px',
				'_fwe-g': '400',
				'text-transform-g': 'none',
				'_fst-g': 'normal',
				'_td-g': 'unset',
				'bc.g': false,
				bc_cc: '',
				'h-bc.g': false,
				'hover-background-color-hover': '',
			},
			icon: {
				'li_col.g': false,
				line: '',
				'f_col.g': false,
				fill: '',
			},
			divider: {
				'_col.g': false,
				color: '',
			},
		},
	},
	light: {
		styleCard: {},
		defaultStyleCard: {
			color: {
				1: '#ffffff',
				2: '#f2f9fd',
				3: '#9b9b9b',
				4: '#ff4a17',
				5: '#000000',
				6: '#c9340a',
				7: '#081219',
			},
			p: {
				'_col.g': false,
				color: '',
				'font-family-g': 'Roboto',
				'font-size-xxl': 18,
				'font-size-unit-xxl': 'px',
				'font-size-xl': 16,
				'font-size-unit-xl': 'px',
				'line-height-xxl': 1.5,
				'line-height-xl': 1.625,
				'_fwe-g': '400',
				'text-transform-g': 'none',
				'_fst-g': 'normal',
				'letter-spacing-xxl': 0,
				'letter-spacing-unit-xxl': 'px',
				'letter-spacing-xl': 0,
				'letter-spacing-unit-xl': 'px',
				'_td-g': 'unset',
			},
			h1: {
				'_col.g': false,
				color: '',
				'font-family-g': 'Roboto',
				'font-size-xxl': 50,
				'font-size-unit-xxl': 'px',
				'font-size-xl': 45,
				'font-size-unit-xl': 'px',
				'font-size-l': 40,
				'font-size-unit-l': 'px',
				'font-size-m': 36,
				'font-size-unit-m': 'px',
				'font-size-s': 34,
				'font-size-unit-s': 'px',
				'font-size-xs': 32,
				'font-size-unit-xs': 'px',
				'line-height-xxl': 1.18,
				'line-height-xl': 1.1,
				'line-height-l': 1.22,
				'line-height-m': 1.27,
				'_fwe-g': '500',
				'text-transform-g': 'none',
				'_fst-g': 'normal',
				'letter-spacing-xxl': 0,
				'letter-spacing-unit-xxl': 'px',
				'letter-spacing-xl': 0,
				'letter-spacing-unit-xl': 'px',
				'_td-g': 'unset',
			},
			h2: {
				'_col.g': false,
				color: '',
				'font-family-g': 'Roboto',
				'font-size-xxl': 44,
				'font-size-unit-xxl': 'px',
				'font-size-xl': 38,
				'font-size-unit-xl': 'px',
				'font-size-l': 36,
				'font-size-unit-l': 'px',
				'font-size-m': 32,
				'font-size-unit-m': 'px',
				'font-size-s': 30,
				'font-size-unit-s': 'px',
				'font-size-xs': 28,
				'font-size-unit-xs': 'px',
				'line-height-xxl': 1.21,
				'line-height-xl': 1.05,
				'line-height-l': 1.26,
				'line-height-m': 1.33,
				'_fwe-g': '500',
				'text-transform-g': 'none',
				'_fst-g': 'normal',
				'letter-spacing-xxl': 0,
				'letter-spacing-unit-xxl': 'px',
				'letter-spacing-xl': 0,
				'letter-spacing-unit-xl': 'px',
				'_td-g': 'unset',
			},
			h3: {
				'_col.g': false,
				color: '',
				'font-family-g': 'Roboto',
				'font-size-xxl': 34,
				'font-size-unit-xxl': 'px',
				'font-size-xl': 30,
				'font-size-unit-xl': 'px',
				'font-size-l': 30,
				'font-size-unit-l': 'px',
				'font-size-m': 26,
				'font-size-unit-m': 'px',
				'font-size-s': 24,
				'font-size-unit-s': 'px',
				'line-height-xxl': 1.25,
				'line-height-xl': 1.3,
				'line-height-l': 1.23,
				'line-height-m': 1.16,
				'_fwe-g': '500',
				'text-transform-g': 'none',
				'_fst-g': 'normal',
				'letter-spacing-xxl': 0,
				'letter-spacing-unit-xxl': 'px',
				'letter-spacing-xl': 0,
				'letter-spacing-unit-xl': 'px',
				'_td-g': 'unset',
			},
			h4: {
				'_col.g': false,
				color: '',

				'font-family-g': 'Roboto',
				'font-size-xxl': 30,
				'font-size-unit-xxl': 'px',
				'font-size-xl': 26,
				'font-size-unit-xl': 'px',
				'font-size-l': 24,
				'font-size-unit-l': 'px',
				'font-size-s': 22,
				'font-size-unit-s': 'px',
				'line-height-xxl': 1.33,
				'line-height-xl': 1.24,
				'line-height-l': 1.38,
				'line-height-m': 1.42,
				'_fwe-g': '500',
				'text-transform-g': 'none',
				'_fst-g': 'normal',
				'letter-spacing-xxl': 0,
				'letter-spacing-unit-xxl': 'px',
				'letter-spacing-xl': 0,
				'letter-spacing-unit-xl': 'px',
				'_td-g': 'unset',
			},
			h5: {
				'_col.g': false,
				color: '',
				'font-family-g': 'Roboto',
				'font-size-xxl': 28,
				'font-size-unit-xxl': 'px',
				'font-size-xl': 22,
				'font-size-unit-xl': 'px',
				'font-size-m': 20,
				'font-size-unit-m': 'px',
				'line-height-xxl': 1.36,
				'line-height-xl': 1.26,
				'line-height-l': 1.45,
				'line-height-m': 1.5,
				'_fwe-g': '500',
				'text-transform-g': 'none',
				'_fst-g': 'normal',
				'letter-spacing-xxl': 0,
				'letter-spacing-unit-xxl': 'px',
				'letter-spacing-xl': 0,
				'letter-spacing-unit-xl': 'px',
				'_td-g': 'unset',
			},
			h6: {
				'_col.g': false,
				color: '',
				'font-family-g': 'Roboto',
				'font-size-xxl': 24,
				'font-size-unit-xxl': 'px',
				'font-size-xl': 20,
				'font-size-unit-xl': 'px',
				'font-size-m': 18,
				'font-size-unit-m': 'px',
				'line-height-xxl': 1.39,
				'line-height-xl': 1.29,
				'line-height-l': 1.5,
				'line-height-m': 1.56,
				'_fwe-g': '500',
				'text-transform-g': 'none',
				'_fst-g': 'normal',
				'letter-spacing-xxl': 0,
				'letter-spacing-unit-xxl': 'px',
				'letter-spacing-xl': 0,
				'letter-spacing-unit-xl': 'px',
				'_td-g': 'unset',
			},
			button: {
				'_col.g': false,
				color: '',
				'h_col.g': false,
				'hover-color': '',
				'font-family-g': 'Roboto',
				'font-size-xxl': 22,
				'font-size-unit-xxl': 'px',
				'font-size-xl': 18,
				'font-size-unit-xl': 'px',
				'font-size-l': 16,
				'font-size-unit-l': 'px',
				'line-height-xxl': 1.5,
				'line-height-xl': 1.625,
				'_fwe-g': '400',
				'text-transform-g': 'none',
				'_fst-g': 'normal',
				'letter-spacing-xxl': 0,
				'letter-spacing-unit-xxl': 'px',
				'letter-spacing-xl': 0,
				'letter-spacing-unit-xl': 'px',
				'_td-g': 'unset',
				'bc.g': false,
				bc_cc: '',
				'h-bc.g': false,
				'hover-background-color-hover': '',
			},
			icon: {
				'li_col.g': false,
				line: '',
				'f_col.g': false,
				fill: '',
			},
			divider: {
				'_col.g': false,
				color: '',
			},
		},
	},
};

describe('setFormatWithClass', () => {
	it('Add simple custom format', () => {
		const formatValue = {
			formats: [, , , , , , , , , , , , , , , , ,],
			text: 'Testing Text Maxi',
			start: 13,
			end: 17,
			activeFormats: [],
		};
		const typography = {};
		const value = {
			_fwe: '800',
		};
		const isList = false;
		const textLevel = 'p';

		const result = setFormatWithClass({
			formatValue,
			typography,
			value,
			isList,
			textLevel,
			styleCard,
		});
		const expectedResult = {
			_cf: {
				'maxi-text-block__custom-format--0': {
					'_fwe-g': '800',
				},
			},
			content:
				'Testing Text <span class="maxi-text-block--has-custom-format maxi-text-block__custom-format--0">Maxi</span>',
		};

		expect(result).toStrictEqual(expectedResult);
	});
	it('Remove simple custom format', () => {
		const formatValue = {
			formats: [
				,
				,
				,
				,
				,
				,
				,
				,
				,
				,
				,
				,
				,
				[
					{
						type: 'maxi-blocks/text-custom',
						attributes: {
							className: 'maxi-text-block__custom-format--0',
						},
						unregisteredAttributes: {},
					},
				],
				[
					{
						type: 'maxi-blocks/text-custom',
						attributes: {
							className: 'maxi-text-block__custom-format--0',
						},
						unregisteredAttributes: {},
					},
				],
				[
					{
						type: 'maxi-blocks/text-custom',
						attributes: {
							className: 'maxi-text-block__custom-format--0',
						},
						unregisteredAttributes: {},
					},
				],
				[
					{
						type: 'maxi-blocks/text-custom',
						attributes: {
							className: 'maxi-text-block__custom-format--0',
						},
						unregisteredAttributes: {},
					},
				],
			],
			text: 'Testing Text Maxi',
			start: 13,
			end: 17,
		};
		const typography = {
			_cf: {
				'maxi-text-block__custom-format--0': {
					'_fwe-g': '800',
				},
			},
		};
		const value = {
			_fwe: '400',
		};
		const isList = false;
		const textLevel = 'p';

		const result = setFormatWithClass({
			formatValue,
			typography,
			value,
			isList,
			textLevel,
			styleCard,
		});
		const expectedResult = {
			_cf: {},
			content: 'Testing Text Maxi',
		};

		expect(JSON.stringify(result)).toStrictEqual(
			JSON.stringify(expectedResult)
		);
	});
	it('Add second simple custom format on the content', () => {
		const formatValue = {
			formats: [
				,
				,
				,
				,
				,
				,
				,
				,
				,
				,
				,
				,
				,
				,
				,
				[
					{
						type: 'maxi-blocks/text-custom',
						attributes: {
							className: 'maxi-text-block__custom-format--0',
						},
						unregisteredAttributes: {},
					},
				],
				[
					{
						type: 'maxi-blocks/text-custom',
						attributes: {
							className: 'maxi-text-block__custom-format--0',
						},
						unregisteredAttributes: {},
					},
				],
			],
			text: 'Testing Text Maxi',
			start: 13,
			end: 15,
			activeFormats: [],
		};
		const typography = {
			_cf: {
				'maxi-text-block__custom-format--0': {
					'_fst-g': 'italic',
				},
			},
		};
		const value = {
			_fwe: '800',
		};
		const isList = false;
		const textLevel = 'p';

		const result = setFormatWithClass({
			formatValue,
			typography,
			value,
			isList,
			textLevel,
			styleCard,
		});

		const expectedResult = {
			_cf: {
				'maxi-text-block__custom-format--0': {
					'_fst-g': 'italic',
				},
				'maxi-text-block__custom-format--1': {
					'_fwe-g': '800',
				},
			},
			content:
				'Testing Text <span class="maxi-text-block--has-custom-format maxi-text-block__custom-format--1">Ma</span><span class="maxi-text-block--has-custom-format maxi-text-block__custom-format--0">xi</span>',
		};

		expect(JSON.stringify(result)).toStrictEqual(
			JSON.stringify(expectedResult)
		);
	});
	it('Remove second simple custom format on the content', () => {
		const formatValue = {
			formats: [
				,
				,
				,
				,
				,
				,
				,
				,
				,
				,
				,
				,
				,
				[
					{
						type: 'maxi-blocks/text-custom',
						attributes: {
							className: 'maxi-text-block__custom-format--1',
						},
						unregisteredAttributes: {},
					},
				],
				[
					{
						type: 'maxi-blocks/text-custom',
						attributes: {
							className: 'maxi-text-block__custom-format--1',
						},
						unregisteredAttributes: {},
					},
				],
				[
					{
						type: 'maxi-blocks/text-custom',
						attributes: {
							className: 'maxi-text-block__custom-format--0',
						},
						unregisteredAttributes: {},
					},
				],
				[
					{
						type: 'maxi-blocks/text-custom',
						attributes: {
							className: 'maxi-text-block__custom-format--0',
						},
						unregisteredAttributes: {},
					},
				],
			],
			text: 'Testing Text Maxi',
			start: 13,
			end: 15,
		};
		const typography = {
			_cf: {
				'maxi-text-block__custom-format--0': {
					'_fst-g': 'italic',
				},
				'maxi-text-block__custom-format--1': {
					'_fwe-g': '800',
				},
			},
		};
		const value = {
			_fwe: '400',
		};
		const isList = false;
		const textLevel = 'p';

		const result = setFormatWithClass({
			formatValue,
			typography,
			value,
			isList,
			textLevel,
			styleCard,
		});

		const expectedResult = {
			_cf: {
				'maxi-text-block__custom-format--0': {
					'_fst-g': 'italic',
				},
			},
			content:
				'Testing Text Ma<span class="maxi-text-block--has-custom-format maxi-text-block__custom-format--0">x</span><span class="maxi-text-block--has-custom-format maxi-text-block__custom-format--0">i</span>',
		};

		expect(JSON.stringify(result)).toStrictEqual(
			JSON.stringify(expectedResult)
		);
	});
	it('Add second simple custom format over other simple custom format', () => {
		const formatValue = {
			formats: [
				,
				,
				,
				,
				,
				,
				,
				,
				,
				,
				,
				,
				,
				[
					{
						type: 'maxi-blocks/text-custom',
						attributes: {
							className: 'maxi-text-block__custom-format--0',
						},
						unregisteredAttributes: {},
					},
				],
				[
					{
						type: 'maxi-blocks/text-custom',
						attributes: {
							className: 'maxi-text-block__custom-format--0',
						},
						unregisteredAttributes: {},
					},
				],
				[
					{
						type: 'maxi-blocks/text-custom',
						attributes: {
							className: 'maxi-text-block__custom-format--0',
						},
						unregisteredAttributes: {},
					},
				],
				[
					{
						type: 'maxi-blocks/text-custom',
						attributes: {
							className: 'maxi-text-block__custom-format--0',
						},
						unregisteredAttributes: {},
					},
				],
			],
			text: 'Testing Text Maxi',
			start: 13,
			end: 17,
		};
		const typography = {
			_cf: {
				'maxi-text-block__custom-format--0': {
					'_fwe-g': '800',
				},
			},
		};
		const value = {
			_fst: 'italic',
		};
		const isList = false;
		const textLevel = 'p';

		const result = setFormatWithClass({
			formatValue,
			typography,
			value,
			isList,
			textLevel,
			styleCard,
		});

		const expectedResult = {
			_cf: {
				'maxi-text-block__custom-format--0': {
					'_fwe-g': '800',
					'_fst-g': 'italic',
				},
			},
			content:
				'Testing Text <span class="maxi-text-block--has-custom-format maxi-text-block__custom-format--0">Maxi</span>',
		};

		expect(JSON.stringify(result)).toStrictEqual(
			JSON.stringify(expectedResult)
		);
	});
	it('Remove second simple custom format over other simple custom format', () => {
		const formatValue = {
			formats: [
				,
				,
				,
				,
				,
				,
				,
				,
				,
				,
				,
				,
				,
				[
					{
						type: 'maxi-blocks/text-custom',
						attributes: {
							className: 'maxi-text-block__custom-format--0',
						},
						unregisteredAttributes: {},
					},
				],
				[
					{
						type: 'maxi-blocks/text-custom',
						attributes: {
							className: 'maxi-text-block__custom-format--0',
						},
						unregisteredAttributes: {},
					},
				],
				[
					{
						type: 'maxi-blocks/text-custom',
						attributes: {
							className: 'maxi-text-block__custom-format--0',
						},
						unregisteredAttributes: {},
					},
				],
				[
					{
						type: 'maxi-blocks/text-custom',
						attributes: {
							className: 'maxi-text-block__custom-format--0',
						},
						unregisteredAttributes: {},
					},
				],
			],
			text: 'Testing Text Maxi',
			start: 13,
			end: 17,
			activeFormats: [
				{
					type: 'maxi-blocks/text-custom',
					attributes: {
						className: 'maxi-text-block__custom-format--0',
					},
					unregisteredAttributes: {},
				},
			],
		};
		const typography = {
			_cf: {
				'maxi-text-block__custom-format--0': {
					'_fwe-g': '800',
					'_fst-g': 'italic',
				},
			},
		};
		const value = {
			_fst: '',
		};
		const isList = false;
		const textLevel = 'p';

		const result = setFormatWithClass({
			formatValue,
			typography,
			value,
			isList,
			textLevel,
			styleCard,
		});

		const expectedResult = {
			_cf: {
				'maxi-text-block__custom-format--0': {
					'_fwe-g': '800',
				},
			},
			content:
				'Testing Text <span class="maxi-text-block--has-custom-format maxi-text-block__custom-format--0">Maxi</span>',
		};

		expect(JSON.stringify(result)).toStrictEqual(
			JSON.stringify(expectedResult)
		);
	});
	it('Add second segment of format with same format than first', () => {
		const formatValue = {
			formats: [
				,
				,
				,
				,
				,
				,
				,
				,
				,
				,
				,
				,
				,
				[
					{
						type: 'maxi-blocks/text-custom',
						attributes: {
							className: 'maxi-text-block__custom-format--0',
						},
						unregisteredAttributes: {},
					},
				],
				[
					{
						type: 'maxi-blocks/text-custom',
						attributes: {
							className: 'maxi-text-block__custom-format--0',
						},
						unregisteredAttributes: {},
					},
				],
				[
					{
						type: 'maxi-blocks/text-custom',
						attributes: {
							className: 'maxi-text-block__custom-format--0',
						},
						unregisteredAttributes: {},
					},
				],
				[
					{
						type: 'maxi-blocks/text-custom',
						attributes: {
							className: 'maxi-text-block__custom-format--0',
						},
						unregisteredAttributes: {},
					},
				],
			],
			text: 'Testing Text Maxi',
			start: 8,
			end: 13,
			activeFormats: [],
		};
		const typography = {
			_cf: {
				'maxi-text-block__custom-format--0': {
					'_fwe-g': '800',
				},
			},
		};
		const value = {
			_fwe: '800',
		};
		const isList = false;
		const textLevel = 'p';

		const result = setFormatWithClass({
			formatValue,
			typography,
			value,
			isList,
			textLevel,
			styleCard,
		});

		const expectedResult = {
			_cf: {
				'maxi-text-block__custom-format--0': {
					'_fwe-g': '800',
				},
			},
			content:
				'Testing <span class="maxi-text-block--has-custom-format maxi-text-block__custom-format--0">Text Maxi</span>',
		};

		expect(JSON.stringify(result)).toStrictEqual(
			JSON.stringify(expectedResult)
		);
	});
	it('Remove a segment of format part', () => {
		const formatValue = {
			formats: [
				,
				,
				,
				,
				,
				,
				,
				,
				[
					{
						type: 'maxi-blocks/text-custom',
						attributes: {
							className: 'maxi-text-block__custom-format--0',
						},
						unregisteredAttributes: {},
					},
				],
				[
					{
						type: 'maxi-blocks/text-custom',
						attributes: {
							className: 'maxi-text-block__custom-format--0',
						},
						unregisteredAttributes: {},
					},
				],
				[
					{
						type: 'maxi-blocks/text-custom',
						attributes: {
							className: 'maxi-text-block__custom-format--0',
						},
						unregisteredAttributes: {},
					},
				],
				[
					{
						type: 'maxi-blocks/text-custom',
						attributes: {
							className: 'maxi-text-block__custom-format--0',
						},
						unregisteredAttributes: {},
					},
				],
				[
					{
						type: 'maxi-blocks/text-custom',
						attributes: {
							className: 'maxi-text-block__custom-format--0',
						},
						unregisteredAttributes: {},
					},
				],
				[
					{
						type: 'maxi-blocks/text-custom',
						attributes: {
							className: 'maxi-text-block__custom-format--0',
						},
						unregisteredAttributes: {},
					},
				],
				[
					{
						type: 'maxi-blocks/text-custom',
						attributes: {
							className: 'maxi-text-block__custom-format--0',
						},
						unregisteredAttributes: {},
					},
				],
				[
					{
						type: 'maxi-blocks/text-custom',
						attributes: {
							className: 'maxi-text-block__custom-format--0',
						},
						unregisteredAttributes: {},
					},
				],
				[
					{
						type: 'maxi-blocks/text-custom',
						attributes: {
							className: 'maxi-text-block__custom-format--0',
						},
						unregisteredAttributes: {},
					},
				],
			],
			text: 'Testing Text Maxi',
			start: 8,
			end: 13,
		};
		const typography = {
			_cf: {
				'maxi-text-block__custom-format--0': {
					'_fwe-g': '800',
				},
			},
		};
		const value = {
			_fwe: '400',
		};
		const isList = false;
		const textLevel = 'p';

		const result = setFormatWithClass({
			formatValue,
			typography,
			value,
			isList,
			textLevel,
			styleCard,
		});

		const expectedResult = {
			_cf: {
				'maxi-text-block__custom-format--0': {
					'_fwe-g': '800',
				},
			},
			content:
				'Testing Text <span class="maxi-text-block--has-custom-format maxi-text-block__custom-format--0">M</span><span class="maxi-text-block--has-custom-format maxi-text-block__custom-format--0">a</span><span class="maxi-text-block--has-custom-format maxi-text-block__custom-format--0">x</span><span class="maxi-text-block--has-custom-format maxi-text-block__custom-format--0">i</span>',
		};

		expect(JSON.stringify(result)).toStrictEqual(
			JSON.stringify(expectedResult)
		);
	});
	it('Add a segment with new format above other format part', () => {
		const formatValue = {
			formats: [
				,
				,
				,
				,
				,
				,
				,
				,
				,
				,
				,
				,
				,
				[
					{
						type: 'maxi-blocks/text-custom',
						attributes: {
							className: 'maxi-text-block__custom-format--0',
						},
						unregisteredAttributes: {},
					},
				],
				[
					{
						type: 'maxi-blocks/text-custom',
						attributes: {
							className: 'maxi-text-block__custom-format--0',
						},
						unregisteredAttributes: {},
					},
				],
				[
					{
						type: 'maxi-blocks/text-custom',
						attributes: {
							className: 'maxi-text-block__custom-format--0',
						},
						unregisteredAttributes: {},
					},
				],
				[
					{
						type: 'maxi-blocks/text-custom',
						attributes: {
							className: 'maxi-text-block__custom-format--0',
						},
						unregisteredAttributes: {},
					},
				],
			],
			text: 'Testing Text Maxi',
			start: 13,
			end: 15,
			activeFormats: [
				{
					type: 'maxi-blocks/text-custom',
					attributes: {
						className: 'maxi-text-block__custom-format--0',
					},
					unregisteredAttributes: {},
				},
			],
		};
		const typography = {
			_cf: {
				'maxi-text-block__custom-format--0': {
					'_fwe-g': '800',
				},
			},
		};
		const value = {
			_fst: 'italic',
		};
		const isList = false;
		const textLevel = 'p';

		const result = setFormatWithClass({
			formatValue,
			typography,
			value,
			isList,
			textLevel,
			styleCard,
		});

		const expectedResult = {
			_cf: {
				'maxi-text-block__custom-format--0': {
					'_fwe-g': '800',
				},
				'maxi-text-block__custom-format--1': {
					'_fwe-g': '800',
					'_fst-g': 'italic',
				},
			},
			content:
				'Testing Text <span class="maxi-text-block--has-custom-format maxi-text-block__custom-format--1">Ma</span><span class="maxi-text-block--has-custom-format maxi-text-block__custom-format--0">xi</span>',
		};

		expect(JSON.stringify(result)).toStrictEqual(
			JSON.stringify(expectedResult)
		);
	});
	it('Add a segment with new format above other formats parts', () => {
		const formatValue = {
			formats: [
				,
				,
				,
				,
				,
				,
				,
				,
				,
				,
				,
				,
				,
				[
					{
						type: 'maxi-blocks/text-custom',
						attributes: {
							className: 'maxi-text-block__custom-format--1',
						},
						unregisteredAttributes: {},
					},
				],
				[
					{
						type: 'maxi-blocks/text-custom',
						attributes: {
							className: 'maxi-text-block__custom-format--0',
						},
						unregisteredAttributes: {},
					},
				],
				[
					{
						type: 'maxi-blocks/text-custom',
						attributes: {
							className: 'maxi-text-block__custom-format--0',
						},
						unregisteredAttributes: {},
					},
				],
				[
					{
						type: 'maxi-blocks/text-custom',
						attributes: {
							className: 'maxi-text-block__custom-format--0',
						},
						unregisteredAttributes: {},
					},
				],
			],
			text: 'Testing Text Maxi',
			start: 15,
			end: 16,
			activeFormats: [
				{
					type: 'maxi-blocks/text-custom',
					attributes: {
						className: 'maxi-text-block__custom-format--0',
					},
					unregisteredAttributes: {},
				},
			],
		};
		const typography = {
			_cf: {
				'maxi-text-block__custom-format--0': {
					'_fwe-g': '800',
				},
				'maxi-text-block__custom-format--1': {
					'_fwe-g': '800',
					'_fst-g': 'italic',
				},
			},
		};
		const value = {
			_cc: 'rgba(58,22,237,1)',
			_ps: false,
		};
		const isList = false;
		const textLevel = 'p';

		const result = setFormatWithClass({
			formatValue,
			typography,
			value,
			isList,
			textLevel,
			styleCard,
		});

		const expectedResult = {
			_cf: {
				'maxi-text-block__custom-format--0': {
					'_fwe-g': '800',
				},
				'maxi-text-block__custom-format--1': {
					'_fwe-g': '800',
					'_fst-g': 'italic',
				},
				'maxi-text-block__custom-format--2': {
					'_fwe-g': '800',
					'_cc-g': 'rgba(58,22,237,1)',
					'_ps-g': false,
				},
			},
			content:
				'Testing Text <span class="maxi-text-block--has-custom-format maxi-text-block__custom-format--1">M</span><span class="maxi-text-block--has-custom-format maxi-text-block__custom-format--0">a</span><span class="maxi-text-block--has-custom-format maxi-text-block__custom-format--2">x</span><span class="maxi-text-block--has-custom-format maxi-text-block__custom-format--0">i</span>',
		};

		expect(JSON.stringify(result)).toStrictEqual(
			JSON.stringify(expectedResult)
		);
	});
	it('Remove a segment with format above other different format part, and the result is same format for both', () => {
		const formatValue = {
			formats: [
				,
				,
				,
				,
				,
				,
				,
				,
				,
				,
				,
				,
				,
				[
					{
						type: 'maxi-blocks/text-custom',
						attributes: {
							className: 'maxi-text-block__custom-format--1',
						},
						unregisteredAttributes: {},
					},
				],
				[
					{
						type: 'maxi-blocks/text-custom',
						attributes: {
							className: 'maxi-text-block__custom-format--1',
						},
						unregisteredAttributes: {},
					},
				],
				[
					{
						type: 'maxi-blocks/text-custom',
						attributes: {
							className: 'maxi-text-block__custom-format--0',
						},
						unregisteredAttributes: {},
					},
				],
				[
					{
						type: 'maxi-blocks/text-custom',
						attributes: {
							className: 'maxi-text-block__custom-format--0',
						},
						unregisteredAttributes: {},
					},
				],
			],
			text: 'Testing Text Maxi',
			start: 13,
			end: 15,
			activeFormats: [
				{
					type: 'maxi-blocks/text-custom',
					attributes: {
						className: 'maxi-text-block__custom-format--1',
					},
					unregisteredAttributes: {},
				},
			],
		};
		const typography = {
			_cf: {
				'maxi-text-block__custom-format--0': {
					'_fwe-g': '800',
				},
				'maxi-text-block__custom-format--1': {
					'_fwe-g': '800',
					'_fst-g': 'italic',
				},
			},
		};
		const value = {
			_fst: '',
		};
		const isList = false;
		const textLevel = 'p';

		const result = setFormatWithClass({
			formatValue,
			typography,
			value,
			isList,
			textLevel,
			styleCard,
		});

		const expectedResult = {
			_cf: {
				'maxi-text-block__custom-format--0': {
					'_fwe-g': '800',
				},
			},
			content:
				'Testing Text <span class="maxi-text-block--has-custom-format maxi-text-block__custom-format--0">Maxi</span>',
		};

		expect(JSON.stringify(result)).toStrictEqual(
			JSON.stringify(expectedResult)
		);
	});
	it('Remove whole custom format segment above other different and single format part', () => {
		const formatValue = {
			formats: [
				,
				,
				,
				,
				,
				,
				,
				,
				,
				,
				,
				,
				,
				[
					{
						type: 'maxi-blocks/text-custom',
						attributes: {
							className: 'maxi-text-block__custom-format--1',
						},
						unregisteredAttributes: {},
					},
				],
				[
					{
						type: 'maxi-blocks/text-custom',
						attributes: {
							className: 'maxi-text-block__custom-format--0',
						},
						unregisteredAttributes: {},
					},
				],
				[
					{
						type: 'maxi-blocks/text-custom',
						attributes: {
							className: 'maxi-text-block__custom-format--0',
						},
						unregisteredAttributes: {},
					},
				],
				[
					{
						type: 'maxi-blocks/text-custom',
						attributes: {
							className: 'maxi-text-block__custom-format--0',
						},
						unregisteredAttributes: {},
					},
				],
			],
			text: 'Testing Text Maxi',
			start: 13,
			end: 17,
			activeFormats: [
				{
					type: 'maxi-blocks/text-custom',
					attributes: {
						className: 'maxi-text-block__custom-format--1',
					},
					unregisteredAttributes: {},
				},
			],
		};
		const typography = {
			_cf: {
				'maxi-text-block__custom-format--0': {
					'_fwe-g': '800',
				},
				'maxi-text-block__custom-format--1': {
					'_fwe-g': '800',
					'_fst-g': 'italic',
				},
			},
		};
		const value = {
			_fwe: '400',
		};
		const isList = false;
		const textLevel = 'p';

		const result = setFormatWithClass({
			formatValue,
			typography,
			value,
			isList,
			textLevel,
			styleCard,
		});

		const expectedResult = {
			_cf: {
				'maxi-text-block__custom-format--1': {
					'_fst-g': 'italic',
				},
			},
			content:
				'Testing Text <span class="maxi-text-block--has-custom-format maxi-text-block__custom-format--1">M</span>axi',
		};

		expect(JSON.stringify(result)).toStrictEqual(
			JSON.stringify(expectedResult)
		);
	});
	it('Remove whole custom format segment above other different and multiple format parts', () => {
		const formatValue = {
			formats: [
				,
				,
				,
				,
				,
				,
				,
				,
				,
				,
				,
				,
				,
				[
					{
						type: 'maxi-blocks/text-custom',
						attributes: {
							className: 'maxi-text-block__custom-format--1',
						},
						unregisteredAttributes: {},
					},
				],
				[
					{
						type: 'maxi-blocks/text-custom',
						attributes: {
							className: 'maxi-text-block__custom-format--0',
						},
						unregisteredAttributes: {},
					},
				],
				[
					{
						type: 'maxi-blocks/text-custom',
						attributes: {
							className: 'maxi-text-block__custom-format--2',
						},
						unregisteredAttributes: {},
					},
				],
				[
					{
						type: 'maxi-blocks/text-custom',
						attributes: {
							className: 'maxi-text-block__custom-format--0',
						},
						unregisteredAttributes: {},
					},
				],
			],
			text: 'Testing Text Maxi',
			start: 13,
			end: 17,
			activeFormats: [
				{
					type: 'maxi-blocks/text-custom',
					attributes: {
						className: 'maxi-text-block__custom-format--1',
					},
					unregisteredAttributes: {},
				},
			],
		};
		const typography = {
			_cf: {
				'maxi-text-block__custom-format--0': {
					'_fwe-g': '800',
				},
				'maxi-text-block__custom-format--1': {
					'_fwe-g': '800',
					'_fst-g': 'italic',
				},
				'maxi-text-block__custom-format--2': {
					'_fwe-g': '800',
					'_ps-g': false,
					'_cc-g': 'rgba(51,12,247,1)',
				},
			},
		};
		const value = {
			_fwe: '400',
		};
		const isList = false;
		const textLevel = 'p';

		const result = setFormatWithClass({
			formatValue,
			typography,
			value,
			isList,
			textLevel,
			styleCard,
		});

		const expectedResult = {
			_cf: {
				'maxi-text-block__custom-format--1': {
					'_fst-g': 'italic',
				},
				'maxi-text-block__custom-format--2': {
					'_ps-g': false,
					'_cc-g': 'rgba(51,12,247,1)',
				},
			},
			content:
				'Testing Text <span class="maxi-text-block--has-custom-format maxi-text-block__custom-format--1">M</span>a<span class="maxi-text-block--has-custom-format maxi-text-block__custom-format--2">x</span>i',
		};

		expect(JSON.stringify(result)).toStrictEqual(
			JSON.stringify(expectedResult)
		);
	});
	it('Add whole custom format segment above other different and multiple format parts', () => {
		const formatValue = {
			formats: [
				,
				,
				,
				,
				,
				,
				,
				,
				,
				,
				,
				,
				,
				[
					{
						type: 'maxi-blocks/text-custom',
						attributes: {
							className: 'maxi-text-block__custom-format--0',
						},
						unregisteredAttributes: {},
					},
				],
				,
				[
					{
						type: 'maxi-blocks/text-custom',
						attributes: {
							className: 'maxi-text-block__custom-format--1',
						},
						unregisteredAttributes: {},
					},
				],
				,
			],
			text: 'Testing Text Maxi',
			start: 13,
			end: 17,
			activeFormats: [
				{
					type: 'maxi-blocks/text-custom',
					attributes: {
						className: 'maxi-text-block__custom-format--0',
					},
					unregisteredAttributes: {},
				},
			],
		};
		const typography = {
			_cf: {
				'maxi-text-block__custom-format--0': {
					'_fwe-g': '800',
				},
				'maxi-text-block__custom-format--1': {
					'_fst-g': 'italic',
				},
			},
		};
		const value = {
			_ps: false,
			_cc: 'rgba(52,17,228,1)',
		};
		const isList = false;
		const textLevel = 'p';

		const result = setFormatWithClass({
			formatValue,
			typography,
			value,
			isList,
			textLevel,
			styleCard,
		});

		const expectedResult = {
			_cf: {
				'maxi-text-block__custom-format--0': {
					'_fwe-g': '800',
					'_ps-g': false,
					'_cc-g': 'rgba(52,17,228,1)',
				},
				'maxi-text-block__custom-format--1': {
					'_fst-g': 'italic',
					'_ps-g': false,
					'_cc-g': 'rgba(52,17,228,1)',
				},
				'maxi-text-block__custom-format--3': {
					'_ps-g': false,
					'_cc-g': 'rgba(52,17,228,1)',
				},
			},
			content:
				'Testing Text <span class="maxi-text-block--has-custom-format maxi-text-block__custom-format--0">M</span><span class="maxi-text-block--has-custom-format maxi-text-block__custom-format--3">a</span><span class="maxi-text-block--has-custom-format maxi-text-block__custom-format--1">x</span><span class="maxi-text-block--has-custom-format maxi-text-block__custom-format--3">i</span>',
		};

		expect(JSON.stringify(result)).toStrictEqual(
			JSON.stringify(expectedResult)
		);
	});
	it('Add whole custom format segment that selects all the content above other different and multiple format parts', () => {
		const formatValue = {
			formats: [
				,
				,
				,
				,
				,
				,
				,
				,
				,
				,
				,
				,
				,
				[
					{
						type: 'maxi-blocks/text-custom',
						attributes: {
							className: 'maxi-text-block__custom-format--0',
						},
						unregisteredAttributes: {},
					},
				],
				[
					{
						type: 'maxi-blocks/text-custom',
						attributes: {
							className: 'maxi-text-block__custom-format--3',
						},
						unregisteredAttributes: {},
					},
				],
				[
					{
						type: 'maxi-blocks/text-custom',
						attributes: {
							className: 'maxi-text-block__custom-format--1',
						},
						unregisteredAttributes: {},
					},
				],
				[
					{
						type: 'maxi-blocks/text-custom',
						attributes: {
							className: 'maxi-text-block__custom-format--3',
						},
						unregisteredAttributes: {},
					},
				],
			],
			text: 'Testing Text Maxi',
			start: 0,
			end: 17,
			activeFormats: [],
		};
		const typography = {
			_cf: {
				'maxi-text-block__custom-format--0': {
					'_fwe-g': '800',
					'_ps-g': false,
					'_cc-g': 'rgba(52,17,228,1)',
				},
				'maxi-text-block__custom-format--1': {
					'_fst-g': 'italic',
					'_ps-g': false,
					'_cc-g': 'rgba(52,17,228,1)',
				},
				'maxi-text-block__custom-format--3': {
					'_ps-g': false,
					'_cc-g': 'rgba(52,17,228,1)',
				},
			},
		};
		const value = {
			_td: 'underline',
		};
		const isList = false;
		const textLevel = 'p';

		const result = setFormatWithClass({
			formatValue,
			typography,
			value,
			isList,
			textLevel,
			styleCard,
		});

		const expectedResult = {
			_cf: {
				'maxi-text-block__custom-format--0': {
					'_fwe-g': '800',
					'_ps-g': false,
					'_cc-g': 'rgba(52,17,228,1)',
					'_td-g': 'underline',
				},
				'maxi-text-block__custom-format--1': {
					'_fst-g': 'italic',
					'_ps-g': false,
					'_cc-g': 'rgba(52,17,228,1)',
					'_td-g': 'underline',
				},
				'maxi-text-block__custom-format--3': {
					'_ps-g': false,
					'_cc-g': 'rgba(52,17,228,1)',
					'_td-g': 'underline',
				},
			},
			'_td-g': 'underline',
			content:
				'Testing Text <span class="maxi-text-block--has-custom-format maxi-text-block__custom-format--0">M</span><span class="maxi-text-block--has-custom-format maxi-text-block__custom-format--3">a</span><span class="maxi-text-block--has-custom-format maxi-text-block__custom-format--1">x</span><span class="maxi-text-block--has-custom-format maxi-text-block__custom-format--3">i</span>',
		};

		expect(JSON.stringify(result)).toStrictEqual(
			JSON.stringify(expectedResult)
		);
	});
	it('Remove whole custom format segment that selects all the content above other different and multiple format parts', () => {
		const formatValue = {
			formats: [
				,
				,
				,
				,
				,
				,
				,
				,
				,
				,
				,
				,
				,
				[
					{
						type: 'maxi-blocks/text-custom',
						attributes: {
							className: 'maxi-text-block__custom-format--0',
						},
						unregisteredAttributes: {},
					},
				],
				[
					{
						type: 'maxi-blocks/text-custom',
						attributes: {
							className: 'maxi-text-block__custom-format--3',
						},
						unregisteredAttributes: {},
					},
				],
				[
					{
						type: 'maxi-blocks/text-custom',
						attributes: {
							className: 'maxi-text-block__custom-format--1',
						},
						unregisteredAttributes: {},
					},
				],
				[
					{
						type: 'maxi-blocks/text-custom',
						attributes: {
							className: 'maxi-text-block__custom-format--3',
						},
						unregisteredAttributes: {},
					},
				],
			],
			text: 'Testing Text Maxi',
			start: 0,
			end: 17,
			activeFormats: [],
		};
		const typography = {
			'_td-g': 'underline',
			_cf: {
				'maxi-text-block__custom-format--0': {
					'_fwe-g': '800',
					'_ps-g': false,
					'_cc-g': 'rgba(52,17,228,1)',
					'_td-g': 'underline',
				},
				'maxi-text-block__custom-format--1': {
					'_fst-g': 'italic',
					'_ps-g': false,
					'_cc-g': 'rgba(52,17,228,1)',
					'_td-g': 'underline',
				},
				'maxi-text-block__custom-format--3': {
					'_ps-g': false,
					'_cc-g': 'rgba(52,17,228,1)',
					'_td-g': 'underline',
				},
			},
		};
		const value = {
			_td: '',
		};
		const isList = false;
		const textLevel = 'p';

		const result = setFormatWithClass({
			formatValue,
			typography,
			value,
			isList,
			textLevel,
			styleCard,
		});

		const expectedResult = {
			'_td-g': '',
			_cf: {
				'maxi-text-block__custom-format--0': {
					'_fwe-g': '800',
					'_ps-g': false,
					'_cc-g': 'rgba(52,17,228,1)',
				},
				'maxi-text-block__custom-format--1': {
					'_fst-g': 'italic',
					'_ps-g': false,
					'_cc-g': 'rgba(52,17,228,1)',
				},
				'maxi-text-block__custom-format--3': {
					'_ps-g': false,
					'_cc-g': 'rgba(52,17,228,1)',
				},
			},
			content:
				'Testing Text <span class="maxi-text-block--has-custom-format maxi-text-block__custom-format--0">M</span><span class="maxi-text-block--has-custom-format maxi-text-block__custom-format--3">a</span><span class="maxi-text-block--has-custom-format maxi-text-block__custom-format--1">x</span><span class="maxi-text-block--has-custom-format maxi-text-block__custom-format--3">i</span>',
		};

		expect(JSON.stringify(result)).toStrictEqual(
			JSON.stringify(expectedResult)
		);
	});
	it('Add second custom format over simple custom format in multiple and separated segments', () => {
		const formatValue = {
			formats: [
				,
				,
				,
				,
				,
				,
				,
				,
				[
					{
						type: 'maxi-blocks/text-custom',
						attributes: {
							className: 'maxi-text-block__custom-format--0',
						},
						unregisteredAttributes: {},
					},
				],
				[
					{
						type: 'maxi-blocks/text-custom',
						attributes: {
							className: 'maxi-text-block__custom-format--0',
						},
						unregisteredAttributes: {},
					},
				],
				[
					{
						type: 'maxi-blocks/text-custom',
						attributes: {
							className: 'maxi-text-block__custom-format--0',
						},
						unregisteredAttributes: {},
					},
				],
				[
					{
						type: 'maxi-blocks/text-custom',
						attributes: {
							className: 'maxi-text-block__custom-format--0',
						},
						unregisteredAttributes: {},
					},
				],
				[
					{
						type: 'maxi-blocks/text-custom',
						attributes: {
							className: 'maxi-text-block__custom-format--0',
						},
						unregisteredAttributes: {},
					},
				],
				[
					{
						type: 'maxi-blocks/text-custom',
						attributes: {
							className: 'maxi-text-block__custom-format--0',
						},
						unregisteredAttributes: {},
					},
				],
				[
					{
						type: 'maxi-blocks/text-custom',
						attributes: {
							className: 'maxi-text-block__custom-format--1',
						},
						unregisteredAttributes: {},
					},
				],
				[
					{
						type: 'maxi-blocks/text-custom',
						attributes: {
							className: 'maxi-text-block__custom-format--1',
						},
						unregisteredAttributes: {},
					},
				],
				[
					{
						type: 'maxi-blocks/text-custom',
						attributes: {
							className: 'maxi-text-block__custom-format--0',
						},
						unregisteredAttributes: {},
					},
				],
			],
			text: 'Testing Text Maxi',
			start: 9,
			end: 11,
			activeFormats: [
				{
					type: 'maxi-blocks/text-custom',
					attributes: {
						className: 'maxi-text-block__custom-format--0',
					},
					unregisteredAttributes: {},
				},
			],
		};
		const typography = {
			_cf: {
				'maxi-text-block__custom-format--0': {
					'_fwe-g': '800',
				},
				'maxi-text-block__custom-format--1': {
					'_fwe-g': '800',
					'_fst-g': 'italic',
				},
			},
		};
		const value = {
			_fst: 'italic',
		};
		const isList = false;
		const textLevel = 'p';

		const result = setFormatWithClass({
			formatValue,
			typography,
			value,
			isList,
			textLevel,
			styleCard,
		});

		const expectedResult = {
			_cf: {
				'maxi-text-block__custom-format--0': {
					'_fwe-g': '800',
				},
				'maxi-text-block__custom-format--1': {
					'_fwe-g': '800',
					'_fst-g': 'italic',
				},
			},
			content:
				'Testing <span class="maxi-text-block--has-custom-format maxi-text-block__custom-format--0">T</span><span class="maxi-text-block--has-custom-format maxi-text-block__custom-format--1">ex</span><span class="maxi-text-block--has-custom-format maxi-text-block__custom-format--0">t M</span><span class="maxi-text-block--has-custom-format maxi-text-block__custom-format--1">ax</span><span class="maxi-text-block--has-custom-format maxi-text-block__custom-format--0">i</span>',
		};

		expect(JSON.stringify(result)).toStrictEqual(
			JSON.stringify(expectedResult)
		);
	});
	it('Remove simple custom format of whole segment in content with multiple and separated custom formats segments', () => {
		const formatValue = {
			formats: [
				,
				,
				,
				,
				,
				,
				,
				,
				[
					{
						type: 'maxi-blocks/text-custom',
						attributes: {
							className: 'maxi-text-block__custom-format--0',
						},
						unregisteredAttributes: {},
					},
				],
				[
					{
						type: 'maxi-blocks/text-custom',
						attributes: {
							className: 'maxi-text-block__custom-format--1',
						},
						unregisteredAttributes: {},
					},
				],
				[
					{
						type: 'maxi-blocks/text-custom',
						attributes: {
							className: 'maxi-text-block__custom-format--1',
						},
						unregisteredAttributes: {},
					},
				],
				[
					{
						type: 'maxi-blocks/text-custom',
						attributes: {
							className: 'maxi-text-block__custom-format--0',
						},
						unregisteredAttributes: {},
					},
				],
				[
					{
						type: 'maxi-blocks/text-custom',
						attributes: {
							className: 'maxi-text-block__custom-format--0',
						},
						unregisteredAttributes: {},
					},
				],
				[
					{
						type: 'maxi-blocks/text-custom',
						attributes: {
							className: 'maxi-text-block__custom-format--0',
						},
						unregisteredAttributes: {},
					},
				],
				[
					{
						type: 'maxi-blocks/text-custom',
						attributes: {
							className: 'maxi-text-block__custom-format--1',
						},
						unregisteredAttributes: {},
					},
				],
				[
					{
						type: 'maxi-blocks/text-custom',
						attributes: {
							className: 'maxi-text-block__custom-format--1',
						},
						unregisteredAttributes: {},
					},
				],
				[
					{
						type: 'maxi-blocks/text-custom',
						attributes: {
							className: 'maxi-text-block__custom-format--0',
						},
						unregisteredAttributes: {},
					},
				],
			],
			text: 'Testing Text Maxi',
			start: 8,
			end: 17,
			activeFormats: [
				{
					type: 'maxi-blocks/text-custom',
					attributes: {
						className: 'maxi-text-block__custom-format--0',
					},
					unregisteredAttributes: {},
				},
			],
		};
		const typography = {
			_cf: {
				'maxi-text-block__custom-format--0': {
					'_fwe-g': '800',
				},
				'maxi-text-block__custom-format--1': {
					'_fwe-g': '800',
					'_fst-g': 'italic',
				},
			},
		};
		const value = {
			_fwe: '400',
		};
		const isList = false;
		const textLevel = 'p';

		const result = setFormatWithClass({
			formatValue,
			typography,
			value,
			isList,
			textLevel,
			styleCard,
		});

		const expectedResult = {
			_cf: {
				'maxi-text-block__custom-format--1': {
					'_fst-g': 'italic',
				},
			},
			content:
				'Testing T<span class="maxi-text-block--has-custom-format maxi-text-block__custom-format--1">ex</span>t M<span class="maxi-text-block--has-custom-format maxi-text-block__custom-format--1">ax</span>i',
		};

		expect(JSON.stringify(result)).toStrictEqual(
			JSON.stringify(expectedResult)
		);
	});
	it('Set a segment with custom format with default format value for a content that has a global different custom format', () => {
		const formatValue = {
			formats: [
				,
				,
				,
				,
				,
				,
				,
				,
				,
				[
					{
						type: 'maxi-blocks/text-custom',
						attributes: {
							className: 'maxi-text-block__custom-format--1',
						},
						unregisteredAttributes: {},
					},
				],
				[
					{
						type: 'maxi-blocks/text-custom',
						attributes: {
							className: 'maxi-text-block__custom-format--1',
						},
						unregisteredAttributes: {},
					},
				],
				,
				,
				,
				[
					{
						type: 'maxi-blocks/text-custom',
						attributes: {
							className: 'maxi-text-block__custom-format--1',
						},
						unregisteredAttributes: {},
					},
				],
				[
					{
						type: 'maxi-blocks/text-custom',
						attributes: {
							className: 'maxi-text-block__custom-format--1',
						},
						unregisteredAttributes: {},
					},
				],
				,
			],
			text: 'Testing Text Maxi',
			start: 2,
			end: 7,
			activeFormats: [],
		};
		const typography = {
			'_fwe-g': '800',
			_cf: {
				'maxi-text-block__custom-format--1': {
					'_fst-g': 'italic',
					'_fwe-g': '800',
				},
			},
		};
		const value = {
			_fwe: '400',
		};
		const isList = false;
		const textLevel = 'p';

		const result = setFormatWithClass({
			formatValue,
			typography,
			value,
			isList,
			textLevel,
			styleCard,
		});

		const expectedResult = {
			'_fwe-g': '800',
			_cf: {
				'maxi-text-block__custom-format--1': {
					'_fst-g': 'italic',
					'_fwe-g': '800',
				},
				'maxi-text-block__custom-format--0': {
					'_fwe-g': '400',
				},
			},
			content:
				'Te<span class="maxi-text-block--has-custom-format maxi-text-block__custom-format--0">sting</span> T<span class="maxi-text-block--has-custom-format maxi-text-block__custom-format--1">ex</span>t M<span class="maxi-text-block--has-custom-format maxi-text-block__custom-format--1">ax</span>i',
		};

		expect(JSON.stringify(result)).toStrictEqual(
			JSON.stringify(expectedResult)
		);
	});
	it('Remove a segment with custom format with opposite format value of the global custom format of the content', () => {
		const formatValue = {
			formats: [
				,
				,
				,
				,
				,
				,
				,
				,
				[
					{
						type: 'maxi-blocks/text-custom',
						attributes: {
							className: 'maxi-text-block__custom-format--0',
						},
						unregisteredAttributes: {},
					},
				],
				[
					{
						type: 'maxi-blocks/text-custom',
						attributes: {
							className: 'maxi-text-block__custom-format--0',
						},
						unregisteredAttributes: {},
					},
				],
				[
					{
						type: 'maxi-blocks/text-custom',
						attributes: {
							className: 'maxi-text-block__custom-format--0',
						},
						unregisteredAttributes: {},
					},
				],
				[
					{
						type: 'maxi-blocks/text-custom',
						attributes: {
							className: 'maxi-text-block__custom-format--0',
						},
						unregisteredAttributes: {},
					},
				],
				,
				,
				,
				,
				,
			],
			text: 'Testing Text Maxi',
			start: 8,
			end: 12,
			activeFormats: [
				{
					type: 'maxi-blocks/text-custom',
					attributes: {
						className: 'maxi-text-block__custom-format--0',
					},
					unregisteredAttributes: {},
				},
			],
		};
		const typography = {
			'_fwe-g': '800',
			_cf: {
				'maxi-text-block__custom-format--0': {
					'_fwe-g': '400',
				},
			},
		};
		const value = {
			_fwe: '800',
		};
		const isList = false;
		const textLevel = 'p';

		const result = setFormatWithClass({
			formatValue,
			typography,
			value,
			isList,
			textLevel,
			styleCard,
		});

		const expectedResult = {
			'_fwe-g': '800',
			_cf: {},
			content: 'Testing Text Maxi',
		};

		expect(JSON.stringify(result)).toStrictEqual(
			JSON.stringify(expectedResult)
		);
	});
	it('Add simple hover custom format', () => {
		const formatValue = {
			formats: [, , , , , , , , , , , , , , , , ,],
			text: 'Testing Text Maxi',
			start: 8,
			end: 12,
			activeFormats: [],
		};
		const typography = {};
		const value = {
			_ps: false,
			_cc: 'rgba(221,31,31,1)',
		};
		const isList = false;
		const textLevel = 'p';
		const isHover = true;

		const result = setFormatWithClass({
			formatValue,
			typography,
			value,
			isList,
			textLevel,
			isHover,
			styleCard,
		});

		const expectedResult = {
			'_cf.h': {
				'maxi-text-block__custom-format--0--hover': {
					'_ps-g': false,
					'_cc-g': 'rgba(221,31,31,1)',
				},
			},
			content:
				'Testing <span class="maxi-text-block--has-custom-hover-format maxi-text-block__custom-format--0--hover">Text</span> Maxi',
		};

		expect(JSON.stringify(result)).toStrictEqual(
			JSON.stringify(expectedResult)
		);
	});
	it('Add second simple custom format in a non-hover custom format segment', () => {
		const formatValue = {
			formats: [
				,
				,
				,
				,
				,
				,
				,
				,
				[
					{
						type: 'span',
						attributes: {
							className:
								'maxi-text-block__custom-format--0--hover',
						},
						unregisteredAttributes: {},
					},
				],
				[
					{
						type: 'span',
						attributes: {
							className:
								'maxi-text-block__custom-format--0--hover',
						},
						unregisteredAttributes: {},
					},
				],
				[
					{
						type: 'span',
						attributes: {
							className:
								'maxi-text-block__custom-format--0--hover',
						},
						unregisteredAttributes: {},
					},
				],
				[
					{
						type: 'span',
						attributes: {
							className:
								'maxi-text-block__custom-format--0--hover',
						},
						unregisteredAttributes: {},
					},
				],
				,
				,
				,
				,
				,
			],
			text: 'Testing Text Maxi',
			start: 13,
			end: 17,
			activeFormats: [],
		};
		const typography = {
			'_cf.h': {
				'maxi-text-block__custom-format--1--hover': {
					'_fwe-g': '800',
				},
				'maxi-text-block__custom-format--0--hover': {
					'_ps-g': false,
					'_cc-g': 'rgba(220,34,34,1)',
				},
			},
		};
		const value = {
			_fwe: '800',
		};
		const textLevel = 'p';
		const isHover = true;
		const isList = false;

		const result = setFormatWithClass({
			formatValue,
			typography,
			value,
			isList,
			textLevel,
			isHover,
			styleCard,
		});

		const expectedResult = {
			'_cf.h': {
				'maxi-text-block__custom-format--2--hover': {
					'_fwe-g': '800',
				},
			},
			content:
				'Testing <span className="maxi-text-block__custom-format--0--hover">Text</span> <span class="maxi-text-block--has-custom-hover-format maxi-text-block__custom-format--2--hover">Maxi</span>',
		};

		expect(JSON.stringify(result)).toStrictEqual(
			JSON.stringify(expectedResult)
		);
	});
});

describe('checkFormatCoincidence', () => {
	it('checkFormatCoincidence: set simple custom format equal to an existing simple custom format', () => {
		const typography = {
			_cf: {
				'maxi-text-block__custom-format--0': {
					'_fwe-g': '800',
				},
				'maxi-text-block__custom-format--1': {
					'_fwe-g': '800',
				},
			},
		};
		const className = 'maxi-text-block__custom-format--1';
		const breakpoint = 'g';
		const value = {
			_fwe: '800',
		};
		const isHover = false;
		const textLevel = 'p';

		const result = checkFormatCoincidence({
			typography,
			className,
			value,
			breakpoint,
			isHover,
			textLevel,
			styleCard,
		});
		const expectedResult = 'maxi-text-block__custom-format--0';

		expect(result).toStrictEqual(expectedResult);
	});
});

describe('getFormatClassName', () => {
	it('should return a non-existing class on custom formats object', () => {
		const typography = {
			_cf: {
				'maxi-text-block__custom-format--0': {},
				'maxi-text-block__custom-format--1': {},
				'maxi-text-block__custom-format--2': {},
			},
		};
		const isHover = false;

		const result = getFormatClassName(typography, isHover);

		expect(result).toStrictEqual('maxi-text-block__custom-format--3');
	});
});
