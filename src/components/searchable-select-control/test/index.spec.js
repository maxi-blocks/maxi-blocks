import {
	flattenOptions,
	getFilteredOptions,
} from '@components/searchable-select-control';

jest.mock('@wordpress/i18n', () => ({
	__: jest.fn(text => text),
}));

jest.mock('@components/base-control', () => 'BaseControl');
jest.mock('@components/reset-control', () => 'ResetButton');

describe('SearchableSelectControl helpers', () => {
	it('flattens grouped options while preserving the group label', () => {
		const result = flattenOptions({
			'Post fields': [
				{ label: 'Title', value: 'title' },
				undefined,
				{ label: 'Excerpt', value: 'excerpt' },
			],
			'Author fields': [{ label: 'Author name', value: 'author_name' }],
		});

		expect(result).toEqual([
			{ label: 'Title', value: 'title', groupLabel: 'Post fields' },
			{ label: 'Excerpt', value: 'excerpt', groupLabel: 'Post fields' },
			{
				label: 'Author name',
				value: 'author_name',
				groupLabel: 'Author fields',
			},
		]);
	});

	it('filters by label, value, group label, and search label', () => {
		const options = [
			{
				label: 'Featured image',
				value: 'thumbnail',
				groupLabel: 'Media fields',
			},
			{
				label: 'Post title',
				value: 'title',
				searchLabel: 'headline',
			},
			{ label: 'Author email', value: 'author_email' },
		];

		expect(getFilteredOptions(options, 'media')).toEqual([options[0]]);
		expect(getFilteredOptions(options, 'headline')).toEqual([options[1]]);
		expect(getFilteredOptions(options, 'author_email')).toEqual([
			options[2],
		]);
	});
});
