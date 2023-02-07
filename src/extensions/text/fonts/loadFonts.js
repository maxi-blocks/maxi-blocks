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
 * @param {string}      font        Name of the selected font
 * @param {boolean}     backendOnly If true, `dispatch('maxiBlocks/text').updateFonts()` isn't called
 * @param {HTMLElement} target      Element, where the font will be loaded
 */
const loadFonts = (font, backendOnly = true, target = document) => {
	if (typeof font === 'object' && font !== null) {
		Object.entries(font).forEach(([fontName, fontData]) => {
			if (isEmpty(fontName)) return;

			const fontWeight = fontData?.weight || '400';
			const fontStyle = fontData?.style;

			let fontWeightArr = [];
			let fontDataNew;

			if (isEmpty(fontWeight)) {
				fontWeightArr = ['400'];
			} else if (Array.isArray(fontWeight)) {
				font[fontName].weight = uniq(fontWeight).join();
				fontWeightArr = fontWeight;
			} else if (typeof fontWeight === 'string') {
				fontWeightArr = uniq(fontWeight.split(','));
				fontDataNew = {
					...fontData,
					...{ weight: fontWeightArr.join() },
				};
				font[fontName].weight = fontWeightArr.join();
			} else fontDataNew = { ...fontData, ...{ weight: fontWeight } };

			let fontStyleArr = [];

			if (isEmpty(fontStyle)) {
				fontWeightArr = ['normal'];
			} else if (Array.isArray(fontStyle)) {
				font[fontName].style = uniq(fontStyle).join();
			} else if (typeof fontStyle === 'string') {
				fontStyleArr = uniq(fontStyle.split(','));

				font[fontName].style = fontStyleArr.join();
			}

			if (isEmpty(fontDataNew.style)) delete fontDataNew.style;

			const fontFiles =
				select('maxiBlocks/text').getFont(fontName)?.files;

			if (isEmpty(fontFiles)) return;

			const loadBackendFont = url => {
				const fontLoad = new FontFace(
					fontName,
					`url(${url})`,
					fontDataNew
				);
				fontLoad.load().then(() => {
					target.fonts.add(fontLoad);
				});
				fontLoad.loaded.catch(err => {
					console.error(
						__(`Font hasn't been able to download: ${err}`)
					);
				});
			};

			const getWeightFile = (weight, style) =>
				style === 'italic'
					? `${weight === '400' ? '' : weight}italic`
					: weight;

			/**
			 * Returns font weight from weightFile
			 *
			 * @example getWeight('100italic') // returns 100;
			 */
			const getWeight = weightFile => {
				const weightStr = weightFile.replace(/\D+/, '');

				return isEmpty(weightStr) ? '400' : weightStr;
			};

			fontWeightArr.forEach(weight => {
				fontStyleArr.forEach(currentFontStyle => {
					let weightFile = getWeightFile(weight, currentFontStyle);
					if (!(weightFile in fontFiles)) {
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

					Object.entries(fontFiles).forEach(variant => {
						if (variant[0].toString() === weightFile) {
							fontDataNew = {
								...fontData,
								...{ style: currentFontStyle },
								...{ weight: getWeight(weightFile) },
							};

							loadBackendFont(variant[1]);
						}
					});
				});
			});
		});

		if (!backendOnly)
			dispatch('maxiBlocks/text').updateFonts(JSON.stringify(font));
	}

	return null;
};

const loadFontsInEditor = objFont => {
	const iframeEditor = document.querySelector('iframe[name="editor-canvas"]');
	if (iframeEditor) {
		loadFonts(objFont, true, iframeEditor.contentDocument);
	} else loadFonts(objFont);
};

export { loadFontsInEditor, loadFonts };
