import { getBlockAttributeSpec, getAllowedAttributes } from './attributes.catalog';
import { normalizeAttributeValue } from './attributes.normalize';
import { normalizeAttributeName } from './attributeTypes';

export const validateAttributesForBlock = (blockName, attributes = {}) => {
	const errors = [];
	const normalized = {};
	const allowed = new Set(getAllowedAttributes(blockName));

	for (const [rawKey, value] of Object.entries(attributes)) {
		const key = normalizeAttributeName(rawKey);
		if (!allowed.has(key)) {
			errors.push({ attribute: rawKey, reason: 'unknown' });
			continue;
		}

		const spec = getBlockAttributeSpec(blockName, key);
		const result = normalizeAttributeValue(spec, value);
		if (!result.ok) {
			errors.push({ attribute: rawKey, reason: 'invalid', value });
			continue;
		}
		normalized[key] = result.value;
	}

	return { ok: errors.length === 0, errors, normalized };
};

export default validateAttributesForBlock;
