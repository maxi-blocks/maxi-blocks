import {
	createLinkAttributes,
	createLinkValue,
} from '@components/toolbar/components/text-link/utils';

describe('text link utils', () => {
	it('omits empty title and aria label attributes', () => {
		const result = createLinkAttributes({
			url: 'https://example.com',
			title: '',
			ariaLabel: '',
			linkValue: {
				url: '',
				title: '',
				ariaLabel: '',
			},
		});

		expect(result).toEqual({
			url: 'https://example.com',
		});
	});

	it('preserves trimmed manual title and aria label attributes', () => {
		const result = createLinkAttributes({
			url: 'https://example.com',
			title: '  Example title  ',
			ariaLabel: '  Accessible example link  ',
		});

		expect(result).toEqual({
			url: 'https://example.com',
			title: 'Example title',
			ariaLabel: 'Accessible example link',
		});
	});

	it('does not reintroduce an empty title when the URL changes', () => {
		const result = createLinkAttributes({
			url: 'https://new.example.com',
			title: '',
			linkValue: {
				url: 'https://old.example.com',
				title: '',
			},
		});

		expect(result).not.toHaveProperty('title');
	});

	it('creates link values with aria labels', () => {
		const result = createLinkValue({
			formatOptions: {
				attributes: {
					url: 'https://example.com',
					ariaLabel: 'Accessible example link',
				},
			},
			formatValue: {
				text: 'Example',
			},
		});

		expect(result).toMatchObject({
			url: 'https://example.com',
			ariaLabel: 'Accessible example link',
		});
	});
});
