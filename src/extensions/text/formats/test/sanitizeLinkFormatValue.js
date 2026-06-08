import sanitizeLinkFormatValue from '@extensions/text/formats/sanitizeLinkFormatValue';

describe('sanitizeLinkFormatValue', () => {
	it('removes empty link attributes while preserving shared format identity', () => {
		const linkFormat = {
			type: 'maxi-blocks/text-link',
			attributes: {
				url: 'https://example.com',
				title: '',
				ariaLabel: '',
			},
		};
		const formatValue = {
			formats: [[linkFormat], [linkFormat]],
			activeFormats: [linkFormat],
		};

		const result = sanitizeLinkFormatValue(formatValue);

		expect(result.formats[0][0]).toBe(result.formats[1][0]);
		expect(result.activeFormats[0]).toBe(result.formats[0][0]);
		expect(result.formats[0][0].attributes).toEqual({
			url: 'https://example.com',
		});
	});
});
