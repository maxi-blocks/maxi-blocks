import { apiFetch } from '@wordpress/data-controls';

export const updateFonts = fonts => {
	return {
		type: 'UPDATE_FONTS',
		fonts,
	};
};

// Action to set fonts after fetching from JSON
export const setFonts = fonts => ({
	type: 'SET_FONTS',
	fonts,
});

const getFontsUrl = defaultUrl => {
	const linkElement = document.querySelector('#maxi-blocks-block-css');
	const href = linkElement?.getAttribute('href');

	if (href) {
		const pluginsPath = href.substring(0, href.lastIndexOf('/build'));
		return `${pluginsPath}/fonts/fonts.json`;
	}

	return defaultUrl;
};

export function* fetchFonts() {
	const defaultFontsUrl = '/wp-content/plugins/maxi-blocks/fonts/fonts.json';
	const fontsUrl = getFontsUrl(defaultFontsUrl);

	try {
		const response = yield apiFetch({ url: fontsUrl });
		if (typeof response !== 'object') {
			throw new Error('Invalid response format');
		}
		yield setFonts(response);
		return;
	} catch (error) {
		console.error(`Failed to load fonts: ${error.message}`);
	}
}
