/**
 * POST to Maxi AI chat REST endpoint and return parsed JSON.
 *
 * @param {Object} body Request body: messages, model, temperature, streaming, etc.
 * @returns {Promise<Object>} Parsed JSON body from the API.
 */
export async function requestAiChatCompletion(body) {
	const root =
		typeof window !== 'undefined' && window.wpApiSettings?.root
			? window.wpApiSettings.root
			: '/wp-json/';
	const url = `${root}maxi-blocks/v1.0/ai/chat`;
	const headers = {
		'Content-Type': 'application/json',
		...(typeof window !== 'undefined' && window.wpApiSettings?.nonce
			? { 'X-WP-Nonce': window.wpApiSettings.nonce }
			: {}),
	};

	const response = await fetch(url, {
		method: 'POST',
		headers,
		body: JSON.stringify(body),
	});

	if (!response.ok) {
		throw new Error(await response.text());
	}

	return response.json();
}
