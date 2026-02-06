import { normalizeColorInput } from './colorUtils';
import { findColorToken } from './color.tokens';

export const normalizeColorValue = (value, options = {}) => {
	if (!value) return { ok: false, value: null };

	const token = findColorToken(value);
	if (token) {
		return { ok: true, value: token.value, kind: 'token' };
	}

	const normalized = normalizeColorInput(value, options);
	if (!normalized.value) {
		return { ok: false, value: null };
	}

	return { ok: true, value: normalized.value, kind: normalized.kind };
};

export default normalizeColorValue;
