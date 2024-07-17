/**
 * WordPress dependencies
 */
import { dispatch, resolveSelect, select } from '@wordpress/data';

/**
 * External dependencies
 */
import { isEmpty, uniq } from 'lodash';

const fontsOnPage = {};

const getFontUrl = async (fontName, fontData) => {
	const maxiSettings = await resolveSelect(
		'maxiBlocks'
	).receiveMaxiSettings();

	const apiRoute = maxiSettings?.bunny_fonts
		? 'https://fonts.bunny.net'
		: 'https://fonts.googleapis.com';
	let url = `${apiRoute}/css2?family=${fontName}:`;

	if (Object.keys(fontData).length > 0) {
		let fontWeight = fontData?.weight;
		const fontStyle = fontData?.style;

		if (Array.isArray(fontWeight)) {
			fontWeight = [...new Set(fontWeight)].join(',');
		}

		if (fontStyle === 'italic') {
			url += 'ital,';
		}

		if (fontWeight.includes(',')) {
			const fontWeightArr = [...new Set(fontWeight.split(','))].sort(
				(a, b) => a - b
			);
			url += 'wght@';
			if (fontStyle === 'italic') {
				for (const fw of fontWeightArr) {
					url += `0,${fw};`;
				}
				for (const fw of fontWeightArr) {
					url += `1,${fw};`;
				}
			} else {
				for (const fw of fontWeightArr) {
					url += `${fw};`;
				}
			}
			url = url.slice(0, -1); // Remove trailing semicolon
		} else if (fontWeight) {
			if (fontStyle === 'italic') {
				url += `wght@0,${fontWeight};1,${fontWeight}`;
			} else {
				url += `wght@${fontWeight}`;
			}
		} else if (fontStyle === 'italic') {
			url += 'wght@0,400;1,400';
		} else {
			url += 'wght@400';
		}

		url += '&display=swap';
	} else {
		url += 'display=swap';
	}

	return url;
};

const getFontElement = (fontName, fontData, url) => {
	const style = document.createElement('link');
	style.rel = 'stylesheet';
	style.href = url;
	style.type = 'text/css';
	style.media = 'all';

	const normalizeFontName = name => name.toLowerCase().replace(' ', '-');

	const id = `maxi-blocks-styles-font-${normalizeFontName(fontName)}-${
		fontData.weight
	}-${fontData.style}`;
	style.id = id;

	return style;
};

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
			if (!fontName || fontName === 'undefined') return;

			const fontWeight = fontData?.weight || '400';
			const fontStyle = fontData?.style;

			let fontWeightArr = [];
			let fontDataNew;

			if (Array.isArray(fontWeight)) {
				font[fontName].weight = uniq(fontWeight).join();
				fontWeightArr = fontWeight;
			} else if (typeof fontWeight === 'string') {
				fontWeightArr = uniq(fontWeight.split(',')).filter(
					weight => !isEmpty(weight)
				);
				fontDataNew = {
					...fontData,
					...{ weight: fontWeightArr.join() },
				};
				font[fontName].weight = fontWeightArr.join();
			} else {
				fontWeightArr = [fontWeight];
				fontDataNew = { ...fontData, ...{ weight: fontWeight } };
			}

			fontDataNew = {
				...fontDataNew,
				...{ display: 'swap' },
			};

			let fontStyleArr = [];

			if (Array.isArray(fontStyle) && !isEmpty(fontStyle)) {
				font[fontName].style = uniq(fontStyle).join();
			} else if (typeof fontStyle === 'string') {
				fontStyleArr = uniq(fontStyle.split(',')).filter(
					style => !isEmpty(style)
				);

				font[fontName].style = fontStyleArr.join();
			} else {
				fontStyleArr = ['normal'];
			}

			if (isEmpty(fontDataNew.style)) delete fontDataNew.style;

			const fontFiles =
				select('maxiBlocks/text').getFont(fontName)?.files;

			if (isEmpty(fontFiles)) return;

			const loadBackendFont = async fontName => {
				if (!fontsOnPage[fontName])
					fontsOnPage[fontName] = {
						weights: new Set(),
						styles: new Set(),
					};

				if (
					fontsOnPage[fontName].weights.has(fontDataNew.weight) &&
					fontsOnPage[fontName].styles.has(fontDataNew.style)
				)
					return;

				fontsOnPage[fontName].weights.add(fontDataNew.weight);
				fontsOnPage[fontName].styles.add(fontDataNew.style);

				const url = await getFontUrl(fontName, fontDataNew);

				const styleElement = getFontElement(fontName, fontDataNew, url);

				if (target.getElementById(styleElement.id)) return;

				target.head.appendChild(styleElement);
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

							loadBackendFont(fontName);
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
