/**
 * Wordpress dependencies
 */
import apiFetch from '@wordpress/api-fetch';

const resolvers = {
	getFontUrl:
		(fontName, fontData) =>
		async ({ dispatch }) => {
			// Encode the font name for the URL path
			const encodedFontName = encodeURIComponent(fontName).replace(
				/%20/g,
				'+'
			);

			const fontUrl = await apiFetch({
				path: `/maxi-blocks/v1.0/get-font-url/${encodedFontName}`,
				method: 'GET',
			});

			return dispatch.setFontUrl(fontName, fontData, fontUrl);
		},
};

export default resolvers;
