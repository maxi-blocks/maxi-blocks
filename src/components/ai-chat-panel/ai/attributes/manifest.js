import rawAttributes from './maxi-block-attributes.json';
import { buildAliases, inferAttributeType, normalizeAttributeName } from './attributeTypes';

const splitTokens = value =>
	String(value || '')
		.replace(/[_./]/g, '-')
		.replace(/([a-z0-9])([A-Z])/g, '$1-$2')
		.split(/[-\s]+/g)
		.filter(Boolean);

const buildTriggers = name => {
	const tokens = splitTokens(name);
	if (!tokens.length) return [];
	const phrase = tokens.join(' ');
	const reverse = tokens.slice().reverse().join(' ');
	const aliases = buildAliases(name);
	return Array.from(new Set([phrase, reverse, ...aliases]));
};

export const buildAttributeManifest = (data = rawAttributes) => {
	const manifest = new Map();
	const blocks = data?.blocks || {};

	for (const [block, attributes] of Object.entries(blocks)) {
		if (!Array.isArray(attributes)) continue;
		for (const attribute of attributes) {
			const normalized = normalizeAttributeName(attribute);
			const key = `${block}::${normalized}`;
			manifest.set(key, {
				block,
				name: normalized,
				type: inferAttributeType(normalized),
				triggers: buildTriggers(normalized),
			});
		}
	}

	return manifest;
};

export const getAttributeManifestEntry = (block, name, manifest) => {
	const normalized = normalizeAttributeName(name);
	const key = `${block}::${normalized}`;
	return (manifest || buildAttributeManifest()).get(key) || null;
};

export default buildAttributeManifest;
