/**
 * Internal dependencies
 */
import getMultiFormatObj from '../getMultiFormatObj';

describe('getMultiFormatObj', () => {
	it('getMultiFormatObj: simple object', () => {
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
});
