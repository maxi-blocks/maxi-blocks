/**
 * WordPress dependencies
 */
import apiFetch from '@wordpress/api-fetch';

// Cache for font URLs and active timers
const fontUrlCache = new Map();
const pendingRequests = new Map();
const activeTimers = new Set();
const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours

const originalApiFetch = apiFetch;

// Add browser localStorage cache
const getStorageCache = (key) => {
	try {
		const item = localStorage.getItem(`maxi_font_${key}`);
		if (!item) return null;
		const { value, timestamp } = JSON.parse(item);
		if (Date.now() - timestamp < CACHE_DURATION) {
			return value;
		}
		localStorage.removeItem(`maxi_font_${key}`);
	} catch (e) {
		return null;
	}
	return null;
};

const setStorageCache = (key, value) => {
	try {
		localStorage.setItem(`maxi_font_${key}`, JSON.stringify({
			value,
			timestamp: Date.now()
		}));
	} catch (e) {
		// Storage full or other error, just continue
	}
};

const cleanUrl = (url) => {
	// Remove quotes and any potential whitespace
	return url.replace(/^[\s"']+(.*?)[\s"']+$/, '$1');
};

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

const safeConsoleTime = (label) => {
	if (!activeTimers.has(label)) {
		console.time(label);
		activeTimers.add(label);
	}
};

const safeConsoleTimeEnd = (label) => {
	if (activeTimers.has(label)) {
		console.timeEnd(label);
		activeTimers.delete(label);
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
