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

export const getAllFonts = (attr, recursiveKey = false, isHover = false) => {
	const { receiveMaxiSelectedStyleCard } = select('maxiBlocks/style-cards');
	const styleCard = receiveMaxiSelectedStyleCard()?.value || {};

	let fontName = '';
	const fontWeight = [];
	const fontStyle = [];

	const getAllFontsRecursively = obj => {
		Object.entries(obj).forEach(([key, val]) => {
			const breakpoint = key
				.replace(/-hover/g, '')
				.split('-')
				.pop();

			if (key.includes('font-family')) {
				console.log(key, val);
				if (typeof val !== 'undefined') fontName = val;
				else
					fontName = getCustomFormatValue({
						typography: { ...obj },
						prop: 'font-family',
						breakpoint,
						isHover,
						styleCard,
					});
			}

			if (key.includes('font-weight')) {
				if (typeof val !== 'undefined')
					fontWeight.push(val?.toString());
				else {
					const weightSC = getCustomFormatValue({
						typography: { ...obj },
						prop: 'font-weight',
						breakpoint,
						isHover,
						styleCard,
					});
					if (weightSC !== 400)
						fontWeight.push(
							getCustomFormatValue({
								typography: { ...obj },
								prop: 'font-weight',
								breakpoint,
								isHover,
								styleCard,
							})?.toString()
						);
				}
			}

			if (key.includes('font-style')) {
				if (typeof val !== 'undefined') fontStyle.push(val);
				else {
					const styleSC = getCustomFormatValue({
						typography: { ...obj },
						prop: 'font-style',
						breakpoint,
						isHover,
						styleCard,
					});
					if (styleSC !== 'normal')
						fontStyle.push(
							getCustomFormatValue({
								typography: { ...obj },
								prop: 'font-style',
								breakpoint,
								isHover,
								styleCard,
							})
						);
				}
			}

			console.log('fontName');
			console.log(fontName);

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

	console.log('response');
	console.log(response);

	return response;
};

export const getPageFonts = () => {
	const { getBlocks } = select('core/block-editor');

	let response = {};

	const getBlockFonts = blocks => {
		Object.entries(blocks).forEach(([key, block]) => {
			const { attributes, innerBlocks, name } = block;

			console.log(block);

			if (name.includes('maxi-blocks') && !isEmpty(attributes)) {
				let typography = {};
				let typographyHover = {};
				const prefix = '';
				switch (name) {
					case 'maxi-blocks/number-counter-maxi':
						typography = {
							...getGroupAttributes(attributes, 'numberCounter'),
						};
						break;
					case 'maxi-blocks/button-maxi':
						typography = {
							...getGroupAttributes(
								attributes,
								'typography',
								false,
								'button-'
							),
						};
						typographyHover = {
							...getGroupAttributes(
								attributes,
								'typography',
								true,
								'button-'
							),
						};

						break;

					default:
						typography = {
							...getGroupAttributes(attributes, 'typography'),
						};
						typographyHover = {
							...getGroupAttributes(
								attributes,
								'typographyHover'
							),
						};
						break;
				}

				// console.log('typography');
				// console.log(typography);
				// console.log('=======================');
				// console.log('typography Hover');
				// console.log(typographyHover);
				// console.log('=======================');

				response = {
					...response,
					...getAllFonts(typography, false, false),
					...getAllFonts(typographyHover, false, true),
				};
			}

			if (!isEmpty(innerBlocks)) getBlockFonts(innerBlocks);
		});

		return null;
	};

	getBlockFonts(getBlocks());

	return response;
};
