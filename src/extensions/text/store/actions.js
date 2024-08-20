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
	const maxRetries = 3;
	let retries = 0;

	while (retries < maxRetries) {
		try {
			const response = yield apiFetch({ url: fontsUrl });

			if (typeof response !== 'object') {
				throw new Error('Invalid response format: not an object');
			}

			yield setFonts(response);
			return;
		} catch (error) {
			console.error(`Attempt ${retries + 1} failed:`, error);
			console.error('Error details:', {
				message: error.message,
				stack: error.stack,
				response: error.response,
			});

			retries++;
			if (retries < maxRetries) {
				yield new Promise(resolve =>
					setTimeout(resolve, retries * 2000)
				);
			}
		}
	}

	console.error(`Failed to load fonts after ${maxRetries} attempts`);
}
