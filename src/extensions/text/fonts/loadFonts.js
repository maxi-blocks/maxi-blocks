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
	// !document.fonts.check(`12px ${font})` with this condition Font Selector have a problem in Firefox(Windows)
	// so we should find a solution for it in future now with removing it the problem will fix temporary :)
	if (font && document.fonts /* && !document.fonts.check(`12px ${font}`) */) {
		const { files } = select('maxiBlocks/text').getFont(font);

		// FontFace API
		Object.entries(files).forEach(variant => {
			const style = getFontStyle(variant[0]);

			//	console.log(`style: ${JSON.stringify(style)}`);
			const fontLoad = new FontFace(font, `url(${variant[1]})`, style);
			document.fonts.add(fontLoad);
			fontLoad.loaded.catch(err => {
				console.error(__(`Font hasn't been able to download: ${err}`));
			});
		});
		//	console.log(`font: ${JSON.stringify(font)}`);
		dispatch('maxiBlocks/text').updateFonts(font);
	}
};

export default loadFonts;
