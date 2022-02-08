/**
 * External dependencies
 */
import { isEmpty, isString } from 'lodash';

const getAllFonts = (attr, recursiveKey = false) => {
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

export default getAllFonts;
