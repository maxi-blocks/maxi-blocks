/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { dispatch, select } from '@wordpress/data';

/**
 * Prepares the styles to be ready for JS FontFace API
 *
 * @param {obj} variant Concrete variant of the font with name and url
 * @returns {obj} Styles options for load the font on FontFace API
 */
const getFontStyle = variant => {
	const styles = variant.split(/([0-9]+)/).filter(Boolean);
	if (styles.length > 1) {
		return {
			style: `${styles[1]}`,
			weight: `${styles[0]}`,
		};
	}
	const regExp = new RegExp('([0-9]+)', 'gm');
	if (styles[0].search(regExp) >= 0) {
		// number
		return { weight: `${styles[0]}` };
	}
	return { style: `${styles[0]}` };
};

/**
 * Loads the font on background using JS FontFace API
 * FontFaceSet API uses check() to check if a font exists, but needs to compare with some exact value:
 * in this case is used '12px' as a standard that returns if the font has been loaded.
 *
 * @param {string} font Name of the selected font
 */
const loadFonts = font => {
	if (typeof font === 'object' && font !== null) {
		Object.entries(font).forEach(([key, val]) => {
			const fontName = key;
			const fontWeight = val?.weight;
			const fontStyle = val?.style;

			const style = val;

			const { files } = select('maxiBlocks/text').getFont(fontName);
			Object.entries(files).forEach(variant => {
				const fontLoad = new FontFace(
					font,
					`url(${variant[1]})`,
					style
				);
				document.fonts.add(fontLoad);
				fontLoad.loaded.catch(err => {
					console.error(
						__(`Font hasn't been able to download: ${err}`)
					);
				});
			});
		});
		dispatch('maxiBlocks/text').updateFonts(JSON.stringify(font));
	}

	return null;
};

export default loadFonts;
