import { searchIcons } from './iconSearch';

export const buildIconSuggestions = (query = '') => {
	const results = searchIcons(query);
	return results.map(icon => ({
		type: 'icon',
		label: icon.name,
		value: icon.name,
		meta: {
			category: icon.category,
		},
	}));
};
