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
const loadFonts = (font, backendOnly = false) => {
	if (typeof font === 'object' && font !== null) {
		Object.entries(font).forEach(([key, val]) => {
			const fontName = key;
			const fontWeight = val?.weight || '400';
			let fontData = val;

			let fontWeightArr = [];

			if (Array.isArray(fontWeight))
				font[fontName].weight = uniq(fontWeight).join();

			if (fontWeight?.includes(',')) {
				fontWeightArr = uniq(fontWeight.split(','));
				fontData = { ...val, ...{ weight: fontWeightArr.join() } };
			} else fontData = { ...val, ...{ weight: fontWeight } };

			if (isEmpty(fontData.style)) delete fontData.style;

			const { files } = select('maxiBlocks/text').getFont(fontName);

			if (!isEmpty(fontWeightArr)) {
				fontWeightArr.forEach(weight => {
					let weightFile = weight;
					if (!(Number(weight) in files)) {
						weightFile = '400';
						const newFontWeightArr = uniq(fontWeightArr).filter(
							value => {
								return value !== weight;
							}
						);

						newFontWeightArr.push(weightFile);

						const newFontWeight = uniq(newFontWeightArr).join();
						font[fontName].weight = newFontWeight;
					}

					Object.entries(files).forEach(variant => {
						if (variant[0].toString() === weightFile) {
							fontData = { ...val, ...{ weight: weightFile } };
							if (fontData?.style === ',italic')
								fontData.style = 'italic';

							if (fontData?.style === 'normal,italic') {
								const fontStyleArr = fontData.style.split(',');
								fontStyleArr.forEach(style => {
									fontData.style = style;
									console.log(fontData);
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
								});
							} else {
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
						}
					});
				});
			} else
				Object.entries(files).forEach(variant => {
					let weightFile = fontWeight.toString();
					if (isEmpty(fontWeight) || !(Number(fontWeight) in files)) {
						weightFile = '400';
						font[fontName].weight = weightFile;
						fontData.weight = weightFile;
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

		if (!backendOnly)
			dispatch('maxiBlocks/text').updateFonts(JSON.stringify(font));
	}

	return null;
};

export default loadFonts;
