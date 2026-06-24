import rawAttributes from './maxi-block-attributes.json';
import normalizeAttributes from './normalizeAttributes';
import buildAttributeRegistry from './attributeRegistry';

export const buildCoverageReport = (data = rawAttributes) => {
	const normalized = normalizeAttributes(data);
	const registry = buildAttributeRegistry(data);
	const missing = [];

	for (const entry of normalized) {
		const resolved = registry.resolveAttribute(entry.path, { block: entry.block });
		if (!resolved.entry) {
			missing.push({ block: entry.block, attribute: entry.attribute });
		}
	}

	return {
		total: normalized.length,
		registered: registry.total,
		missing,
	};
};

export default buildCoverageReport;
