/* eslint-disable no-sparse-arrays */
/**
 * Internal dependencies
 */
import getMultiFormatObj from '@extensions/text/formats/getMultiFormatObj';

describe('getMultiFormatObj', () => {
	it('getMultiFormatObj: simple object', () => {
		const formatValue = {
			formats: [, , , , , , , , , , , , , , , , ,],
			replacements: [, , , , , , , , , , , , , , , , ,],
			text: 'Testing Text Maxi',
			start: 13,
			end: 17,
			activeFormats: [],
		};

		const result = getMultiFormatObj(formatValue);

		expect(result).toStrictEqual({
			0: {
				className: null,
				start: 13,
				end: 16,
			},
		});
	});
	it('getMultiFormatObj: multiple object', () => {
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
					unregisteredAttributes: {},
				},
			],
		};

		const result = getMultiFormatObj(formatValue);

		expect(result).toStrictEqual({
			0: {
				className: 'maxi-text-block__custom-format--0',
				start: 13,
				end: 14,
			},
			1: {
				className: null,
				start: 14,
				end: 15,
			},
			2: {
				className: 'maxi-text-block__custom-format--1',
				start: 15,
				end: 16,
			},
			3: {
				className: null,
				start: 16,
				end: 17,
			},
		});
	});
	/**
	 * Missing tests
	 * - With hover
	 * - With isWholeContent
	 */
});
