import { ATTRIBUTE_TYPES } from '../attributes/attributeTypes';
import { normalizeColorInput } from '../color/colorUtils';
import { errorMessages } from './errorMessages';

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

export const normalizeValueForEntry = (entry, value) => {
	if (!entry) {
		return { ok: false, value: null, error: errorMessages.unknownAttribute('') };
	}

	switch (entry.type) {
		case ATTRIBUTE_TYPES.BOOLEAN: {
			const result = coerceBoolean(value);
			if (result === null) {
				return { ok: false, value: null, error: errorMessages.invalidValue(entry.path, value) };
			}
			return { ok: true, value: result };
		}
		case ATTRIBUTE_TYPES.NUMBER: {
			const result = coerceNumber(value);
			if (result === null) {
				return { ok: false, value: null, error: errorMessages.invalidValue(entry.path, value) };
			}
			return { ok: true, value: result };
		}
		case ATTRIBUTE_TYPES.COLOR: {
			const normalized = normalizeColorInput(value);
			if (!normalized.value) {
				return { ok: false, value: null, error: errorMessages.invalidValue(entry.path, value) };
			}
			return { ok: true, value: normalized.value, meta: normalized };
		}
		case ATTRIBUTE_TYPES.ICON:
		case ATTRIBUTE_TYPES.UNIT:
		case ATTRIBUTE_TYPES.STRING:
		default:
			return { ok: true, value: value };
	}
};

export const validateOp = (op, entry) => {
	if (!entry) {
		return { ok: false, error: errorMessages.unknownAttribute(op?.path || '') };
	}

	switch (op?.op) {
		case 'set': {
			const result = normalizeValueForEntry(entry, op.value);
			return result.ok ? { ok: true, value: result.value, meta: result.meta } : result;
		}
		case 'reset':
			return { ok: true };
		case 'toggle':
			if (entry.type !== ATTRIBUTE_TYPES.BOOLEAN) {
				return { ok: false, error: errorMessages.invalidValue(entry.path, op.value) };
			}
			return { ok: true };
		case 'increment': {
			const amount = coerceNumber(op.amount);
			if (amount === null) {
				return { ok: false, error: errorMessages.invalidValue(entry.path, op.amount) };
			}
			return { ok: true, amount };
		}
		case 'merge':
		case 'add':
		case 'remove':
			return { ok: true };
		default:
			return { ok: false, error: errorMessages.unsupportedOperation(op?.op) };
	}
};

export default validateOp;
