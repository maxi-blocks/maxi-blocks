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
const loadFonts = (font, backendOnly = true, target = document) => {
	if (typeof font === 'object' && font !== null) {
		Object.entries(font).forEach(([fontName, fontData]) => {
			if (isEmpty(fontName)) return null;

			const fontWeight = fontData?.weight || '400';
			const fontStyle = fontData?.style;

			let fontWeightArr = [];
			let fontDataNew;

			if (Array.isArray(fontWeight))
				font[fontName].weight = uniq(fontWeight).join();

			if (fontWeight?.includes(',')) {
				fontWeightArr = uniq(fontWeight.split(','));
				fontDataNew = {
					...fontData,
					...{ weight: fontWeightArr.join() },
				};
				font[fontName].weight = fontWeightArr.join();
			} else fontDataNew = { ...fontData, ...{ weight: fontWeight } };

			if (Array.isArray(fontStyle))
				font[fontName].style = uniq(fontStyle).join();

			let fontStyleArr = [];

			if (fontStyle?.includes(',')) {
				fontStyleArr = uniq(fontStyle.split(','));

				font[fontName].style = fontStyleArr.join();
			}

			if (isEmpty(fontDataNew.style)) delete fontDataNew.style;

			const fontFiles =
				select('maxiBlocks/text').getFont(fontName)?.files;

			if (isEmpty(fontFiles)) return null;

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

			if (!isEmpty(fontWeightArr)) {
				fontWeightArr.forEach(weight => {
					let weightFile = weight;
					if (!(Number(weight) in fontFiles)) {
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
								...{ weight: weightFile },
							};
							if (
								fontDataNew?.style === ',italic' ||
								fontDataNew?.style === 'normal,italic'
							)
								fontDataNew.style = 'italic';

							loadBackendFont(variant[1]);
						}
					});
				});
			} else
				Object.entries(fontFiles).forEach(variant => {
					let weightFile = fontWeight.toString();
					if (
						isEmpty(fontWeight) ||
						!(Number(fontWeight) in fontFiles)
					) {
						weightFile = '400';
						font[fontName].weight = weightFile;
						fontData.weight = weightFile;
					}

					if (variant[0] === weightFile) loadBackendFont(variant[1]);
				});
			return null;
		});

		if (!backendOnly)
			dispatch('maxiBlocks/text').updateFonts(JSON.stringify(font));
	}

	return null;
};

const loadFontsInEditor = (breakpoint, objFont) => {
	if (breakpoint === 's' || breakpoint === 'xs') {
		const iframeEditor = document.querySelector(
			'iframe[name="editor-canvas"]'
		);
		loadFonts(objFont, true, iframeEditor.contentDocument);
	} else loadFonts(objFont);
};

export { loadFontsInEditor, loadFonts };
