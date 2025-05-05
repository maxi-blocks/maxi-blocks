/**
 * WordPress dependencies
 */
import { dispatch } from '@wordpress/data';

/**
 * Internal dependencies
 */
import { loadFonts } from '@extensions/text/fonts';
import {
	getSiteEditorIframe,
	getSiteEditorPreviewIframes,
} from '@extensions/fse';
import getSCVariablesObject from './getSCVariablesObject';
import getSCStyles from './getSCStyles';

/**
 * External dependencies
 */
import { cloneDeep, isArray, isEmpty, uniq } from 'lodash';

export const createSCStyleString = SCObject => {
	let response = ':root{';

	Object.entries(SCObject).forEach(([key, val]) => {
		if (val) response += `${key}:${val};`;
	});

	response += '}';

	return response;
};

/**
 * Updates CSS custom properties for custom colors immediately
 * This function allows custom colors to be used right away without saving
 *
 * @param {Array} customColors Array of custom color objects
 * @param {Array} elements     DOM elements to update (defaults to document and site editor iframe)
 */
export const updateCustomColorVariables = (
	customColors,
	rawElements = [document, getSiteEditorIframe()]
) => {
	if (!customColors || !customColors.length) return;

	const elements = isArray(rawElements) ? rawElements : [rawElements];

	elements.forEach(element => {
		if (!element) return;

		// Find or create the custom colors style element
		let customColorsStyleEl = element.getElementById(
			'maxi-blocks-custom-colors-css'
		);

		if (!customColorsStyleEl) {
			customColorsStyleEl = element.createElement('style');
			customColorsStyleEl.id = 'maxi-blocks-custom-colors-css';

			// Get the head element
			const elementHead = Array.from(
				element.querySelectorAll('head')
			).pop();
			elementHead?.appendChild(customColorsStyleEl);
		}

		// Create CSS for custom colors (for both light and dark themes)
		let cssString = '';

		customColors.forEach(color => {
			// Add variables for light theme
			cssString += `
				--maxi-light-color-${color.id}: ${color.value};
				--maxi-light-${color.id}: var(--maxi-light-color-${color.id});
			`;

			// Add variables for dark theme
			cssString += `
				--maxi-dark-color-${color.id}: ${color.value};
				--maxi-dark-${color.id}: var(--maxi-dark-color-${color.id});
			`;
		});

		// Update the style element content
		customColorsStyleEl.innerHTML = `:root{${cssString}}`;
	});

	// Dispatch an event to let the editor know custom colors have been updated
	document.dispatchEvent(
		new CustomEvent('maxi-blocks-custom-colors-updated')
	);
};

export const getSCFontsData = obj => {
	const response = {};
	let fontName = '';

	Object.entries(obj).forEach(([key, val]) => {
		if (key.includes('font-family')) {
			if (val) fontName = val.replaceAll('"', '');
			response[fontName] = response[fontName] ?? {
				weight: [],
				style: [],
			};
		}
		if (key.includes('font-weight'))
			response[fontName].weight.push(val?.toString());

		if (key.includes('font-style')) response[fontName].style.push(val);
	});

	if (!isEmpty(response)) {
		Object.entries(response).forEach(([key, val]) => {
			const fontWeight = uniq(val.weight).join();
			const fontStyle = uniq(val.style).join();

			if (fontStyle === 'normal') delete response[key].style;
			else response[key].style = fontStyle;

			response[key].weight = fontWeight;
		});
	}

	return response;
};

const updateSCStyles = async (element, SCObject, gutenbergBlocksStatus) => {
	const SCStylesEl = element.getElementById(
		'maxi-blocks-sc-styles-inline-css'
	);

	const SCStyles = await getSCStyles(SCObject, gutenbergBlocksStatus, true);

	if (SCStylesEl) {
		SCStylesEl.innerHTML = SCStyles;
	} else {
		const newSCStylesEl = element.createElement('style');
		newSCStylesEl.id = 'maxi-blocks-sc-styles-inline-css';
		newSCStylesEl.innerHTML = SCStyles;

		element.head.appendChild(newSCStylesEl);
	}
};

const updateSCOnEditor = (
	styleCards,
	activeSCColour,
	rawElements = [document, getSiteEditorIframe()]
) => {
	const SCObject = getSCVariablesObject(
		{ ...cloneDeep(styleCards) },
		activeSCColour
	);
	const allSCFonts = getSCFontsData(SCObject);
	const SCVariableString = createSCStyleString(SCObject);
	const siteEditorPreviewIframes = getSiteEditorPreviewIframes();

	// FSE editor patterns previews
	if (siteEditorPreviewIframes.length > 0) {
		siteEditorPreviewIframes.forEach(iframe => {
			const iframeDocument = iframe?.contentDocument;

			if (!iframeDocument) return;

			// remove white overlay for FSE editor patterns previews
			let overlayEl = iframeDocument.getElementById(
				'maxi-blocks-fse-white-overlay-remove-styles'
			);

			if (!overlayEl) {
				overlayEl = iframeDocument.createElement('style');
				overlayEl.id = 'maxi-blocks-fse-white-overlay-remove-styles';
				overlayEl.innerHTML =
					'body{background-color: transparent; !important;}.is-focus-mode .block-editor-block-list__block:not(.has-child-selected){opacity: 1 !important;}';
				const overlayHead = iframeDocument.head;
				if (overlayHead) {
					overlayHead.appendChild(overlayEl);
				}
			}
		});
	} else {
		const elements = isArray(rawElements) ? rawElements : [rawElements];

		elements.forEach(element => {
			if (!element) return;

			let SCVarEl = element.getElementById(
				'maxi-blocks-sc-vars-inline-css'
			);

			if (!SCVarEl) {
				SCVarEl = element.createElement('style');
				SCVarEl.id = 'maxi-blocks-sc-vars-inline-css';
				SCVarEl.innerHTML = SCVariableString;

				// Iframe on creation generates head, then gutenberg generates their own head
				// and in some moment we have two heads, so we need to add SC only to head which is second(gutenberg one)
				const elementHead = Array.from(
					element.querySelectorAll('head')
				).pop();
				elementHead?.appendChild(SCVarEl);
				const { saveSCStyles } = dispatch('maxiBlocks/style-cards');

				// Needs a delay, if not Redux returns error 3
				setTimeout(() => saveSCStyles(false), 150);
			} else {
				SCVarEl.innerHTML = SCVariableString;

				updateSCStyles(
					element,
					SCObject,
					styleCards.gutenberg_blocks_status
				);
			}

			if (!isEmpty(allSCFonts)) {
				loadFonts(allSCFonts, false, element);
			}

			// Also make sure custom colors are available
			if (styleCards?.light?.styleCard?.color?.customColors) {
				updateCustomColorVariables(
					styleCards.light.styleCard.color.customColors,
					element
				);
			}
		});
	}
};

export default updateSCOnEditor;
