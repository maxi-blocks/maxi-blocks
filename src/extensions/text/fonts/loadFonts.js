/**
 * WordPress dependencies
 */
import { dispatch, select } from '@wordpress/data';

/**
 * External dependencies
 */
import { isEmpty, uniq } from 'lodash';
import {
	fontUrlCache,
	getStorageCache,
	setStorageCache,
	cleanUrl,
} from './fontCacheUtils';

const buildFontUrl = async (fontName, fontData = {}) => {
	// Check if we need to use local fonts
	if (window.maxiBlocksMain?.local_fonts) {
		const encodedFontName = encodeURIComponent(fontName).replace(
			/%20/g,
			'+'
		);

		const response = await fetch(
			`/wp-json/maxi-blocks/v1.0/get-font-url/${encodedFontName}`,
			{
				credentials: 'same-origin',
				headers: {
					'X-WP-Nonce': window.wpApiSettings?.nonce,
				},
			}
		);

		if (!response.ok) {
			throw new Error(`HTTP error! status: ${response.status}`);
		}

		const text = await response.text();
		return cleanUrl(text);
	}

	// For remote fonts (Google or Bunny)
	const weight = Array.isArray(fontData.weight)
		? fontData.weight.join(',')
		: fontData.weight || '400';
	const style = fontData.style || 'normal';

	const apiUrl = window.maxiBlocksMain?.bunny_fonts
		? 'https://fonts.bunny.net'
		: 'https://fonts.googleapis.com';

	const fontString =
		style === 'italic'
			? `ital,wght@0,${weight};1,${weight}`
			: `wght@${weight}`;

	const url = `${apiUrl}/css2?family=${encodeURIComponent(
		fontName
	)}:${fontString}&display=swap`;
	return url;
};

const isCacheValid = async url => {
	if (!url) return false;

	// Check if URL matches current font provider settings
	const isLocalFont = window.maxiBlocksMain?.local_fonts;
	const isBunnyFont = window.maxiBlocksMain?.bunny_fonts;

	// First check the URL pattern
	let isValidPattern = false;
	if (isLocalFont) {
		isValidPattern = url.includes(window.location.origin);
	} else if (isBunnyFont) {
		isValidPattern = url.includes('fonts.bunny.net');
	} else {
		isValidPattern = url.includes('fonts.googleapis.com');
	}

	if (!isValidPattern) return false;

	// Then check if the URL is actually accessible
	try {
		// Using AbortController to cancel the request if it fails
		const controller = new AbortController();
		const timeoutId = setTimeout(() => controller.abort(), 2000); // 2 second timeout

		const response = await fetch(url, {
			method: 'HEAD',
			signal: controller.signal,
			// Prevent the browser from logging failed requests
			cache: 'no-store',
		}).catch(() => ({ ok: false })); // Silently handle network errors

		clearTimeout(timeoutId);
		return response.ok;
	} catch {
		// Silently return false for any errors
		return false;
	}
};

const getFontUrl = async (fontName, fontData = {}) => {
	try {
		const requestKey = `${fontName}-${JSON.stringify(fontData)}`;

		// Check cache first
		const cached =
			fontUrlCache.get(requestKey) || getStorageCache(requestKey);
		if (cached && (await isCacheValid(cached))) {
			return cached;
		}

		// If cache exists but is invalid, clear it
		if (cached) {
			fontUrlCache.delete(requestKey);
			localStorage.removeItem(`maxi_font_${requestKey}`);
		}

		// Build and validate the URL
		const fontUrl = await buildFontUrl(fontName, fontData);

		// Validate the URL before returning and caching
		if (await isCacheValid(fontUrl)) {
			fontUrlCache.set(requestKey, fontUrl);
			setStorageCache(requestKey, fontUrl);
			return fontUrl;
		}

		throw new Error(`Invalid font URL: ${fontUrl}`);
	} catch (error) {
		console.error('Error getting font URL:', error);
		throw error;
	}
};

const getFontID = (fontName, fontData) => {
	const normalizeFontName = name => name.toLowerCase().replace(/\s/g, '-');
	return `maxi-blocks-styles-font-${normalizeFontName(fontName)}-${
		fontData.weight
	}-${fontData.style}`;
};

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

							loadBackendFont(fontName, fontDataNew);
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

const currentlyLoadingIds = [];
const loadFontsInEditor = (objFont, setShowLoader) => {
	const iframeEditor = document.querySelector('iframe[name="editor-canvas"]');

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
