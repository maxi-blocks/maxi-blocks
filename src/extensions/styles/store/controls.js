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
import { MemoCache } from '@extensions/maxi-block/memoizationHelper';

/**
 * Cache for processCss results
 */
const PROCESS_CSS_CACHE_MAX_SIZE = 25;
const MAX_PROCESS_CSS_CACHE_KEY_LENGTH = 20000;
const processCssCache = new MemoCache(PROCESS_CSS_CACHE_MAX_SIZE);

export const processCss = async code => {
	if (!code) return null;
	const canCache =
		typeof code === 'string' &&
		code.length <= MAX_PROCESS_CSS_CACHE_KEY_LENGTH;

	// Check cache first
	if (canCache) {
		const cachedCss = processCssCache.get(code);
		if (cachedCss !== undefined) {
			return cachedCss;
		}
	}

	try {
		const { css } = postcss([
			autoprefixer({
				flexbox: 'no-2009',
				grid: 'autoplace',
				overrideBrowserslist: ['last 2 versions', '> 0.5%', 'not dead'],
			}),
		]).process(code);

		if (!css) return null;

		const minifiedCss = minifyCssString(css);

		// Store in cache
		if (canCache) {
			processCssCache.set(code, minifiedCss);
		}

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
