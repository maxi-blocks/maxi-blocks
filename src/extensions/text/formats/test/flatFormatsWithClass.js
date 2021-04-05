/**
 * Internal dependencies
 */
import {
	getRepeatedClassNames,
	flatRepeatedClassNames,
} from '../flatFormatsWithClass';

describe('flatFormatsWithClass', () => {
	// getRepeatedClassNames
	it('getRepeatedClassNames: should return no repeated classNames', () => {
		const customFormats = {
			'maxi-text-block__custom-format--0': {
				'font-weight-general': 800,
			},
		};
		const formatValue = {
			formats: [
				null,
				null,
				null,
				null,
				null,
				null,
				null,
				null,
				null,
				null,
				null,
				null,
				null,
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
			replacements: [
				null,
				null,
				null,
				null,
				null,
				null,
				null,
				null,
				null,
				null,
				null,
				null,
				null,
				null,
				null,
				null,
				null,
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
				},
			],
		};

		const result = getRepeatedClassNames(customFormats, formatValue);

		expect(result).toStrictEqual([]);
	});
	it('getRepeatedClassNames: should return 2 repeated classNames that has the same format', () => {
		const customFormats = {
			'maxi-text-block__custom-format--0': {
				'font-weight-general': 800,
			},
			'maxi-text-block__custom-format--1': {
				'font-weight-general': 800,
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
				null,
				null,
				null,
				null,
				null,
				null,
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
			replacements: [
				null,
				null,
				null,
				null,
				null,
				null,
				null,
				null,
				null,
				null,
				null,
				null,
				null,
				null,
				null,
				null,
				null,
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
	it('flatRepeatedClassNames: should reduce repeated custom formats classes to one', () => {
		const repeatedClasses = [
			'maxi-text-block__custom-format--0',
			'maxi-text-block__custom-format--1',
		];
		const formatValue = {
			formats: [
				null,
				null,
				null,
				null,
				null,
				null,
				null,
				null,
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
				null,
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
			// Reduced object
			'custom-formats': {
				'maxi-text-block__custom-format--0': {
					'font-weight-general': 800,
				},
				'maxi-text-block__custom-format--1': {
					'font-weight-general': 800,
				},
			},
		};

		// debugger;
		const result = flatRepeatedClassNames(
			repeatedClasses,
			formatValue,
			typography
		);
		const expectResult = {
			formatValue: {
				formats: [
					null,
					null,
					null,
					null,
					null,
					null,
					null,
					null,
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
					null,
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
						'font-weight-general': 800,
					},
				},
			},
		};

		expect(JSON.stringify(result)).toBe(JSON.stringify(expectResult));
	});
});
