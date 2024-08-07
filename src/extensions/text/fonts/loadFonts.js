/**
 * WordPress dependencies
 */
import { dispatch, resolveSelect, select } from '@wordpress/data';

/**
 * External dependencies
 */
import { isEmpty, uniq } from 'lodash';

const buildFontStyleString = fontStyle => {
	return fontStyle === 'italic' ? 'ital,' : '';
};

const normalizeWeights = fontWeight => {
	const weights = Array.isArray(fontWeight)
		? fontWeight
		: fontWeight.split(',');
	const res = Array.from(new Set(weights));
	return res.sort((a, b) => a - b);
};

const getMultipleWeightsString = (weights, fontStyle) => {
	let result = 'wght@';
	weights.forEach(weight => {
		if (fontStyle === 'italic') {
			result += `0,${weight};1,${weight};`;
		} else {
			result += `${weight};`;
		}
	});
	return result.slice(0, -1);
};

const getSingleWeightString = (weight, fontStyle) => {
	if (fontStyle === 'italic') {
		return `wght@0,${weight};1,${weight}`;
	}
	return `wght@${weight}`;
};

const getDefaultWeightString = fontStyle => {
	return fontStyle === 'italic' ? 'wght@0,400;1,400' : 'wght@400';
};

const buildFontWeightString = (fontWeight, fontStyle) => {
	if (!fontWeight) {
		return getDefaultWeightString(fontStyle);
	}

	const weights = normalizeWeights(fontWeight);

	if (weights.length > 1) {
		return getMultipleWeightsString(weights, fontStyle);
	}

	return getSingleWeightString(weights[0], fontStyle);
};

const getFontUrl = async (fontName, fontData) => {
	const fontUrl = await resolveSelect('maxiBlocks/text').getFontUrl(
		fontName,
		fontData
	);

	if (
		!fontData ||
		Object.keys(fontData).length === 0 ||
		!fontUrl.includes('$fontData')
	) {
		return fontUrl.replace(/:$/, '');
	}

	let fontDataString = buildFontStyleString(fontData.style);
	fontDataString += buildFontWeightString(fontData.weight, fontData.style);

	return fontUrl.replace(/\$fontData/, fontDataString);
};

const getFontID = (fontName, fontData) => {
	const normalizeFontName = name => name.toLowerCase().replace(/ /g, '-');

	return `maxi-blocks-styles-font-${normalizeFontName(fontName)}-${
		fontData.weight
	}-${fontData.style}`;
};

const getFontElement = (fontName, fontData, url) => {
	const style = document.createElement('link');
	style.rel = 'stylesheet';
	style.href = url;
	style.type = 'text/css';
	style.media = 'all';

	style.id = getFontID(fontName, fontData);

	return style;
};

/**
 * Loads the font on background using JS FontFace API
 * FontFaceSet API uses check() to check if a font exists, but needs to compare with some exact value:
 * in this case is used '12px' as a standard that returns if the font has been loaded.
 *
 * @param {string}           font         Name of the selected font
 * @param {boolean}          backendOnly  If true, `dispatch('maxiBlocks/text').updateFonts()` isn't called
 * @param {HTMLElement}      target       Element, where the font will be loaded
 * @param {CallableFunction} setIsLoading Function to set loading state
 */
const loadFonts = (
	font,
	backendOnly = true,
	target = document,
	setIsLoading
) => {
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
				const fontId = getFontID(fontName, fontDataNew);
				if (target.head.querySelector(`#${fontId}`) !== null) return;

				if (setIsLoading) setIsLoading(true, fontId);

				const url = await getFontUrl(fontName, fontDataNew);

				const styleElement = getFontElement(fontName, fontDataNew, url);

				styleElement.onload = () => {
					if (setIsLoading) setIsLoading(false, fontId);
				};

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

const loadFontsInEditor = (objFont, setShowLoader) => {
	const iframeEditor = document.querySelector('iframe[name="editor-canvas"]');
	const currentlyLoadingIds = [];

	const setIsLoading = (isLoading, fontId) => {
		if (isLoading) {
			currentlyLoadingIds.push(fontId);
		} else {
			const index = currentlyLoadingIds.indexOf(fontId);
			if (index > -1) {
				currentlyLoadingIds.splice(index, 1);
			}
		}

		if (setShowLoader) {
			setShowLoader(currentlyLoadingIds.length > 0);
		}
	};

	if (iframeEditor) {
		loadFonts(objFont, true, iframeEditor.contentDocument);
	} else loadFonts(objFont, true, undefined, setIsLoading);
};

export { loadFontsInEditor, loadFonts };
