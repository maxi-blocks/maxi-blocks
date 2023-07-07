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
import frontendStyleGenerator from '../frontendStyleGenerator';
import { getIsSiteEditor, getTemplatePartsIds } from '../../fse';
import entityRecordsWrapper from '../entityRecordsWrapper';
import getFilteredData from '../getFilteredData';

export const processCss = async code => {
	if (!code) return null;

	const { css } = postcss([autoprefixer]).process(code);
	if (!css) return null;

	const minifiedCss = minifyCssString(css);

	return minifiedCss;
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
					const { styleID } = blockStyle[1];
					parsedStyles[styleID] = await processCss(
						frontendStyleGenerator(blockStyle)
					);
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
