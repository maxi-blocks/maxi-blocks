import rawAttributes from './maxi-block-attributes.json';
import { buildAliases, inferAttributeType, normalizeAttributeName } from './attributeTypes';
import { normalizePathInput } from './attributePaths';

let cachedDefault = null;

const normalizeEntry = (block, attribute) => {
	const normalized = normalizeAttributeName(attribute);
	return {
		block,
		path: normalized,
		attribute,
		type: inferAttributeType(normalized),
		aliases: buildAliases(normalized),
		normalizedPath: normalizePathInput(normalized),
		default: null,
		allowed: null,
		description: '',
	};
};

export const normalizeAttributes = (data = rawAttributes) => {
	if (data === rawAttributes && cachedDefault) {
		return cachedDefault;
	}

	const blocks = data?.blocks || {};
	const entries = [];

	for (const [block, attributes] of Object.entries(blocks)) {
		if (!Array.isArray(attributes)) continue;
		for (const attribute of attributes) {
			if (!attribute) continue;
			entries.push(normalizeEntry(block, attribute));
		}
	}

	if (data === rawAttributes) {
		cachedDefault = entries;
	}

	return entries;
};

export default normalizeAttributes;
