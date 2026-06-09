import { findTokenByName, findTokenForHex } from './maxiColorTokens';

const HEX_3 = /^#([0-9a-f]{3})$/i;
const HEX_6 = /^#([0-9a-f]{6})$/i;

export const isHexColor = value => HEX_3.test(value) || HEX_6.test(value);

export const normalizeHex = value => {
	if (!value) return null;
	if (HEX_6.test(value)) return value.toLowerCase();
	const match = value.match(HEX_3);
	if (!match) return null;
	const [r, g, b] = match[1].split('');
	return `#${r}${r}${g}${g}${b}${b}`.toLowerCase();
};

export const isCssVar = value =>
	typeof value === 'string' && value.trim().startsWith('var(--maxi-');

export const isTokenName = value => {
	if (typeof value !== 'string') return false;
	if (isCssVar(value)) return true;
	if (value.startsWith('--maxi-')) return true;
	if (value.startsWith('maxi-')) return true;
	if (/^[a-z]+-\d{2,3}$/i.test(value)) return true;
	return Boolean(findTokenByName(value));
};

export const normalizeColorInput = (input, { preferTokens = true } = {}) => {
	if (!input) {
		return { value: null, kind: 'empty' };
	}

	const trimmed = String(input).trim();

	if (isCssVar(trimmed)) {
		return { value: trimmed, kind: 'var' };
	}

	if (isTokenName(trimmed)) {
		const token = findTokenByName(trimmed);
		return { value: token ? token.var || token.name : trimmed, kind: 'token' };
	}

	if (isHexColor(trimmed)) {
		const normalized = normalizeHex(trimmed);
		if (preferTokens) {
			const token = findTokenForHex(normalized);
			if (token) {
				return { value: token.var || token.name, kind: 'token' };
			}
		}
		return { value: normalized, kind: 'rawHex' };
	}

	return { value: trimmed, kind: 'raw' };
};
