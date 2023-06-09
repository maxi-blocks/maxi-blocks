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
		console.log('SAVE_STYLES');
		console.log(isUpdate);
		console.log(styles);
		entityRecordsWrapper(async ({ key: id, name }) => {
			const filteredStyles = getFilteredData(styles, { id, name });
			const parsedStyles = await processCss(
				frontendStyleGenerator(filteredStyles)
			);
			const fonts = select('maxiBlocks/text').getPostFonts();

			await apiFetch({
				path: '/maxi-blocks/v1.0/styles',
				method: 'POST',
				data: {
					id,
					meta: JSON.stringify({
						styles: parsedStyles,
						fonts,
					}),
					update: isUpdate,
					isTemplate: getIsSiteEditor(),
					templateParts: JSON.stringify(
						name === 'wp_template' ? getTemplatePartsIds() : null
					),
					templatePart: name === 'wp_template_part' ? id : null,
				},
			}).catch(err => {
				console.error('Error saving styles. Code error: ', err);
			});
		});
	},
};

export default controls;
