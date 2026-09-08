import { ATTRIBUTE_TYPES } from './attributeTypes';
import { normalizeColorValue } from '../color/color.normalize';

const coerceBoolean = value => {
	if (typeof value === 'boolean') return value;
	if (typeof value === 'number') return value !== 0;
	if (typeof value === 'string') {
		const lowered = value.trim().toLowerCase();
		if (['true', '1', 'yes', 'on', 'enable', 'enabled'].includes(lowered)) {
			return true;
		}
		if (['false', '0', 'no', 'off', 'disable', 'disabled'].includes(lowered)) {
			return false;
		}
	}
	return null;
};

const coerceNumber = value => {
	if (typeof value === 'number') return Number.isFinite(value) ? value : null;
	const parsed = parseFloat(value);
	return Number.isFinite(parsed) ? parsed : null;
};

export const normalizeAttributeValue = (spec, value) => {
	if (!spec) return { ok: false, value: null };

	switch (spec.type) {
		case ATTRIBUTE_TYPES.BOOLEAN: {
			const result = coerceBoolean(value);
			return result === null ? { ok: false, value: null } : { ok: true, value: result };
		}
		case ATTRIBUTE_TYPES.NUMBER: {
			const result = coerceNumber(value);
			return result === null ? { ok: false, value: null } : { ok: true, value: result };
		}
		case ATTRIBUTE_TYPES.COLOR: {
			const normalized = normalizeColorValue(value);
			return normalized.ok
				? { ok: true, value: normalized.value, meta: normalized }
				: { ok: false, value: null };
		}
		default:
			return { ok: true, value };
	}
};

export const normalizeAttributesMap = (specMap, attributes) => {
	const normalized = {};
	const errors = [];

	for (const [key, value] of Object.entries(attributes || {})) {
		const spec = specMap[key];
		const result = normalizeAttributeValue(spec, value);
		if (!result.ok) {
			errors.push({ attribute: key, value });
			continue;
		}
		normalized[key] = result.value;
	}

	return { normalized, errors };
};

export default normalizeAttributeValue;
