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


// Batch font loading queue
const fontQueue = new Map();
let batchTimeout = null;
const BATCH_DELAY = 50; // ms to wait for batching

const processFontQueue = async () => {
	if (fontQueue.size === 0) return;

	const fonts = Array.from(fontQueue.keys());

	// Process all fonts in parallel
	const results = await Promise.all(
		Array.from(fontQueue.entries()).map(async ([fontName, { resolve, reject, fontData }]) => {
			try {
				const url = await getFontUrl(fontName, fontData);
				resolve(url);
			} catch (error) {
				reject(error);
			}
		})
	);

	fontQueue.clear();
};

const queueFontLoad = (fontName, fontData) => {
	if (batchTimeout) clearTimeout(batchTimeout);

	const promise = new Promise((resolve, reject) => {
		fontQueue.set(fontName, { resolve, reject, fontData });
	});

	batchTimeout = setTimeout(processFontQueue, BATCH_DELAY);
	return promise;
};

const fontUrlCache = new Map();
const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours

const getStorageCache = (key) => {
	try {
		const item = localStorage.getItem(`maxi_font_${key}`);
		if (!item) return null;
		const { value, timestamp } = JSON.parse(item);
		if (Date.now() - timestamp < CACHE_DURATION) {
			return value;
		}
		localStorage.removeItem(`maxi_font_${key}`);
	} catch (e) {
		return null;
	}
	return null;
};

const setStorageCache = (key, value) => {
	try {
		localStorage.setItem(`maxi_font_${key}`, JSON.stringify({
			value,
			timestamp: Date.now()
		}));
	} catch (e) {
		// Storage full or other error, just continue
	}
};

const cleanUrl = url => {
	if (typeof url !== 'string') return url;

	// First, clean basic formatting
	let cleanedUrl = url
		.trim()
		.replace(/^["']+|["']+$/g, '') // Remove quotes
		.replace(/\\/g, '')            // Remove backslashes
		.replace(/\/+/g, '/')          // Fix multiple slashes
		.replace(/\$fontData/, '');    // Remove any $fontData placeholder

	// Fix double domain issue for local fonts
	const origin = window.location.origin;
	if (cleanedUrl.includes(origin + '/' + origin.replace(/^https?:\/\//, ''))) {
		cleanedUrl = cleanedUrl.replace(origin + '/', '');
	}

	// Ensure proper protocol
	if (cleanedUrl.startsWith('http:/')) {
		cleanedUrl = cleanedUrl.replace('http:/', 'http://');
	}
	if (cleanedUrl.startsWith('https:/')) {
		cleanedUrl = cleanedUrl.replace('https:/', 'https://');
	}

	return cleanedUrl;
};

const buildFontString = (weight = '400', style = 'normal') => {
	if (style === 'italic') {
		return `ital,wght@0,${weight};1,${weight}`;
	}
	return `wght@${weight}`;
};

const buildFontUrl = async (fontName, fontData = {}) => {
	// Check if we need to use local fonts
	if (window.maxiBlocksMain?.local_fonts) {
		const encodedFontName = encodeURIComponent(fontName).replace(/%20/g, '+').toLowerCase();
		const response = await fetch(`/wp-json/maxi-blocks/v1.0/get-font-url/${encodedFontName}`, {
			credentials: 'same-origin',
			headers: {
				'X-WP-Nonce': window.wpApiSettings?.nonce,
			}
		});

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

	const api_url = window.maxiBlocksMain?.bunny_fonts
		? 'https://fonts.bunny.net'
		: 'https://fonts.googleapis.com';

	const fontString = style === 'italic'
		? `ital,wght@0,${weight};1,${weight}`
		: `wght@${weight}`;

	return `${api_url}/css2?family=${encodeURIComponent(fontName)}:${fontString}&display=swap`;
};

const isCacheValid = (url) => {
	if (!url) return false;

	// Check if URL matches current font provider settings
	const isLocalFont = window.maxiBlocksMain?.local_fonts;
	const isBunnyFont = window.maxiBlocksMain?.bunny_fonts;

	if (isLocalFont) {
		// Local font URLs should be from our WordPress site
		return url.includes(window.location.origin);
	}

	if (isBunnyFont) {
		return url.includes('fonts.bunny.net');
	}

	// Default to Google Fonts
	return url.includes('fonts.googleapis.com');
};

const getFontUrl = async (fontName, fontData = {}) => {
	try {
		const requestKey = `${fontName}-${JSON.stringify(fontData)}`;

		// Check cache first
		const cached = fontUrlCache.get(requestKey) || getStorageCache(requestKey);
		if (cached && isCacheValid(cached)) {
			return cached;
		}

		// If cache exists but is invalid, clear it
		if (cached) {
			fontUrlCache.delete(requestKey);
			localStorage.removeItem(`maxi_font_${requestKey}`);
		}

		// Build and cache the URL
		const fontUrl = await buildFontUrl(fontName, fontData);

		// Only cache if the URL is valid for current settings
		if (isCacheValid(fontUrl)) {
			fontUrlCache.set(requestKey, fontUrl);
			setStorageCache(requestKey, fontUrl);
		}

		return fontUrl;
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
	let fontUrl = url || await getFontUrl(fontName, fontData);

	// Clean the URL one final time before creating the element
	fontUrl = cleanUrl(fontUrl);

	const style_element = document.createElement('link');
	style_element.rel = 'stylesheet';
	style_element.href = fontUrl;
	style_element.type = 'text/css';
	style_element.media = 'all';
	style_element.id = getFontID(fontName, fontData);

	return style_element;
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
					const styleElement = await getFontElement(fontName, fontData, url);

					const oldStyleElement = target.getElementById(styleElement.id);
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
