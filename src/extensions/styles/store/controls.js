/**
 * WordPress dependencies
 */
import apiFetch from '@wordpress/api-fetch';
import { select } from '@wordpress/data';

/**
 * External dependencies
 */
import autoprefixer from 'autoprefixer';
import minifyCssString from 'minify-css-string';
import postcss from 'postcss';

/**
 * Internal dependencies
 */
import frontendStyleGenerator from '@extensions/styles/frontendStyleGenerator';
import entityRecordsWrapper from '@extensions/styles/entityRecordsWrapper';

export const processCss = async code => {
	if (!code) return null;

	try {
		const { css } = postcss([autoprefixer]).process(code);
		if (!css) return null;

		const minifiedCss = minifyCssString(css);

		return minifiedCss;
	} catch (error) {
		console.error('Error processing CSS:', error);
		console.error('Problematic code:', code);
		throw error;
	}
};

/**
 * Controls
 */
const controls = {
	SAVE_STYLES({ isUpdate, styles }) {
		entityRecordsWrapper(async ({ key: id, name }) => {
			const parsedStyles = {};
			const blockStyles = Object.entries(styles);

			await Promise.all(
				blockStyles.map(async blockStyle => {
					const { uniqueID } = blockStyle[1];
					if (uniqueID.includes('svg-')) {
						console.log('uniqueID', uniqueID);
						console.log('blockStyle', blockStyle);
					}
					const processedStyle = await processCss(
						frontendStyleGenerator(blockStyle)
					);

					// Check if the uniqueID already exists in parsedStyles
					// If it does, concatenate the styles; otherwise, assign the processedStyle
					if (parsedStyles[uniqueID]) {
						parsedStyles[uniqueID] += processedStyle;
					} else {
						parsedStyles[uniqueID] = processedStyle;
					}
				})
			);

			const fonts = select('maxiBlocks/text').getPostFonts();

			await apiFetch({
				path: '/maxi-blocks/v1.0/styles',
				method: 'POST',
				data: {
					styles: JSON.stringify(parsedStyles),
					meta: JSON.stringify({
						fonts,
					}),
					update: isUpdate,
				},
			}).catch(err => {
				console.error('Error saving styles. Code error: ', err);
			});
		});
	},
};

export default controls;
