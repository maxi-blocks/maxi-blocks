import rawAttributes from './maxi-block-attributes.json';
import { inferAttributeType, normalizeAttributeName } from './attributeTypes';

const cache = new Map();

const normalizeBlockName = blockName => {
	if (!blockName) return '';
	const name = String(blockName);
	if (name.includes('/')) {
		const base = name.split('/').pop();
		return base.includes('-maxi') ? base : `${base}-maxi`;
	}
	return name;
};

const buildCatalog = (data = rawAttributes) => {
	const blocks = data?.blocks || {};
	const catalog = {};

	for (const [block, attrs] of Object.entries(blocks)) {
		if (!Array.isArray(attrs)) continue;
		catalog[block] = attrs.map(attr => {
			const normalized = normalizeAttributeName(attr);
			return {
				block,
				name: normalized,
				original: attr,
				type: inferAttributeType(normalized),
			};
		});
	}

	return catalog;
};

const getCatalog = () => {
	if (!cache.has('catalog')) {
		cache.set('catalog', buildCatalog(rawAttributes));
	}
	return cache.get('catalog');
};

export const getAllowedAttributes = blockName => {
	const catalog = getCatalog();
	const key = normalizeBlockName(blockName);
	return catalog[key] ? catalog[key].map(entry => entry.name) : [];
};

export const getBlockAttributeSpec = (blockName, attrName) => {
	const catalog = getCatalog();
	const key = normalizeBlockName(blockName);
	const normalizedAttr = normalizeAttributeName(attrName);
	const entries = catalog[key] || [];
	return (
		entries.find(entry => entry.name === normalizedAttr) ||
		null
	);
};

export const isAllowedAttribute = (blockName, attrName) =>
	Boolean(getBlockAttributeSpec(blockName, attrName));

export const getCatalogSnapshot = () => getCatalog();

export default {
	getAllowedAttributes,
	getBlockAttributeSpec,
	isAllowedAttribute,
	getCatalogSnapshot,
};
