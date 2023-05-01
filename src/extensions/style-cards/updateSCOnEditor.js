/**
 * WordPress dependencies
 */
import { dispatch } from '@wordpress/data';

/**
 * Internal dependencies
 */
import { loadFonts } from '../text/fonts';
import { getSiteEditorIframe } from '../fse';
import getSCVariablesObject from './getSCVariablesObject';

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
			fontName = val.replaceAll('"', '');
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

	const elements = isArray(rawElements) ? rawElements : [rawElements];

	elements.forEach(element => {
		if (!element) return;

		let SCStyle = element.getElementById('maxi-blocks-sc-vars-inline-css');
		if (!SCStyle) {
			SCStyle = element.createElement('style');
			SCStyle.id = 'maxi-blocks-sc-vars-inline-css';
			SCStyle.innerHTML = createSCStyleString(SCObject);
			// Iframe on creation generates head, then gutenberg generates their own head
			// and in some moment we have two heads, so we need to add SC only to head which is second(gutenberg one)
			const elementHead = Array.from(
				element.querySelectorAll('head')
			).pop();
			elementHead?.appendChild(SCStyle);
			const { saveSCStyles } = dispatch('maxiBlocks/style-cards');

			// Needs a delay, if not Redux returns error 3
			setTimeout(() => saveSCStyles(false), 150);
		} else SCStyle.innerHTML = createSCStyleString(SCObject);

		if (!isEmpty(allSCFonts)) loadFonts(allSCFonts, false, element);
	});
};

export default updateSCOnEditor;
