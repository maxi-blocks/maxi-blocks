/**
 * Wordpress dependencies
 */
import apiFetch from '@wordpress/api-fetch';

const resolvers = {
	getFontUrl:
		(fontName, fontData) =>
		async ({ dispatch }) => {
			const fontUrl = JSON.parse(
				await apiFetch({
					path: '/maxi-blocks/v1.0/get-font-url',
					method: 'GET',
				})
			);

			return dispatch.setFontUrl(fontName, fontData, fontUrl);
		},
};

export default resolvers;
