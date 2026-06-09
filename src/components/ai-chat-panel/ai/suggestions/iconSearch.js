import { searchIcons } from '../icons/iconSearch';

export const searchIconSuggestions = (query = '', { minChars = 2 } = {}) => {
	const trimmed = String(query || '').trim();
	if (!trimmed || trimmed.length < minChars) return [];
	return searchIcons(trimmed);
};

export default searchIconSuggestions;

