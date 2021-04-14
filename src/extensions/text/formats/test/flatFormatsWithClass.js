/**
 * Internal dependencies
 */
import flatFormatsWithClass, {
	getRepeatedClassNames,
	flatRepeatedClassNames,
} from '../flatFormatsWithClass';
import formatValueCleaner from '../formatValueCleaner';

describe('getRepeatedClassNames', () => {
	it('Should return no repeated classNames', () => {
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
	it('Should return 2 repeated classNames that has the same format', () => {
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

		const result = getRepeatedClassNames(
			customFormats,
			formatValueCleaner(formatValue)
		);
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
			'custom-formats': {
				'maxi-text-block__custom-format--0': {
					'font-weight-general': 800,
				},
				'maxi-text-block__custom-format--1': {
					'font-weight-general': 800,
				},
			},
		};

		const result = flatRepeatedClassNames(
			repeatedClasses,
			formatValueCleaner(formatValue),
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

describe('flatFormatsWithClass', () => {
	it('On a content with custom format with a segment with the opposite custom format, on removing the global format, should return a non-custom format content', () => {
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
				null,
				null,
				null,
				null,
				null,
			],
			text: 'Testing Text Maxi',
			start: 0,
			end: 17,
			activeFormats: [],
		};
		const typography = {
			'font-weight-general': 400,
			'custom-formats': {
				'maxi-text-block__custom-format--0': {
					'font-weight-general': 400,
				},
			},
		};
		const content =
			'Testing <span class="maxi-text-block--has-custom-format maxi-text-block__custom-format--0">Text</span> Maxi';
		const isList = false;
		const value = {
			'font-weight': 400,
		};
		const breakpoint = 'general';
		const textLevel = 'p';

		const result = flatFormatsWithClass({
			formatValue: formatValueCleaner(formatValue),
			typography,
			content,
			isList,
			value,
			breakpoint,
			textLevel,
		});
		const expectResult = {
			typography: { 'font-weight-general': 400, 'custom-formats': {} },
			content: 'Testing Text Maxi',
		};

		expect(result).toStrictEqual(expectResult);
	});
});
