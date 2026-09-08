import { isMaxiActionEnvelope } from './actions.schema';

const JSON_FENCE = /```json\s*([\s\S]*?)```/i;

const safeParse = source => {
	try {
		return { ok: true, value: JSON.parse(source) };
	} catch (error) {
		return { ok: false, error };
	}
};

export const extractJsonFromText = text => {
	if (typeof text !== 'string') return null;
	const match = text.match(JSON_FENCE);
	if (!match) return null;
	return match[1].trim();
};

export const parseActionEnvelope = text => {
	if (typeof text !== 'string') {
		return { envelope: null, error: 'Invalid input.' };
	}

	const fenced = extractJsonFromText(text);
	if (fenced) {
		const parsed = safeParse(fenced);
		if (!parsed.ok) {
			return { envelope: null, error: 'Invalid JSON.' };
		}
		return {
			envelope: parsed.value,
			error: isMaxiActionEnvelope(parsed.value) ? null : 'Invalid action envelope.',
		};
	}

	const trimmed = text.trim();
	if (trimmed.startsWith('{') && trimmed.endsWith('}')) {
		const parsed = safeParse(trimmed);
		if (!parsed.ok) {
			return { envelope: null, error: 'Invalid JSON.' };
		}
		return {
			envelope: parsed.value,
			error: isMaxiActionEnvelope(parsed.value) ? null : 'Invalid action envelope.',
		};
	}

	return { envelope: null, error: 'No JSON actions found.' };
};

export default parseActionEnvelope;
