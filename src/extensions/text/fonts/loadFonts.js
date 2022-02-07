/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { dispatch, select } from '@wordpress/data';

/**
 * External dependencies
 */
import { isEmpty, uniq } from 'lodash';
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
			const fontWeight = val?.weight || '400';
			let fontData = val;

			let fontWeightArr = [];

			if (fontWeight?.includes(',')) {
				fontWeightArr = fontWeight.split(',');
				fontData = { ...val, ...{ weight: uniq(fontWeight) } };
			}

			const { files } = select('maxiBlocks/text').getFont(fontName);

			if (!isEmpty(fontWeightArr)) {
				fontWeightArr.forEach(weight => {
					let weightFile = weight;
					if (!(Number(weight) in files)) {
						weightFile = '400';
						const newFontWeightArr = fontWeightArr.filter(value => {
							return value !== weight;
						});

						if (!(weightFile in newFontWeightArr))
							newFontWeightArr.push(weightFile);

						const newFontWeight = uniq(newFontWeightArr).join();
						font[fontName].weight = newFontWeight;
					}

					Object.entries(files).forEach(variant => {
						if (variant[0].toString() === weightFile) {
							fontData = { ...val, ...{ weight: weightFile } };
							const fontLoad = new FontFace(
								fontName,
								`url(${variant[1]})`,
								fontData
							);
							document.fonts.add(fontLoad);
							fontLoad.loaded.catch(err => {
								console.error(
									__(
										`Font hasn't been able to download: ${err}`
									)
								);
							});
						}
					});
				});
			} else
				Object.entries(files).forEach(variant => {
					let weightFile = fontWeight;
					if (!(Number(fontWeight) in files)) {
						weightFile = '400';
						font[fontName].weight = '400';
					}

					if (variant[0] === weightFile) {
						const fontLoad = new FontFace(
							fontName,
							`url(${variant[1]})`,
							fontData
						);
						document.fonts.add(fontLoad);
						fontLoad.loaded.catch(err => {
							console.error(
								__(`Font hasn't been able to download: ${err}`)
							);
						});
					}
				});
		});

		dispatch('maxiBlocks/text').updateFonts(JSON.stringify(font));
	}

	return null;
};

export default loadFonts;
