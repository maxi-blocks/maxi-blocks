/**
 * WordPress dependencies
 */
import { dispatch, select } from '@wordpress/data';

/**
 * External dependencies
 */
import { isEmpty, uniq } from 'lodash';
import { cleanUrl } from './fontCacheUtils';
import { buildFontUrl } from './loadFontUtils';

/**
 * Get the font URL - simplified version without caching
 * @param {string} fontName - The font name
 * @param {Object} fontData - The font data
 * @returns {Promise<string>} The font URL
 */
export const getFontUrl = async (fontName, fontData = {}) => {
	try {
		// Build the URL directly without caching
		const fontUrl = await buildFontUrl(fontName, fontData);
		return fontUrl;
	} catch (error) {
		console.error('Error getting font URL:', error);
		throw error;
	}
};

/**
 * Get the font ID
 * @param {string} fontName - The font name
 * @param {Object} fontData - The font data
 * @returns {string} The font ID
 */
const getFontID = (fontName, fontData) => {
	const normalizeFontName = name => name.toLowerCase().replace(/\s/g, '-');
	return `maxi-blocks-styles-font-${normalizeFontName(fontName)}-${
		fontData.weight
	}-${fontData.style}`;
};

/**
 * Get the font element
 * @param {string} fontName - The font name
 * @param {Object} fontData - The font data
 * @param {string} url      - The font URL
 * @returns {Promise<HTMLElement>} The font element
 */
const getFontElement = async (fontName, fontData, url) => {
	// Get the URL if not provided (ensures consistent URL generation)
	let fontUrl = url || (await getFontUrl(fontName, fontData));

	// Clean the URL one final time before creating the element
	fontUrl = cleanUrl(fontUrl);

	const styleElement = document.createElement('link');
	styleElement.rel = 'stylesheet';
	styleElement.href = fontUrl;
	styleElement.type = 'text/css';
	styleElement.media = 'all';
	styleElement.id = getFontID(fontName, fontData);

	return styleElement;
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
const loadFonts = async (
	font,
	backendOnly = true,
	target = document,
	setIsLoading
) => {
	if (typeof font === 'object' && font !== null) {
		if (!backendOnly)
			dispatch('maxiBlocks/text').updateFonts(JSON.stringify(font));

		await Promise.all(
			Object.entries(font).map(async ([fontName, fontData]) => {
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

				const loadBackendFont = async (fontName, fontData) => {
					const fontId = getFontID(fontName, fontData);

					if (target.head.querySelector(`#${fontId}`) !== null) {
						return;
					}

					if (setIsLoading) setIsLoading(true, fontId);

					try {
						const url = await getFontUrl(fontName, fontData);
						const styleElement = await getFontElement(
							fontName,
							fontData,
							url
						);

						const oldStyleElement = target.getElementById(
							styleElement.id
						);
						if (oldStyleElement) {
							if (setIsLoading) {
								if (oldStyleElement.sheet) {
									setIsLoading(false, fontId);
								} else {
									oldStyleElement.onload = () => {
										setIsLoading(false, fontId);
									};
								}
							}
							return;
						}

						if (setIsLoading) {
							styleElement.onload = () => {
								setIsLoading(false, fontId);
							};
						}

						target.head.appendChild(styleElement);
					} catch (error) {
						console.error('Error loading font:', error);
					}
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

				await Promise.all(
					fontWeightArr.map(async weight =>
						Promise.all(
							fontStyleArr.map(async currentFontStyle => {
								let weightFile = getWeightFile(
									weight,
									currentFontStyle
								);
								if (!(weightFile in fontFiles)) {
									weightFile = '400';
									const newFontWeightArr = uniq(
										fontWeightArr
									).filter(value => {
										return value !== weight;
									});

									newFontWeightArr.push(weightFile);

									const newFontWeight =
										uniq(newFontWeightArr).join();
									font[fontName].weight = newFontWeight;
								}

								await Promise.all(
									Object.entries(fontFiles).map(
										async variant => {
											if (
												variant[0].toString() ===
												weightFile
											) {
												fontDataNew = {
													...fontData,
													...{
														style: currentFontStyle,
													},
													...{
														weight: getWeight(
															weightFile
														),
													},
												};

												await loadBackendFont(
													fontName,
													fontDataNew
												);
											}
										}
									)
								);
							})
						)
					)
				);
			})
		);
	}

	return null;
};

/**
 * Load the fonts in the editor
 * @param {Object}           objFont       - The font object
 * @param {CallableFunction} setShowLoader - The function to set the loading state
 */
const loadFontsInEditor = (objFont, setShowLoader) => {
	const iframeEditor = document.querySelector('iframe[name="editor-canvas"]');

	if (iframeEditor) {
		loadFonts(objFont, true, iframeEditor.contentDocument);
	} else loadFonts(objFont, true, undefined);
};

export { loadFontsInEditor, loadFonts };
