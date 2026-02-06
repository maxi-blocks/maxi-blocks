import { MAXI_COLOR_TOKENS } from './maxiColorTokens';

export const buildColorSuggestions = (query = '') => {
	const needle = String(query || '').toLowerCase();
	const matches = MAXI_COLOR_TOKENS.filter(token =>
		token.name.toLowerCase().includes(needle)
	);

	return matches.map(token => ({
		type: 'color',
		label: token.name,
		value: token.var || token.name,
		meta: {
			hex: token.hex || null,
		},
	}));
};
