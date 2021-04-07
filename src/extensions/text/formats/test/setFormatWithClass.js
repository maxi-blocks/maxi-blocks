/**
 * Internal dependencies
 */
import setFormatWithClass, {
	checkFormatCoincidence,
} from '../setFormatWithClass';

describe('setFormatWithClass', () => {
	it('setFormatWithClass: add simple custom format', () => {
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

		const result = setFormatWithClass({
			formatValue,
			typography,
			value,
			isList,
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
	it('setFormatWithClass: remove simple custom format', () => {
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

		const result = setFormatWithClass({
			formatValue,
			typography,
			value,
			isList,
		});
		const expectedResult = {
			'custom-formats': {},
			content: 'Testing Text Maxi',
		};

		expect(JSON.stringify(result)).toStrictEqual(
			JSON.stringify(expectedResult)
		);
	});
	it('setFormatWithClass: add second simple custom format over other simple custom format', () => {
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

		const result = setFormatWithClass({
			formatValue,
			typography,
			value,
			isList,
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
	it('setFormatWithClass: remove second simple custom format over other simple custom format', () => {
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

		const result = setFormatWithClass({
			formatValue,
			typography,
			value,
			isList,
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
	it('setFormatWithClass: add second segment of format with same format than first', () => {
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

		const result = setFormatWithClass({
			formatValue,
			typography,
			value,
			isList,
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
	it('setFormatWithClass: remove a segment of format part', () => {
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

		const result = setFormatWithClass({
			formatValue,
			typography,
			value,
			isList,
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
	it('setFormatWithClass: add a segment with new format above other format part', () => {
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

		const result = setFormatWithClass({
			formatValue,
			typography,
			value,
			isList,
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
	it('setFormatWithClass: add a segment with new format above other formats parts', () => {
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

		const result = setFormatWithClass({
			formatValue,
			typography,
			value,
			isList,
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
	it('setFormatWithClass: remove a segment with format above other different format part, and the result is same format for both', () => {
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

		const result = setFormatWithClass({
			formatValue,
			typography,
			value,
			isList,
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
	it('setFormatWithClass: remove whole custom format segment above other different and single format part', () => {
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

		const result = setFormatWithClass({
			formatValue,
			typography,
			value,
			isList,
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
	it('setFormatWithClass: remove whole custom format segment above other different and multiple format parts', () => {
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
					'color-general': 'rgba(58,22,237,1)',
				},
			},
		};
		const value = {
			'font-weight': 400,
		};
		const isList = false;

		const result = setFormatWithClass({
			formatValue,
			typography,
			value,
			isList,
		});

		const expectedResult = {
			'custom-formats': {
				'maxi-text-block__custom-format--1': {
					'font-style-general': 'italic',
				},
				'maxi-text-block__custom-format--2': {
					'color-general': 'rgba(58,22,237,1)',
				},
			},
			content:
				'Testing Text <maxi-blocks/text-custom className="maxi-text-block__custom-format--1">M</maxi-blocks/text-custom>a<maxi-blocks/text-custom className="maxi-text-block__custom-format--2">x</maxi-blocks/text-custom><maxi-blocks/text-custom className="maxi-text-block__custom-format--0">i</maxi-blocks/text-custom>',
		};

		expect(JSON.stringify(result)).toStrictEqual(
			JSON.stringify(expectedResult)
		);
	});
	it('setFormatWithClass: add whole custom format segment above other different and multiple format parts', () => {
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
				null,
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
						className: 'maxi-text-block__custom-format--1',
					},
					unregisteredAttributes: {},
				},
			],
		};
		const typography = {
			'font-family-general': 'Roboto',
			'font-size-unit-general': 'px',
			'font-size-general': 16,
			'line-height-general': 1.625,
			'letter-spacing-unit-general': 'px',
			'letter-spacing-general': 0,
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
			'custom-formats': {
				'maxi-text-block__custom-format--1': {
					'font-style-general': 'italic',
				},
				'maxi-text-block__custom-format--2': {
					'color-general': 'rgba(58,22,237,1)',
				},
			},
		};
		const value = {
			'font-weight': 800,
		};
		const isList = false;

		const result = setFormatWithClass({
			formatValue,
			typography,
			value,
			isList,
		});

		const expectedResult = {
			'font-family-general': 'Roboto',
			'font-size-unit-general': 'px',
			'font-size-general': 16,
			'line-height-general': 1.625,
			'letter-spacing-unit-general': 'px',
			'letter-spacing-general': 0,
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
			'custom-formats': {
				'maxi-text-block__custom-format--1': {
					'font-style-general': 'italic',
					'font-weight-general': 800,
				},
				'maxi-text-block__custom-format--2': {
					'color-general': 'rgba(58,22,237,1)',
					'font-weight-general': 800,
				},
				'maxi-text-block__custom-format--0': {
					'font-weight-general': 800,
				},
			},
			content:
				'Testing Text <span class="maxi-text-block--has-custom-format maxi-text-block__custom-format--1">M</span>a<span class="maxi-text-block--has-custom-format maxi-text-block__custom-format--2">x</span><span class="maxi-text-block--has-custom-format maxi-text-block__custom-format--0">i</span>',
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

		const result = checkFormatCoincidence({
			typography,
			className,
			value,
			breakpoint,
			isHover,
		});
		const expectedResult = 'maxi-text-block__custom-format--0';

		expect(result).toStrictEqual(expectedResult);
	});
});
