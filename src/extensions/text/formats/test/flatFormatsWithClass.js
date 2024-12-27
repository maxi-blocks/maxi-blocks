/* eslint-disable no-sparse-arrays */
/**
 * Internal dependencies
 */
import flatFormatsWithClass, {
	getRepeatedClassNames,
	flatRepeatedClassNames,
} from '@extensions/text/formats/flatFormatsWithClass';

/**
 * Mocks
 */
jest.mock('@wordpress/blocks', () => jest.fn());
jest.mock('src/components/block-inserter/index.js', () => jest.fn());
jest.mock('@extensions/styles/getBlockStyle', () => {
	return jest.fn(() => {
		return 'light';
	});
});
jest.mock('@extensions/attributes/getBlockData.js', () => jest.fn());
jest.mock('src/components/transform-control/utils.js', () => jest.fn());
jest.mock('@extensions/style-cards/getActiveStyleCard', () => {
	return jest.fn(() => {
		return {
			value: {
				styleCard: {
					dark: {},
					light: {},
				},
				defaultStyleCard: {
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
jest.mock('@extensions/styles/transitions/getTransitionData.js', () =>
	jest.fn()
);
jest.mock('src/extensions/DC/constants.js', () => ({}));

describe('getRepeatedClassNames', () => {
	it('Should return no repeated classNames', () => {
		const customFormats = {
			'maxi-text-block__custom-format--0': {
				'font-weight-general': '800',
			},
		};
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
					},
				],
				[
					{
						type: 'maxi-blocks/text-custom',
						attributes: {
							className: 'maxi-text-block__custom-format--0',
						},
					},
				],
				[
					{
						type: 'maxi-blocks/text-custom',
						attributes: {
							className: 'maxi-text-block__custom-format--0',
						},
					},
				],
				[
					{
						type: 'maxi-blocks/text-custom',
						attributes: {
							className: 'maxi-text-block__custom-format--0',
						},
					},
				],
			],
			replacements: [, , , , , , , , , , , , , , , , ,],
			text: 'Testing Text Maxi',
			start: 13,
			end: 17,
			activeFormats: [
				{
					type: 'maxi-blocks/text-custom',
					attributes: {
						className: 'maxi-text-block__custom-format--0',
					},
				},
			],
		};

		const result = getRepeatedClassNames(customFormats, formatValue);

		expect(result).toStrictEqual([]);
	});
	it('Should return 2 repeated classNames that has the same format', () => {
		const customFormats = {
			'maxi-text-block__custom-format--0': {
				'font-weight-general': '800',
			},
			'maxi-text-block__custom-format--1': {
				'font-weight-general': '800',
			},
		};
		const formatValue = {
			formats: [
				[
					{
						type: 'maxi-blocks/text-custom',
						attributes: {
							className: 'maxi-text-block__custom-format--1',
						},
					},
				],
				[
					{
						type: 'maxi-blocks/text-custom',
						attributes: {
							className: 'maxi-text-block__custom-format--1',
						},
					},
				],
				[
					{
						type: 'maxi-blocks/text-custom',
						attributes: {
							className: 'maxi-text-block__custom-format--1',
						},
					},
				],
				[
					{
						type: 'maxi-blocks/text-custom',
						attributes: {
							className: 'maxi-text-block__custom-format--1',
						},
					},
				],
				[
					{
						type: 'maxi-blocks/text-custom',
						attributes: {
							className: 'maxi-text-block__custom-format--1',
						},
					},
				],
				[
					{
						type: 'maxi-blocks/text-custom',
						attributes: {
							className: 'maxi-text-block__custom-format--1',
						},
					},
				],
				[
					{
						type: 'maxi-blocks/text-custom',
						attributes: {
							className: 'maxi-text-block__custom-format--1',
						},
					},
				],
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
			start: 0,
			end: 7,
			activeFormats: [
				{
					type: 'maxi-blocks/text-custom',
					attributes: {
						className: 'maxi-text-block__custom-format--1',
					},
				},
			],
		};

		const result = getRepeatedClassNames(customFormats, formatValue);
		const expectResult = [
			'maxi-text-block__custom-format--0',
			'maxi-text-block__custom-format--1',
		];

		expect(result).toStrictEqual(expectResult);
	});
});

describe('flatRepeatedClassNames', () => {
	it('Should reduce repeated custom formats classes to one', () => {
		const repeatedClasses = [
			'maxi-text-block__custom-format--0',
			'maxi-text-block__custom-format--1',
		];
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
							className: 'maxi-text-block__custom-format--1',
						},
					},
				],
				[
					{
						type: 'maxi-blocks/text-custom',
						attributes: {
							className: 'maxi-text-block__custom-format--1',
						},
					},
				],
				[
					{
						type: 'maxi-blocks/text-custom',
						attributes: {
							className: 'maxi-text-block__custom-format--1',
						},
					},
				],
				[
					{
						type: 'maxi-blocks/text-custom',
						attributes: {
							className: 'maxi-text-block__custom-format--1',
						},
					},
				],
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
			end: 12,
		};
		const typography = {
			'custom-formats': {
				'maxi-text-block__custom-format--0': {
					'font-weight-general': '800',
				},
				'maxi-text-block__custom-format--1': {
					'font-weight-general': '800',
				},
			},
		};

		const result = flatRepeatedClassNames(
			repeatedClasses,
			formatValue,
			typography
		);
		const expectResult = {
			formatValue: {
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
						},
					],
					[
						{
							type: 'maxi-blocks/text-custom',
							attributes: {
								className: 'maxi-text-block__custom-format--0',
							},
						},
					],
					[
						{
							type: 'maxi-blocks/text-custom',
							attributes: {
								className: 'maxi-text-block__custom-format--0',
							},
						},
					],
					[
						{
							type: 'maxi-blocks/text-custom',
							attributes: {
								className: 'maxi-text-block__custom-format--0',
							},
						},
					],
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
				end: 12,
			},
			typography: {
				'custom-formats': {
					'maxi-text-block__custom-format--0': {
						'font-weight-general': '800',
					},
				},
			},
		};

		expect(JSON.stringify(result)).toBe(JSON.stringify(expectResult));
	});
});

describe('flatFormatsWithClass', () => {
	it('On a content with custom format with a segment with the opposite custom format, on removing the global format, should return a non-custom format content', () => {
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
			start: 0,
			end: 17,
			activeFormats: [],
		};
		const typography = {
			'font-weight-general': '400',
			'custom-formats': {
				'maxi-text-block__custom-format--0': {
					'font-weight-general': '400',
				},
			},
		};
		const content =
			'Testing <span class="maxi-text-block--has-custom-format maxi-text-block__custom-format--0">Text</span> Maxi';
		const isList = false;
		const value = {
			'font-weight': '400',
		};
		const breakpoint = 'general';
		const textLevel = 'p';

		const result = flatFormatsWithClass({
			formatValue,
			typography,
			content,
			isList,
			value,
			breakpoint,
			textLevel,
		});
		const expectResult = {
			typography: { 'custom-formats': {} },
			content: 'Testing Text Maxi',
		};

		expect(result).toStrictEqual(expectResult);
	});

	it('Should remove a format class-name which does not exist on the customFormats attribute', () => {
		const formatValue = {
			formats: [
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
				,
			],
			replacements: [, , , , , , , , , , , , , , , , , , , ,],
			text: 'Testing Text Maxi',
			start: 0,
			end: 20,
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
			'font-weight-general': '800',
		};
		const content =
			'<span class="maxi-text-block--has-custom-format maxi-text-block__custom-format--0">Testing Text Maxi</span>';
		const isList = false;
		const value = {
			'font-weight': '800',
		};
		const breakpoint = 'general';
		const textLevel = 'p';

		const result = flatFormatsWithClass({
			formatValue,
			typography,
			content,
			isList,
			value,
			breakpoint,
			textLevel,
		});
		const expectResult = {
			typography: { 'custom-formats': undefined },
			content: 'Testing Text Maxi',
		};

		expect(result).toStrictEqual(expectResult);
	});
});
