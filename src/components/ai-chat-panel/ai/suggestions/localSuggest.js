import { SUGGESTION_TYPES } from './suggestionTypes';

export const buildLocalSuggestions = (query, registry, { block, limit = 8 } = {}) => {
	if (!registry) return [];
	const matches = registry.findAttribute(query, { block, limit });
	return matches.map(entry => ({
		type: SUGGESTION_TYPES.ATTRIBUTE,
		label: entry.path,
		value: entry.path,
		meta: {
			block: entry.block,
			attribute: entry.attribute,
			kind: entry.type,
		},
	}));
};
