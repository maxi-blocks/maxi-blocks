/**
 * WordPress dependencies
 */
import { dispatch } from '@wordpress/data';

/**
 * Internal dependencies
 */
import { loadFonts } from '@extensions/text/fonts';
import { getSiteEditorIframe, getSiteEditorPreviewIframes } from '@extensions/fse';
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

const getSCFontsData = obj => {
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
		});
	}
};

export default updateSCOnEditor;
