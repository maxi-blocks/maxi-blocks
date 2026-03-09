export const searchTypesense = async (
	query,
	{ minChars = 2, fetcher = null } = {}
) => {
	const trimmed = String(query || '').trim();
	if (!trimmed || trimmed.length < minChars) {
		return [];
	}

	const runFetch = fetcher || (typeof fetch !== 'undefined' ? fetch : null);
	if (!runFetch) return [];

	try {
		const response = await runFetch('/typesense/search', {
			method: 'POST',
			body: JSON.stringify({ q: trimmed }),
			headers: { 'Content-Type': 'application/json' },
		});
		if (!response || !response.ok) return [];
		const payload = await response.json();
		return payload?.hits || [];
	} catch (error) {
		return [];
	}
};

export default { searchTypesense };

