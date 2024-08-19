import { apiFetch } from '@wordpress/data-controls';

export const updateFonts = fonts => {
	return {
		type: 'UPDATE_FONTS',
		fonts,
	};
};

export const setFontUrl = (fontName, fontData, url) => {
	if (Array.isArray(fontData.weight)) {
		fontData.weight = fontData.weight.join();
	}

	const name = fontName + fontData.style + fontData.weight;
	return {
		type: 'SET_FONT_URL',
		name,
		url,
	};
};

// Action to set fonts after fetching from JSON
export const setFonts = fonts => ({
	type: 'SET_FONTS',
	fonts,
});

// Generator function to fetch fonts using data-controls
export function* fetchFonts() {
	try {
		const defaultFontsUrl =
			'/wp-content/plugins/maxi-blocks/fonts/fonts.json';
		let fontsUrl = defaultFontsUrl;

		const linkElement = document.querySelector('#maxi-blocks-block-css');
		const href = linkElement?.getAttribute('href');

		if (href) {
			const pluginsPath = href.substring(0, href.lastIndexOf('/build'));
			fontsUrl = `${pluginsPath}/fonts/fonts.json`;
		}

		const fonts = yield apiFetch({ url: fontsUrl });
		yield setFonts(fonts);
	} catch (error) {
		console.error('Failed to load fonts:', error);
	}
}
