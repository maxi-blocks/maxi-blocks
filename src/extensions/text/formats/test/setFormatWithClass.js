/**
 * Internal dependencies
 */
import setFormatWithClass, {
	checkFormatCoincidence,
	getFormatClassName,
} from '../setFormatWithClass';
import formatValueCleaner from '../formatValueCleaner';

describe('setFormatWithClass', () => {
	it('Add simple custom format', () => {
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
				null,
				null,
				null,
				null,
			],
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
			formatValue: formatValueCleaner(formatValue),
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
			formatValue: formatValueCleaner(formatValue),
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
			formatValue: formatValueCleaner(formatValue),
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
			formatValue: formatValueCleaner(formatValue),
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
			formatValue: formatValueCleaner(formatValue),
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
			formatValue: formatValueCleaner(formatValue),
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
			formatValue: formatValueCleaner(formatValue),
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
			formatValue: formatValueCleaner(formatValue),
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
			formatValue: formatValueCleaner(formatValue),
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
			formatValue: formatValueCleaner(formatValue),
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
			formatValue: formatValueCleaner(formatValue),
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
			formatValue: formatValueCleaner(formatValue),
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
			formatValue: formatValueCleaner(formatValue),
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
						unregisteredAttributes: {},
					},
				],
				null,
				[
					{
						type: 'maxi-blocks/text-custom',
						attributes: {
							className: 'maxi-text-block__custom-format--1',
						},
						unregisteredAttributes: {},
					},
				],
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
			formatValue: formatValueCleaner(formatValue),
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
			formatValue: formatValueCleaner(formatValue),
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
			formatValue: formatValueCleaner(formatValue),
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
			formatValue: formatValueCleaner(formatValue),
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
			formatValue: formatValueCleaner(formatValue),
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
				null,
				null,
				null,
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
				null,
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
			formatValue: formatValueCleaner(formatValue),
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
			formatValue: formatValueCleaner(formatValue),
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
				null,
				null,
				null,
				null,
			],
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
			formatValue: formatValueCleaner(formatValue),
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
				null,
				null,
				null,
				null,
				null,
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
			formatValue: formatValueCleaner(formatValue),
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
