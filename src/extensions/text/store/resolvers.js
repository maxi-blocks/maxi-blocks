/**
 * Internal dependencies
 */
import {
	fontUrlCache,
	getStorageCache,
	setStorageCache,
	cleanUrl,
} from '@extensions/text/fonts/fontCacheUtils';

const fetchFontUrl = async encodedFontName => {
	const response = await fetch(
		`/wp-json/maxi-blocks/v1.0/get-font-url/${encodedFontName}`,
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
	const cleanedUrl = cleanUrl(text);

	// Validate URL
	if (!URL.canParse(cleanedUrl)) {
		console.error('Invalid URL received:', text);
		throw new Error('Invalid font URL received from server');
	}
	return cleanedUrl;
};

const resolvers = {
	getFontUrl:
		(fontName, fontData) =>
		async ({ dispatch }) => {
			const encodedFontName = encodeURIComponent(fontName).replace(
				/%20/g,
				'+'
			);

			const promise = (async () => {
				try {
					const fontUrl = await fetchFontUrl(encodedFontName);

					dispatch.setFontUrl(fontName, fontData, fontUrl);
					return fontUrl;
				} catch (error) {
					console.error('Error fetching font URL:', error);
					throw error;
				}
			})();

			return promise;
		},
};

export default resolvers;
