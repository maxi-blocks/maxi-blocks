const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours

// Cache for font URLs
export const fontUrlCache = new Map();

/**
 * Get the cached value from localStorage
 * @param {string} key - The key to get the cached value from
 * @returns {string | null} The cached value or null if it doesn't exist
 */
export const getStorageCache = key => {
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

/**
 * Set the cached value in localStorage
 * @param {string} key   - The key to set the cached value in
 * @param {string} value - The value to set in the cache
 */
export const setStorageCache = (key, value) => {
	try {
		localStorage.setItem(
			`maxi_font_${key}`,
			JSON.stringify({
				value,
				timestamp: Date.now(),
			})
		);
	} catch (e) {
		// Storage full or other error, just continue
	}
};

/**
 * Clean the URL
 * @param {string} url - The URL to clean
 * @returns {string} The cleaned URL
 */
export const cleanUrl = url => {
	if (typeof url !== 'string') return url;
	// First, clean basic formatting
	let cleanedUrl = url
		.trim()
		.replace(/^["']+|["']+$/g, '') // Remove quotes
		.replace(/\\/g, '') // Remove backslashes
		.replace(/\/+/g, '/') // Fix multiple slashes
		.replace(/\$fontData/, ''); // Remove any $fontData placeholder

	// Ensure proper protocol
	if (cleanedUrl.startsWith('http:/')) {
		cleanedUrl = cleanedUrl.replace('http:/', 'http://');
	}
	if (cleanedUrl.startsWith('https:/')) {
		cleanedUrl = cleanedUrl.replace('https:/', 'https://');
	}

	// Fix double domain issue for local fonts
	const { origin } = window.location;
	const originWithoutProtocol = origin.replace(/^https?:\/\//, '');
	if (cleanedUrl.includes(`${origin}/${originWithoutProtocol}`)) {
		cleanedUrl = cleanedUrl.replace(`${originWithoutProtocol}/`, '');
	}

	return cleanedUrl;
};
