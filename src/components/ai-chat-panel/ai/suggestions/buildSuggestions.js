import { buildColorSuggestions } from '../color/colorSuggest';
import { buildIconSuggestions } from '../icons/iconSuggest';
import { buildLocalSuggestions } from './localSuggest';
import { searchTypesense } from './typesenseClient';

const dedupe = list => {
	const seen = new Set();
	return list.filter(item => {
		const key = `${item.type}:${item.value}`;
		if (seen.has(key)) return false;
		seen.add(key);
		return true;
	});
};

export const buildSuggestions = async (query, registry, context = {}) => {
	const { block, includeTypesense = false } = context;

	const local = buildLocalSuggestions(query, registry, { block, limit: 8 });
	const colors = buildColorSuggestions(query);
	const icons = buildIconSuggestions(query);

	let typesense = [];
	if (includeTypesense) {
		typesense = await searchTypesense(query);
	}

	return dedupe([...local, ...colors, ...icons, ...typesense]);
};

export default buildSuggestions;
