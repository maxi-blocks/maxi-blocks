import { searchTypesense } from './typesenseClient';

export const searchPatternSuggestions = async (
	query = '',
	{ minChars = 2, fetcher } = {}
) => {
	const trimmed = String(query || '').trim();
	if (!trimmed || trimmed.length < minChars) return [];
	return searchTypesense(trimmed, { minChars, fetcher });
};

export default searchPatternSuggestions;

