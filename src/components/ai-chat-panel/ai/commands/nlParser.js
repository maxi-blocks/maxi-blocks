export const parseNaturalLanguage = input => {
	if (typeof input !== 'string') return null;
	const trimmed = input.trim();
	if (!trimmed) return null;

	const lower = trimmed.toLowerCase();

	const setMatch = lower.match(/^(set|make)\s+(.+?)\s+(to|as)\s+(.+)$/);
	if (setMatch) {
		return {
			kind: 'nl',
			action: 'set',
			attributeHint: setMatch[2],
			valueHint: setMatch[4],
			raw: trimmed,
		};
	}

	const toggleMatch = lower.match(/^(toggle|enable|disable)\s+(.+)$/);
	if (toggleMatch) {
		return {
			kind: 'nl',
			action: 'toggle',
			attributeHint: toggleMatch[2],
			valueHint: toggleMatch[1],
			raw: trimmed,
		};
	}

	const incMatch = lower.match(/^(increase|decrease)\s+(.+?)(?:\s+by\s+(.+))?$/);
	if (incMatch) {
		return {
			kind: 'nl',
			action: 'increment',
			attributeHint: incMatch[2],
			amount: incMatch[3] || (incMatch[1] === 'increase' ? '1' : '-1'),
			raw: trimmed,
		};
	}

	return {
		kind: 'nl',
		action: 'unknown',
		raw: trimmed,
	};
};

export default parseNaturalLanguage;
