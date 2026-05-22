import { getLinkAttributesFromLinkSettings } from '@extensions/save/utils';

jest.mock('@extensions/DC/constants', () => ({
	inlineLinkFields: [],
}));

jest.mock('@extensions/DC/utils', () => ({
	isLinkObfuscationEnabled: jest.fn(() => false),
}));

describe('save link utils', () => {
	it('omits empty title and aria label attributes', () => {
		const result = getLinkAttributesFromLinkSettings(
			{
				url: 'https://example.com',
				title: '',
				ariaLabel: '',
			},
			false,
			false
		);

		expect(result).not.toHaveProperty('title');
		expect(result).not.toHaveProperty('aria-label');
	});

	it('preserves trimmed manual title and aria label attributes', () => {
		const result = getLinkAttributesFromLinkSettings(
			{
				url: 'https://example.com',
				title: '  Example title  ',
				ariaLabel: '  Accessible example link  ',
			},
			false,
			false
		);

		expect(result).toMatchObject({
			title: 'Example title',
			'aria-label': 'Accessible example link',
		});
	});
});
