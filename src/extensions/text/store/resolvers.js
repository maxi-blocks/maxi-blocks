/**
 * WordPress dependencies
 */
import apiFetch from '@wordpress/api-fetch';

/**
 * Internal dependencies
 */
import { fontUrlCache, getStorageCache, setStorageCache, cleanUrl } from '../fonts/fontCacheUtils';

// Cache for font URLs and active timers
const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours

const originalApiFetch = apiFetch;

const fetchFontUrl = async (encodedFontName) => {
	const response = await fetch(`/wp-json/maxi-blocks/v1.0/get-font-url/${encodedFontName}`, {
		credentials: 'same-origin',
		headers: {
			'X-WP-Nonce': window.wpApiSettings?.nonce,
		}
	});

	if (!response.ok) {
		throw new Error(`HTTP error! status: ${response.status}`);
	}

	const text = await response.text();
	const cleanedUrl = cleanUrl(text);

	// Validate URL
	try {
		new URL(cleanedUrl);
		return cleanedUrl;
	} catch (e) {
		console.error('Invalid URL received:', text);
		throw new Error('Invalid font URL received from server');
	}
};

const resolvers = {
	getFontUrl:
		(fontName, fontData) =>
		async ({ dispatch }) => {
			const requestKey = `${fontName}-${JSON.stringify(fontData)}`;

			// Try to get from cache first
			const cached = fontUrlCache.get(requestKey) || getStorageCache(requestKey);
			if (cached) {
				dispatch.setFontUrl(fontName, fontData, cached);
				return cached;
			}

			// Check for pending request
			if (pendingRequests.has(requestKey)) {
				return pendingRequests.get(requestKey);
			}

			const encodedFontName = encodeURIComponent(fontName).replace(/%20/g, '+');

			const promise = (async () => {
				try {
					const fontUrl = await fetchFontUrl(encodedFontName);

					// Cache the successful response
					fontUrlCache.set(requestKey, fontUrl);
					setStorageCache(requestKey, fontUrl);

					dispatch.setFontUrl(fontName, fontData, fontUrl);
					return fontUrl;
				} finally {
					pendingRequests.delete(requestKey);
				}
			})();

			pendingRequests.set(requestKey, promise);
			return promise;
		},
};

export default resolvers;
