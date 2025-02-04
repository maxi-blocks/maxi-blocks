const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours

// Cache for font URLs
export const fontUrlCache = new Map();

export const getStorageCache = (key) => {
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

export const setStorageCache = (key, value) => {
	try {
		localStorage.setItem(`maxi_font_${key}`, JSON.stringify({
			value,
			timestamp: Date.now()
		}));
	} catch (e) {
		// Storage full or other error, just continue
	}
};

export const cleanUrl = url => {
	if (typeof url !== 'string') return url;

	// First, clean basic formatting
	let cleanedUrl = url
		.trim()
		.replace(/^["']+|["']+$/g, '') // Remove quotes
		.replace(/\\/g, '')            // Remove backslashes
		.replace(/\/+/g, '/')          // Fix multiple slashes
		.replace(/\$fontData/, '');    // Remove any $fontData placeholder

	// Fix double domain issue for local fonts
	const origin = window.location.origin;
	if (cleanedUrl.includes(origin + '/' + origin.replace(/^https?:\/\//, ''))) {
		cleanedUrl = cleanedUrl.replace(origin + '/', '');
	}

	// Ensure proper protocol
	if (cleanedUrl.startsWith('http:/')) {
		cleanedUrl = cleanedUrl.replace('http:/', 'http://');
	}
	if (cleanedUrl.startsWith('https:/')) {
		cleanedUrl = cleanedUrl.replace('https:/', 'https://');
	}

	return cleanedUrl;
};
