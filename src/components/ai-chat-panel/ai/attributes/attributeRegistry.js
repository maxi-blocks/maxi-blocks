import rawAttributes from './maxi-block-attributes.json';
import normalizeAttributes from './normalizeAttributes';
import { normalizePathInput, toAttributeKey } from './attributePaths';

let cachedRegistry = null;

const scoreMatch = (query, entry) => {
	const normalizedQuery = normalizePathInput(query);
	if (!normalizedQuery) return 0;

	if (entry.normalizedPath === normalizedQuery) return 100;
	if (entry.normalizedPath.startsWith(normalizedQuery)) return 90;
	if (entry.normalizedPath.includes(normalizedQuery)) return 70;
	if (entry.aliases && entry.aliases.includes(normalizedQuery)) return 60;

	const tokens = normalizedQuery.split('-');
	const tokenHits = tokens.filter(token => entry.normalizedPath.includes(token)).length;
	if (tokenHits) return 40 + tokenHits;

	return 0;
};

const buildIndex = attributes => {
	const byBlock = new Map();
	const byBlockPath = new Map();
	const byPath = new Map();
	const entries = [];

	for (const entry of attributes) {
		entries.push(entry);

		const blockEntries = byBlock.get(entry.block) || [];
		blockEntries.push(entry);
		byBlock.set(entry.block, blockEntries);

		const blockKey = `${entry.block}::${entry.path}`;
		byBlockPath.set(blockKey, entry);

		const pathEntries = byPath.get(entry.path) || [];
		pathEntries.push(entry);
		byPath.set(entry.path, pathEntries);
	}

	return { entries, byBlock, byBlockPath, byPath };
};

export const createAttributeRegistry = attributes => {
	const index = buildIndex(attributes);

	const getAttributesForBlock = blockName => index.byBlock.get(blockName) || [];

	const findAttribute = (query, options = {}) => {
		const { block, limit = 8 } = options;
		const pool = block ? getAttributesForBlock(block) : index.entries;
		const scored = [];

		for (const entry of pool) {
			const score = scoreMatch(query, entry);
			if (score > 0) {
				scored.push({ entry, score });
			}
		}

		scored.sort((a, b) => b.score - a.score);
		return scored.slice(0, limit).map(item => item.entry);
	};

	const resolveAttribute = (pathInput, options = {}) => {
		const { block } = options;
		if (!pathInput) {
			return { entry: null, matches: [] };
		}

		const normalized = normalizePathInput(pathInput);
		const fallbackKey = toAttributeKey(pathInput);

		if (block) {
			const direct = index.byBlockPath.get(`${block}::${normalized}`);
			if (direct) return { entry: direct, matches: [direct] };
			const fallback = index.byBlockPath.get(`${block}::${fallbackKey}`);
			if (fallback) return { entry: fallback, matches: [fallback] };
		}

		const matches = index.byPath.get(normalized) || index.byPath.get(fallbackKey);
		if (matches && matches.length) {
			return { entry: matches[0], matches };
		}

		const fuzzyMatches = findAttribute(pathInput, options);
		return { entry: fuzzyMatches[0] || null, matches: fuzzyMatches };
	};

	const pickDefaultAttribute = (block, { type } = {}) => {
		const entries = getAttributesForBlock(block);
		if (!entries.length) return null;

		if (!type) return entries[0] || null;

		const filtered = entries.filter(entry => entry.type === type);
		if (!filtered.length) return null;
		filtered.sort((a, b) => a.path.length - b.path.length);
		return filtered[0] || null;
	};

	return {
		attributes: index.entries,
		getAttributesForBlock,
		findAttribute,
		resolveAttribute,
		pickDefaultAttribute,
		total: index.entries.length,
	};
};

export const buildAttributeRegistry = (data = rawAttributes) =>
	createAttributeRegistry(normalizeAttributes(data));

export const getDefaultAttributeRegistry = () => {
	if (!cachedRegistry) {
		cachedRegistry = buildAttributeRegistry(rawAttributes);
	}
	return cachedRegistry;
};

export default buildAttributeRegistry;
