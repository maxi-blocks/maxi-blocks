import getHasNativeFormat from '@extensions/text/formats/getHasNativeFormat';

describe('getHasNativeFormat', () => {
	it('Returns true when format contains core type within range', () => {
		const formatValue = {
			formats: [[{ type: 'core/bold' }], [{ type: 'core/italic' }]],
			start: 1,
			end: 1,
		};
		expect(getHasNativeFormat(formatValue)).toBe(true);
	});

	it('Returns false when format contains core type outside range', () => {
		const formatValue = {
			formats: [[], [{ type: 'core/bold' }], [{ type: 'core/italic' }]],
			start: 0,
			end: 0,
		};
		expect(getHasNativeFormat(formatValue)).toBe(false);
	});

	it('Returns false when format does not contain core type', () => {
		const formatValue = {
			formats: [[{ type: 'custom/format' }], [{ type: 'other/format' }]],
			start: 1,
			end: 1,
		};
		expect(getHasNativeFormat(formatValue)).toBe(false);
	});
});
