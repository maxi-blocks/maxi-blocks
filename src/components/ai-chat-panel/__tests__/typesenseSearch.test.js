import { searchTypesense } from '../ai/suggestions/typesenseClient';
import { searchIconSuggestions } from '../ai/suggestions/iconSearch';
import { searchPatternSuggestions } from '../ai/suggestions/patternSearch';

describe('typesense search', () => {
	test('skips short queries', async () => {
		const fetcher = jest.fn();
		const result = await searchTypesense('a', { fetcher, minChars: 2 });
		expect(result).toEqual([]);
		expect(fetcher).not.toHaveBeenCalled();
	});

	test('handles fetch errors gracefully', async () => {
		const fetcher = jest.fn(() => Promise.reject(new Error('fail')));
		const result = await searchTypesense('icon', { fetcher });
		expect(result).toEqual([]);
	});
});

describe('icon/pattern search helpers', () => {
	test('icon search returns empty on short query', () => {
		expect(searchIconSuggestions('a')).toEqual([]);
	});

	test('pattern search returns empty on short query', async () => {
		const result = await searchPatternSuggestions('a');
		expect(result).toEqual([]);
	});
});
