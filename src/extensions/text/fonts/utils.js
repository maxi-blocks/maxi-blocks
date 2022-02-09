/**
 * WordPress dependencies
 */
import { select } from '@wordpress/data';

/**
 * External dependencies
 */
import { isEmpty, isString, uniq } from 'lodash';

/**
 * Internal dependencies
 */
import { getGroupAttributes } from '../../styles';

export const getFontsObj = obj => {
	const response = {};
	let fontName = '';

	Object.entries(obj).forEach(([key, val]) => {
		if (key.includes('font-family')) {
			fontName = val;
			response[fontName] = { weight: [], style: [] };
		}
		if (key.includes('font-weight'))
			response[fontName].weight.push(val.toString());

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

export const getAllFonts = (attr, recursiveKey = false) => {
	let fontName = '';
	const fontWeight = [];
	const fontStyle = [];

	const getAllFontsRecursively = obj => {
		Object.entries(obj).forEach(([key, val]) => {
			if (typeof val !== 'undefined') {
				if (key.includes('font-family')) {
					fontName = val;
				}
				if (key.includes('font-weight'))
					fontWeight.push(val.toString());

				if (key.includes('font-style')) fontStyle.push(val);

				if (isString(recursiveKey) && key.includes(recursiveKey)) {
					let recursiveFonts = {};
					Object.values(val).forEach(recursiveVal => {
						recursiveFonts = {
							...recursiveFonts,
							...recursiveVal,
						};
					});

					getAllFontsRecursively(recursiveFonts);
				}
			}
		});
	};

	getAllFontsRecursively(attr);

	const response = {};

	if (!isEmpty(fontName)) {
		response[fontName] = {};
		if (!isEmpty(fontWeight)) {
			response[fontName].weight = fontWeight.join(',');
		}
		if (!isEmpty(fontStyle)) {
			response[fontName].style = fontStyle.join(',');
		}
	}

	return response;
};

export const getPageFonts = () => {
	const { getBlocks } = select('core/block-editor');
	let response = {};

	const getBlockFonts = blocks => {
		Object.entries(blocks).forEach(([key, block]) => {
			const { attributes, innerBlocks, name } = block;

			if (name.includes('maxi') && !isEmpty(attributes)) {
				const typography = {
					...getGroupAttributes(attributes, 'typography'),
				};

				response = {
					...response,
					...getAllFonts(typography),
				};
			}

			if (!isEmpty(innerBlocks)) getBlockFonts(innerBlocks);
		});

		return null;
	};

	getBlockFonts(getBlocks());

	return response;
};
