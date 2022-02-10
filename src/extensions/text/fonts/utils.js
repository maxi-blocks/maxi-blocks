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
import { getCustomFormatValue } from '../formats';

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
	const { receiveMaxiSelectedStyleCard } = select('maxiBlocks/style-cards');
	const styleCard = receiveMaxiSelectedStyleCard()?.value || {};

	let fontName = '';
	const fontWeight = [];
	const fontStyle = [];

	const getAllFontsRecursively = obj => {
		Object.entries(obj).forEach(([key, val]) => {
			const breakpoint = key.split('-').pop();
			if (key.includes('font-family'))
				typeof val !== 'undefined'
					? (fontName = val)
					: (fontName = getCustomFormatValue({
							typography: { obj },
							prop: 'font-family',
							breakpoint,
							styleCard,
					  }));

			if (key.includes('font-weight'))
				typeof val !== 'undefined'
					? fontWeight.push(val.toString())
					: fontWeight.push(
							getCustomFormatValue({
								typography: { obj },
								prop: 'font-weight',
								breakpoint,
								styleCard,
							})?.toString()
					  );

			if (key.includes('font-style'))
				typeof val !== 'undefined'
					? fontStyle.push(val)
					: fontStyle.push(
							getCustomFormatValue({
								typography: { obj },
								prop: 'font-style',
								breakpoint,
								styleCard,
							})
					  );

			if (
				typeof val !== 'undefined' &&
				isString(recursiveKey) &&
				key.includes(recursiveKey)
			) {
				let recursiveFonts = {};
				Object.values(val)?.forEach(recursiveVal => {
					recursiveFonts = {
						...recursiveFonts,
						...recursiveVal,
					};
				});

				getAllFontsRecursively(recursiveFonts);
			}
		});
	};

	getAllFontsRecursively(attr);

	const response = {};

	if (!isEmpty(fontName)) {
		response[fontName] = {};
		if (!isEmpty(fontWeight)) {
			response[fontName].weight = uniq(fontWeight).join(',');
		}
		if (!isEmpty(fontStyle)) {
			response[fontName].style = uniq(fontStyle).join(',');
		}
	}

	console.log(response);

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

				console.log('typography');
				console.log(typography);

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
