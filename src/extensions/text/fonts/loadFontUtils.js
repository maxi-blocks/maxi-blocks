import { cleanUrl } from './fontCacheUtils';

/**
 * Build the font URL
 * @param {string} fontName - The font name
 * @param {Object} fontData - The font data
 * @returns {Promise<string>} The font URL
 */
const buildFontUrl = async (fontName, fontData = {}) => {
	// Check if we need to use local fonts
	if (window.maxiBlocksMain?.local_fonts) {
		const encodedFontName = encodeURIComponent(fontName).replace(
			/%20/g,
			'+'
		);

		const response = await fetch(
			`${
				window.wpApiSettings?.root ??
				window.maxiStarterSites?.apiRoot ??
				window.maxiBlocksMain?.apiRoot ??
				`${window.location.origin}/wp-json/`
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

export default buildFontUrl;
