/* eslint-disable no-sparse-arrays */
/**
 * Internal dependencies
 */
import setFormatWithClass, {
	checkFormatCoincidence,
	getFormatClassName,
} from '../setFormatWithClass';
import '../../../style-cards';

/**
 * Mocks
 */
jest.mock('../../../styles/getBlockStyle', () => {
	return jest.fn(() => {
		return 'light';
	});
});

jest.mock('../../../style-cards/getActiveStyleCard', () => {
	return jest.fn(() => {
		return {
			value: {
				styleCard: {
					dark: {},
					light: {},
				},
				styleCardDefaults: {
					dark: {},
					light: {
						'color-1': '#ffffff',
						'color-2': '#f2f9fd',
						'color-3': '#9b9b9b',
						'color-4': '#ff4a17',
						'color-5': '#000000',
						'color-6': '#c9340a',
						'color-7': '#081219',
						'p-font-family-general': 'Roboto',
						'p-font-size-general': '16px',
						'p-font-size-xxl': '20px',
						'p-font-size-xl': '16px',
						'p-font-size-l': '16px',
						'p-font-size-m': '16px',
						'p-font-size-s': '16px',
						'p-font-size-xs': '16px',
						'p-line-height-xxl': 1.5,
						'p-line-height-xl': 1.625,
						'p-line-height-l': 1.625,
						'p-line-height-m': 1.625,
						'p-line-height-s': 1.625,
						'p-line-height-xs': 1.625,
						'p-font-weight-general': '400',
						'p-letter-spacing-general': '0px',
						'p-text-transform-general': 'none',
						'p-font-style-general': 'normal',
						'p-text-decoration-general': 'unset',
						'button-font-family-general': 'Roboto',
						'button-font-size-general': '18px',
						'button-font-size-xxl': '22px',
						'button-font-size-xl': '18px',
						'button-font-size-l': '16px',
						'button-font-size-m': '16px',
						'button-font-size-s': '16px',
						'button-font-size-xs': '16px',
						'button-line-height-general': 1.625,
						'button-line-height-xxl': 1.5,
						'button-line-height-xl': 1.625,
						'button-line-height-l': 1.625,
						'button-line-height-m': 1.625,
						'button-line-height-s': 1.625,
						'button-line-height-xs': 1.625,
						'button-font-weight-general': '400',
						'button-letter-spacing-general': '0px',
						'button-text-transform-general': 'none',
						'button-font-style-general': 'normal',
						'button-text-decoration-general': 'unset',
						'h1-font-family-general': 'Roboto',
						'h1-font-size-general': '45px',
						'h1-font-size-xxl': '50px',
						'h1-font-size-xl': '45px',
						'h1-font-size-l': '40px',
						'h1-font-size-m': '36px',
						'h1-font-size-s': '34px',
						'h1-font-size-xs': '32px',
						'h1-line-height-xxl': 1.18,
						'h1-line-height-xl': 1.1,
						'h1-line-height-l': 1.22,
						'h1-line-height-m': 1.27,
						'h1-line-height-s': 1.27,
						'h1-line-height-xs': 1.27,
						'h1-font-weight-general': '500',
						'h1-letter-spacing-general': '0px',
						'h1-text-transform-general': 'none',
						'h1-font-style-general': 'normal',
						'h1-text-decoration-general': 'unset',
						'h2-font-family-general': 'Roboto',
						'h2-font-size-general': '38px',
						'h2-font-size-xxl': '44px',
						'h2-font-size-xl': '38px',
						'h2-font-size-l': '36px',
						'h2-font-size-m': '32px',
						'h2-font-size-s': '30px',
						'h2-font-size-xs': '28px',
						'h2-line-height-xxl': 1.21,
						'h2-line-height-xl': 1.05,
						'h2-line-height-l': 1.26,
						'h2-line-height-m': 1.33,
						'h2-line-height-s': 1.33,
						'h2-line-height-xs': 1.33,
						'h2-font-weight-general': '500',
						'h2-letter-spacing-general': '0px',
						'h2-text-transform-general': 'none',
						'h2-font-style-general': 'normal',
						'h2-text-decoration-general': 'unset',
						'h3-font-family-general': 'Roboto',
						'h3-font-size-general': '30px',
						'h3-font-size-xxl': '34px',
						'h3-font-size-xl': '30px',
						'h3-font-size-l': '30px',
						'h3-font-size-m': '26px',
						'h3-font-size-s': '24px',
						'h3-font-size-xs': '24px',
						'h3-line-height-xxl': 1.25,
						'h3-line-height-xl': 1.3,
						'h3-line-height-l': 1.23,
						'h3-line-height-m': 1.16,
						'h3-line-height-s': 1.16,
						'h3-line-height-xs': 1.16,
						'h3-font-weight-general': '500',
						'h3-letter-spacing-general': '0px',
						'h3-text-transform-general': 'none',
						'h3-font-style-general': 'normal',
						'h3-text-decoration-general': 'unset',
						'h4-font-family-general': 'Roboto',
						'h4-font-size-general': '26px',
						'h4-font-size-xxl': '30px',
						'h4-font-size-xl': '26px',
						'h4-font-size-l': '24px',
						'h4-font-size-m': '24px',
						'h4-font-size-s': '22px',
						'h4-font-size-xs': '22px',
						'h4-line-height-xxl': 1.33,
						'h4-line-height-xl': 1.24,
						'h4-line-height-l': 1.38,
						'h4-line-height-m': 1.42,
						'h4-line-height-s': 1.42,
						'h4-line-height-xs': 1.42,
						'h4-font-weight-general': '500',
						'h4-letter-spacing-general': '0px',
						'h4-text-transform-general': 'none',
						'h4-font-style-general': 'normal',
						'h4-text-decoration-general': 'unset',
						'h5-font-family-general': 'Roboto',
						'h5-font-size-general': '22px',
						'h5-font-size-xxl': '28px',
						'h5-font-size-xl': '22px',
						'h5-font-size-l': '22px',
						'h5-font-size-m': '20px',
						'h5-font-size-s': '20px',
						'h5-font-size-xs': '20px',
						'h5-line-height-xxl': 1.36,
						'h5-line-height-xl': 1.26,
						'h5-line-height-l': 1.45,
						'h5-line-height-m': 1.5,
						'h5-line-height-s': 1.5,
						'h5-line-height-xs': 1.5,
						'h5-font-weight-general': '500',
						'h5-letter-spacing-general': '0px',
						'h5-text-transform-general': 'none',
						'h5-font-style-general': 'normal',
						'h5-text-decoration-general': 'unset',
						'h6-font-family-general': 'Roboto',
						'h6-font-size-general': '20px',
						'h6-font-size-xxl': '24px',
						'h6-font-size-xl': '20px',
						'h6-font-size-l': '20px',
						'h6-font-size-m': '18px',
						'h6-font-size-s': '18px',
						'h6-font-size-xs': '18px',
						'h6-line-height-xxl': 1.39,
						'h6-line-height-xl': 1.29,
						'h6-line-height-l': 1.5,
						'h6-line-height-m': 1.56,
						'h6-line-height-s': 1.56,
						'h6-line-height-xs': 1.56,
						'h6-font-weight-general': '500',
						'h6-letter-spacing-general': '0px',
						'h6-text-transform-general': 'none',
						'h6-font-style-general': 'normal',
						'h6-text-decoration-general': 'unset',
						'font-icon-font-size-general': '30px',
					},
				},
			},
		};
	});
});

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
			'font-weight': 800,
		};
		const isList = false;
		const textLevel = 'p';

		const result = setFormatWithClass({
			formatValue,
			typography,
			value,
			isList,
			textLevel,
		});
		const expectedResult = {
			'custom-formats': {
				'maxi-text-block__custom-format--0': {
					'font-weight-general': 800,
				},
			},
			content:
				'Testing Text <maxi-blocks/text-custom className="maxi-text-block__custom-format--0">Maxi</maxi-blocks/text-custom>',
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
			'custom-formats': {
				'maxi-text-block__custom-format--0': {
					'font-weight-general': 800,
				},
			},
		};
		const value = {
			'font-weight': 400,
		};
		const isList = false;
		const textLevel = 'p';

		const result = setFormatWithClass({
			formatValue,
			typography,
			value,
			isList,
			textLevel,
		});
		const expectedResult = {
			'custom-formats': {},
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
			'custom-formats': {
				'maxi-text-block__custom-format--0': {
					'font-style-general': 'italic',
				},
			},
		};
		const value = {
			'font-weight': 800,
		};
		const isList = false;
		const textLevel = 'p';

		const result = setFormatWithClass({
			formatValue,
			typography,
			value,
			isList,
			textLevel,
		});

		const expectedResult = {
			'custom-formats': {
				'maxi-text-block__custom-format--0': {
					'font-style-general': 'italic',
				},
				'maxi-text-block__custom-format--1': {
					'font-weight-general': 800,
				},
			},
			content:
				'Testing Text <maxi-blocks/text-custom className="maxi-text-block__custom-format--1">Ma</maxi-blocks/text-custom><maxi-blocks/text-custom className="maxi-text-block__custom-format--0">xi</maxi-blocks/text-custom>',
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
			'custom-formats': {
				'maxi-text-block__custom-format--0': {
					'font-style-general': 'italic',
				},
				'maxi-text-block__custom-format--1': {
					'font-weight-general': 800,
				},
			},
		};
		const value = {
			'font-weight': 400,
		};
		const isList = false;
		const textLevel = 'p';

		const result = setFormatWithClass({
			formatValue,
			typography,
			value,
			isList,
			textLevel,
		});

		const expectedResult = {
			'custom-formats': {
				'maxi-text-block__custom-format--0': {
					'font-style-general': 'italic',
				},
			},
			content:
				'Testing Text Ma<maxi-blocks/text-custom className="maxi-text-block__custom-format--0">x</maxi-blocks/text-custom><maxi-blocks/text-custom className="maxi-text-block__custom-format--0">i</maxi-blocks/text-custom>',
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
			'custom-formats': {
				'maxi-text-block__custom-format--0': {
					'font-weight-general': 800,
				},
			},
		};
		const value = {
			'font-style': 'italic',
		};
		const isList = false;
		const textLevel = 'p';

		const result = setFormatWithClass({
			formatValue,
			typography,
			value,
			isList,
			textLevel,
		});

		const expectedResult = {
			'custom-formats': {
				'maxi-text-block__custom-format--0': {
					'font-weight-general': 800,
					'font-style-general': 'italic',
				},
			},
			content:
				'Testing Text <maxi-blocks/text-custom className="maxi-text-block__custom-format--0">Maxi</maxi-blocks/text-custom>',
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
			'custom-formats': {
				'maxi-text-block__custom-format--0': {
					'font-weight-general': 800,
					'font-style-general': 'italic',
				},
			},
		};
		const value = {
			'font-style': '',
		};
		const isList = false;
		const textLevel = 'p';

		const result = setFormatWithClass({
			formatValue,
			typography,
			value,
			isList,
			textLevel,
		});

		const expectedResult = {
			'custom-formats': {
				'maxi-text-block__custom-format--0': {
					'font-weight-general': 800,
				},
			},
			content:
				'Testing Text <maxi-blocks/text-custom className="maxi-text-block__custom-format--0">Maxi</maxi-blocks/text-custom>',
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
			'custom-formats': {
				'maxi-text-block__custom-format--0': {
					'font-weight-general': 800,
				},
			},
		};
		const value = {
			'font-weight': 800,
		};
		const isList = false;
		const textLevel = 'p';

		const result = setFormatWithClass({
			formatValue,
			typography,
			value,
			isList,
			textLevel,
		});

		const expectedResult = {
			'custom-formats': {
				'maxi-text-block__custom-format--0': {
					'font-weight-general': 800,
				},
			},
			content:
				'Testing <maxi-blocks/text-custom className="maxi-text-block__custom-format--0">Text Maxi</maxi-blocks/text-custom>',
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
			'custom-formats': {
				'maxi-text-block__custom-format--0': {
					'font-weight-general': 800,
				},
			},
		};
		const value = {
			'font-weight': 400,
		};
		const isList = false;
		const textLevel = 'p';

		const result = setFormatWithClass({
			formatValue,
			typography,
			value,
			isList,
			textLevel,
		});

		const expectedResult = {
			'custom-formats': {
				'maxi-text-block__custom-format--0': {
					'font-weight-general': 800,
				},
			},
			content:
				'Testing Text <maxi-blocks/text-custom className="maxi-text-block__custom-format--0">M</maxi-blocks/text-custom><maxi-blocks/text-custom className="maxi-text-block__custom-format--0">a</maxi-blocks/text-custom><maxi-blocks/text-custom className="maxi-text-block__custom-format--0">x</maxi-blocks/text-custom><maxi-blocks/text-custom className="maxi-text-block__custom-format--0">i</maxi-blocks/text-custom>',
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
			'custom-formats': {
				'maxi-text-block__custom-format--0': {
					'font-weight-general': 800,
				},
			},
		};
		const value = {
			'font-style': 'italic',
		};
		const isList = false;
		const textLevel = 'p';

		const result = setFormatWithClass({
			formatValue,
			typography,
			value,
			isList,
			textLevel,
		});

		const expectedResult = {
			'custom-formats': {
				'maxi-text-block__custom-format--0': {
					'font-weight-general': 800,
				},
				'maxi-text-block__custom-format--1': {
					'font-weight-general': 800,
					'font-style-general': 'italic',
				},
			},
			content:
				'Testing Text <maxi-blocks/text-custom className="maxi-text-block__custom-format--1">Ma</maxi-blocks/text-custom><maxi-blocks/text-custom className="maxi-text-block__custom-format--0">xi</maxi-blocks/text-custom>',
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
			'custom-formats': {
				'maxi-text-block__custom-format--0': {
					'font-weight-general': 800,
				},
				'maxi-text-block__custom-format--1': {
					'font-weight-general': 800,
					'font-style-general': 'italic',
				},
			},
		};
		const value = {
			color: 'rgba(58,22,237,1)',
		};
		const isList = false;
		const textLevel = 'p';

		const result = setFormatWithClass({
			formatValue,
			typography,
			value,
			isList,
			textLevel,
		});

		const expectedResult = {
			'custom-formats': {
				'maxi-text-block__custom-format--0': {
					'font-weight-general': 800,
				},
				'maxi-text-block__custom-format--1': {
					'font-weight-general': 800,
					'font-style-general': 'italic',
				},
				'maxi-text-block__custom-format--2': {
					'font-weight-general': 800,
					'color-general': 'rgba(58,22,237,1)',
				},
			},
			content:
				'Testing Text <maxi-blocks/text-custom className="maxi-text-block__custom-format--1">M</maxi-blocks/text-custom><maxi-blocks/text-custom className="maxi-text-block__custom-format--0">a</maxi-blocks/text-custom><maxi-blocks/text-custom className="maxi-text-block__custom-format--2">x</maxi-blocks/text-custom><maxi-blocks/text-custom className="maxi-text-block__custom-format--0">i</maxi-blocks/text-custom>',
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
			'custom-formats': {
				'maxi-text-block__custom-format--0': {
					'font-weight-general': 800,
				},
				'maxi-text-block__custom-format--1': {
					'font-weight-general': 800,
					'font-style-general': 'italic',
				},
			},
		};
		const value = {
			'font-style': '',
		};
		const isList = false;
		const textLevel = 'p';

		const result = setFormatWithClass({
			formatValue,
			typography,
			value,
			isList,
			textLevel,
		});

		const expectedResult = {
			'custom-formats': {
				'maxi-text-block__custom-format--0': {
					'font-weight-general': 800,
				},
			},
			content:
				'Testing Text <maxi-blocks/text-custom className="maxi-text-block__custom-format--0">Maxi</maxi-blocks/text-custom>',
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
			'custom-formats': {
				'maxi-text-block__custom-format--0': {
					'font-weight-general': 800,
				},
				'maxi-text-block__custom-format--1': {
					'font-weight-general': 800,
					'font-style-general': 'italic',
				},
			},
		};
		const value = {
			'font-weight': 400,
		};
		const isList = false;
		const textLevel = 'p';

		const result = setFormatWithClass({
			formatValue,
			typography,
			value,
			isList,
			textLevel,
		});

		const expectedResult = {
			'custom-formats': {
				'maxi-text-block__custom-format--1': {
					'font-style-general': 'italic',
				},
			},
			content:
				'Testing Text <maxi-blocks/text-custom className="maxi-text-block__custom-format--1">M</maxi-blocks/text-custom>axi',
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
			'custom-formats': {
				'maxi-text-block__custom-format--0': {
					'font-weight-general': 800,
				},
				'maxi-text-block__custom-format--1': {
					'font-weight-general': 800,
					'font-style-general': 'italic',
				},
				'maxi-text-block__custom-format--2': {
					'font-weight-general': 800,
					'color-general': 'rgba(51,12,247,1)',
				},
			},
		};
		const value = {
			'font-weight': 400,
		};
		const isList = false;
		const textLevel = 'p';

		const result = setFormatWithClass({
			formatValue,
			typography,
			value,
			isList,
			textLevel,
		});

		const expectedResult = {
			'custom-formats': {
				'maxi-text-block__custom-format--1': {
					'font-style-general': 'italic',
				},
				'maxi-text-block__custom-format--2': {
					'color-general': 'rgba(51,12,247,1)',
				},
			},
			content:
				'Testing Text <maxi-blocks/text-custom className="maxi-text-block__custom-format--1">M</maxi-blocks/text-custom>a<maxi-blocks/text-custom className="maxi-text-block__custom-format--2">x</maxi-blocks/text-custom>i',
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
			'custom-formats': {
				'maxi-text-block__custom-format--0': {
					'font-weight-general': 800,
				},
				'maxi-text-block__custom-format--1': {
					'font-style-general': 'italic',
				},
			},
		};
		const value = {
			color: 'rgba(52,17,228,1)',
		};
		const isList = false;
		const textLevel = 'p';

		const result = setFormatWithClass({
			formatValue,
			typography,
			value,
			isList,
			textLevel,
		});

		const expectedResult = {
			'custom-formats': {
				'maxi-text-block__custom-format--0': {
					'font-weight-general': 800,
					'color-general': 'rgba(52,17,228,1)',
				},
				'maxi-text-block__custom-format--1': {
					'font-style-general': 'italic',
					'color-general': 'rgba(52,17,228,1)',
				},
				'maxi-text-block__custom-format--3': {
					'color-general': 'rgba(52,17,228,1)',
				},
			},
			content:
				'Testing Text <maxi-blocks/text-custom className="maxi-text-block__custom-format--0">M</maxi-blocks/text-custom><maxi-blocks/text-custom className="maxi-text-block__custom-format--3">a</maxi-blocks/text-custom><maxi-blocks/text-custom className="maxi-text-block__custom-format--1">x</maxi-blocks/text-custom><maxi-blocks/text-custom className="maxi-text-block__custom-format--3">i</maxi-blocks/text-custom>',
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
			'custom-formats': {
				'maxi-text-block__custom-format--0': {
					'font-weight-general': 800,
					'color-general': 'rgba(52,17,228,1)',
				},
				'maxi-text-block__custom-format--1': {
					'font-style-general': 'italic',
					'color-general': 'rgba(52,17,228,1)',
				},
				'maxi-text-block__custom-format--3': {
					'color-general': 'rgba(52,17,228,1)',
				},
			},
		};
		const value = {
			'text-decoration': 'underline',
		};
		const isList = false;
		const textLevel = 'p';

		const result = setFormatWithClass({
			formatValue,
			typography,
			value,
			isList,
			textLevel,
		});

		const expectedResult = {
			'custom-formats': {
				'maxi-text-block__custom-format--0': {
					'font-weight-general': 800,
					'color-general': 'rgba(52,17,228,1)',
					'text-decoration-general': 'underline',
				},
				'maxi-text-block__custom-format--1': {
					'font-style-general': 'italic',
					'color-general': 'rgba(52,17,228,1)',
					'text-decoration-general': 'underline',
				},
				'maxi-text-block__custom-format--3': {
					'color-general': 'rgba(52,17,228,1)',
					'text-decoration-general': 'underline',
				},
			},
			'text-decoration-general': 'underline',
			content:
				'Testing Text <maxi-blocks/text-custom className="maxi-text-block__custom-format--0">M</maxi-blocks/text-custom><maxi-blocks/text-custom className="maxi-text-block__custom-format--3">a</maxi-blocks/text-custom><maxi-blocks/text-custom className="maxi-text-block__custom-format--1">x</maxi-blocks/text-custom><maxi-blocks/text-custom className="maxi-text-block__custom-format--3">i</maxi-blocks/text-custom>',
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
			'text-decoration-general': 'underline',
			'custom-formats': {
				'maxi-text-block__custom-format--0': {
					'font-weight-general': 800,
					'color-general': 'rgba(52,17,228,1)',
					'text-decoration-general': 'underline',
				},
				'maxi-text-block__custom-format--1': {
					'font-style-general': 'italic',
					'color-general': 'rgba(52,17,228,1)',
					'text-decoration-general': 'underline',
				},
				'maxi-text-block__custom-format--3': {
					'color-general': 'rgba(52,17,228,1)',
					'text-decoration-general': 'underline',
				},
			},
		};
		const value = {
			'text-decoration': '',
		};
		const isList = false;
		const textLevel = 'p';

		const result = setFormatWithClass({
			formatValue,
			typography,
			value,
			isList,
			textLevel,
		});

		const expectedResult = {
			'text-decoration-general': '',
			'custom-formats': {
				'maxi-text-block__custom-format--0': {
					'font-weight-general': 800,
					'color-general': 'rgba(52,17,228,1)',
				},
				'maxi-text-block__custom-format--1': {
					'font-style-general': 'italic',
					'color-general': 'rgba(52,17,228,1)',
				},
				'maxi-text-block__custom-format--3': {
					'color-general': 'rgba(52,17,228,1)',
				},
			},
			content:
				'Testing Text <maxi-blocks/text-custom className="maxi-text-block__custom-format--0">M</maxi-blocks/text-custom><maxi-blocks/text-custom className="maxi-text-block__custom-format--3">a</maxi-blocks/text-custom><maxi-blocks/text-custom className="maxi-text-block__custom-format--1">x</maxi-blocks/text-custom><maxi-blocks/text-custom className="maxi-text-block__custom-format--3">i</maxi-blocks/text-custom>',
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
			'custom-formats': {
				'maxi-text-block__custom-format--0': {
					'font-weight-general': 800,
				},
				'maxi-text-block__custom-format--1': {
					'font-weight-general': 800,
					'font-style-general': 'italic',
				},
			},
		};
		const value = {
			'font-style': 'italic',
		};
		const isList = false;
		const textLevel = 'p';

		const result = setFormatWithClass({
			formatValue,
			typography,
			value,
			isList,
			textLevel,
		});

		const expectedResult = {
			'custom-formats': {
				'maxi-text-block__custom-format--0': {
					'font-weight-general': 800,
				},
				'maxi-text-block__custom-format--1': {
					'font-weight-general': 800,
					'font-style-general': 'italic',
				},
			},
			content:
				'Testing <maxi-blocks/text-custom className="maxi-text-block__custom-format--0">T</maxi-blocks/text-custom><maxi-blocks/text-custom className="maxi-text-block__custom-format--1">ex</maxi-blocks/text-custom><maxi-blocks/text-custom className="maxi-text-block__custom-format--0">t M</maxi-blocks/text-custom><maxi-blocks/text-custom className="maxi-text-block__custom-format--1">ax</maxi-blocks/text-custom><maxi-blocks/text-custom className="maxi-text-block__custom-format--0">i</maxi-blocks/text-custom>',
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
			'custom-formats': {
				'maxi-text-block__custom-format--0': {
					'font-weight-general': 800,
				},
				'maxi-text-block__custom-format--1': {
					'font-weight-general': 800,
					'font-style-general': 'italic',
				},
			},
		};
		const value = {
			'font-weight': 400,
		};
		const isList = false;
		const textLevel = 'p';

		const result = setFormatWithClass({
			formatValue,
			typography,
			value,
			isList,
			textLevel,
		});

		const expectedResult = {
			'custom-formats': {
				'maxi-text-block__custom-format--1': {
					'font-style-general': 'italic',
				},
			},
			content:
				'Testing T<maxi-blocks/text-custom className="maxi-text-block__custom-format--1">ex</maxi-blocks/text-custom>t M<maxi-blocks/text-custom className="maxi-text-block__custom-format--1">ax</maxi-blocks/text-custom>i',
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
			'font-weight-general': 800,
			'custom-formats': {
				'maxi-text-block__custom-format--1': {
					'font-style-general': 'italic',
					'font-weight-general': 800,
				},
			},
		};
		const value = {
			'font-weight': 400,
		};
		const isList = false;
		const textLevel = 'p';

		const result = setFormatWithClass({
			formatValue,
			typography,
			value,
			isList,
			textLevel,
		});

		const expectedResult = {
			'font-weight-general': 800,
			'custom-formats': {
				'maxi-text-block__custom-format--1': {
					'font-style-general': 'italic',
					'font-weight-general': 800,
				},
				'maxi-text-block__custom-format--0': {
					'font-weight-general': 400,
				},
			},
			content:
				'Te<maxi-blocks/text-custom className="maxi-text-block__custom-format--0">sting</maxi-blocks/text-custom> T<maxi-blocks/text-custom className="maxi-text-block__custom-format--1">ex</maxi-blocks/text-custom>t M<maxi-blocks/text-custom className="maxi-text-block__custom-format--1">ax</maxi-blocks/text-custom>i',
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
			'font-weight-general': 800,
			'custom-formats': {
				'maxi-text-block__custom-format--0': {
					'font-weight-general': 400,
				},
			},
		};
		const value = {
			'font-weight': 800,
		};
		const isList = false;
		const textLevel = 'p';

		const result = setFormatWithClass({
			formatValue,
			typography,
			value,
			isList,
			textLevel,
		});

		const expectedResult = {
			'font-weight-general': 800,
			'custom-formats': {},
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
			color: 'rgba(221,31,31,1)',
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
		});

		const expectedResult = {
			'custom-formats-hover': {
				'maxi-text-block__custom-format--0--hover': {
					'color-general': 'rgba(221,31,31,1)',
				},
			},
			content:
				'Testing <maxi-blocks/text-custom-hover className="maxi-text-block__custom-format--0--hover">Text</maxi-blocks/text-custom-hover> Maxi',
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
						type: 'maxi-blocks/text-custom-hover',
						attributes: {
							className:
								'maxi-text-block__custom-format--0--hover',
						},
						unregisteredAttributes: {},
					},
				],
				[
					{
						type: 'maxi-blocks/text-custom-hover',
						attributes: {
							className:
								'maxi-text-block__custom-format--0--hover',
						},
						unregisteredAttributes: {},
					},
				],
				[
					{
						type: 'maxi-blocks/text-custom-hover',
						attributes: {
							className:
								'maxi-text-block__custom-format--0--hover',
						},
						unregisteredAttributes: {},
					},
				],
				[
					{
						type: 'maxi-blocks/text-custom-hover',
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
			'custom-formats-hover': {
				'maxi-text-block__custom-format--0--hover': {
					'color-general': 'rgba(220,34,34,1)',
				},
			},
		};
		const value = {
			'font-weight': '800',
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
		});

		const expectedResult = {
			'custom-formats-hover': {
				'maxi-text-block__custom-format--0--hover': {
					'color-general': 'rgba(220,34,34,1)',
				},
				'maxi-text-block__custom-format--1--hover': {
					'font-weight-general': '800',
				},
			},
			content:
				'Testing <maxi-blocks/text-custom-hover className="maxi-text-block__custom-format--0--hover">Text</maxi-blocks/text-custom-hover> <maxi-blocks/text-custom-hover className="maxi-text-block__custom-format--1--hover">Maxi</maxi-blocks/text-custom-hover>',
		};

		expect(JSON.stringify(result)).toStrictEqual(
			JSON.stringify(expectedResult)
		);
	});
});

describe('checkFormatCoincidence', () => {
	it('checkFormatCoincidence: set simple custom format equal to an existing simple custom format', () => {
		const typography = {
			'custom-formats': {
				'maxi-text-block__custom-format--0': {
					'font-weight-general': 800,
				},
				'maxi-text-block__custom-format--1': {
					'font-weight-general': 800,
				},
			},
		};
		const className = 'maxi-text-block__custom-format--1';
		const breakpoint = 'general';
		const value = {
			'font-weight': 800,
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
		});
		const expectedResult = 'maxi-text-block__custom-format--0';

		expect(result).toStrictEqual(expectedResult);
	});
});

describe('getFormatClassName', () => {
	it('should return a non-existing class on custom formats object', () => {
		const typography = {
			'custom-formats': {
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
