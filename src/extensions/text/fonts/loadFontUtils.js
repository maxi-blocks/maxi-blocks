import { cleanUrl } from './fontCacheUtils';

/**
 * Build the font URL
 * @param {string} fontName - The font name
 * @param {Object} fontData - The font data
 * @returns {Promise<string>} The font URL
 */
export const buildFontUrl = async (fontName, fontData = {}) => {
	// Check if we need to use local fonts
	if (window.maxiBlocksMain?.local_fonts) {
		const encodedFontName = encodeURIComponent(fontName).replace(
			/%20/g,
			'+'
		);

		const response = await fetch(
			`${
				window.wpApiSettings?.root ?? '/wp-json/'
			}maxi-blocks/v1.0/get-font-url/${encodedFontName}`,
			{
				credentials: 'same-origin',
				headers: {
					'X-WP-Nonce': window.wpApiSettings?.nonce,
				},
			}
		);

		if (!response.ok) {
			throw new Error(`HTTP error! status: ${response.status}`);
		}

		const text = await response.text();
		return cleanUrl(text);
	}

	// For remote fonts (Google or Bunny)
	const weight = Array.isArray(fontData.weight)
		? fontData.weight.join(',')
		: fontData.weight || '400';
	const style = fontData.style || 'normal';

	const apiUrl = window.maxiBlocksMain?.bunny_fonts
		? 'https://fonts.bunny.net'
		: 'https://fonts.googleapis.com';

	const fontString =
		style === 'italic'
			? `ital,wght@0,${weight};1,${weight}`
			: `wght@${weight}`;

	const url = `${apiUrl}/css2?family=${encodeURIComponent(
		fontName
	)}:${fontString}&display=swap`;
	return url;
};

/**
 * Check if the URL is valid
 * @param {string} url - The URL to check
 * @returns {Promise<boolean>} True if the URL is valid, false otherwise
 */
export const isCacheValid = async url => {
	if (!url) return false;

	// Check if URL matches current font provider settings
	const isLocalFont = window.maxiBlocksMain?.local_fonts;
	const isBunnyFont = window.maxiBlocksMain?.bunny_fonts;

	// First check the URL pattern
	let isValidPattern = false;
	if (isLocalFont) {
		isValidPattern = url.includes(window.location.origin);
	} else if (isBunnyFont) {
		isValidPattern = url.includes('fonts.bunny.net');
	} else {
		isValidPattern = url.includes('fonts.googleapis.com');
	}

	if (!isValidPattern) return false;

	// Then check if the URL is actually accessible
	try {
		// Using AbortController to cancel the request if it fails
		const controller = new AbortController();
		const timeoutId = setTimeout(() => controller.abort(), 2000); // 2 second timeout

		const response = await fetch(url, {
			method: 'HEAD',
			signal: controller.signal,
			// Prevent the browser from logging failed requests
			cache: 'no-store',
		}).catch(() => ({ ok: false })); // Silently handle network errors

		clearTimeout(timeoutId);
		return response.ok;
	} catch {
		// Silently return false for any errors
		return false;
	}
};
