/**
 * WordPress dependencies
 */
import { select } from '@wordpress/data';

/**
 * External dependencies
 */
import { isEmpty, isString, uniq, cloneDeep, isObject } from 'lodash';

/**
 * Internal dependencies
 */
import { getGroupAttributes } from '../../styles';
import getBreakpointFromAttribute from '../../styles/getBreakpointFromAttribute';
import { getCustomFormatValue } from '../formats';

export const getAllFonts = (
	attr,
	recursiveKey = false,
	isHover = false,
	textLevel = 'p'
) => {
	const { receiveMaxiSelectedStyleCard } = select('maxiBlocks/style-cards');
	const styleCard = receiveMaxiSelectedStyleCard()?.value || {};

	let fontName = '';
	const fontWeight = [];
	const fontStyle = [];

	const getAllFontsRecursively = obj => {
		Object.entries(obj).forEach(([key, val]) => {
			const breakpoint = getBreakpointFromAttribute(key);

			if (key.includes('font-family')) {
				if (typeof val !== 'undefined') fontName = val;
				else
					fontName = getCustomFormatValue({
						typography: { ...obj },
						prop: 'font-family',
						breakpoint,
						isHover,
						textLevel,
						styleCard,
					});
			}

			if (key.includes('font-weight')) {
				if (typeof val !== 'undefined')
					fontWeight.push(val?.toString());
				else {
					fontWeight.push(
						getCustomFormatValue({
							typography: { ...obj },
							prop: 'font-weight',
							breakpoint,
							isHover,
							textLevel,
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
						textLevel,
						styleCard,
					});
					if (styleSC !== 'normal')
						fontStyle.push(
							getCustomFormatValue({
								typography: { ...obj },
								prop: 'font-style',
								breakpoint,
								isHover,
								textLevel,
								styleCard,
							})
						);
				}
			}

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

	return response;
};

const mergeDeep = (target, source) => {
	if (!isObject(target) || !isObject(source)) {
		return source;
	}

	Object.keys(source).forEach(key => {
		const targetValue = target[key];
		const sourceValue = source[key];

		if (Array.isArray(targetValue) && Array.isArray(sourceValue)) {
			target[key] = targetValue.concat(sourceValue);
		} else if (typeof targetValue === 'undefined') {
			target[key] = sourceValue;
		} else if (isObject(targetValue) && isObject(sourceValue)) {
			target[key] = mergeDeep({ ...targetValue }, { ...sourceValue });
		} else if (isString(targetValue) && isString(sourceValue)) {
			target[key] = `${targetValue},${sourceValue}`;
		} else target[key] = sourceValue;
	});

	return target;
};

export const getPageFonts = () => {
	const { getBlocks } = select('core/block-editor');

	let response = {};
	let oldResponse = {};
	let mergedResponse = {};
	const blocksWithFonts = [
		'maxi-blocks/number-counter-maxi',
		'maxi-blocks/button-maxi',
		'maxi-blocks/text-maxi',
		'maxi-blocks/image-maxi',
	];

	const getBlockFonts = blocks => {
		Object.entries(blocks).forEach(([key, block]) => {
			const { attributes, innerBlocks, name } = block;

			if (blocksWithFonts.includes(name) && !isEmpty(attributes)) {
				let typography = {};
				let typographyHover = {};
				let textLevel = attributes?.textLevel || 'p';
				switch (name) {
					case 'maxi-blocks/number-counter-maxi':
						typography = {
							...getGroupAttributes(attributes, 'numberCounter'),
						};
						break;
					case 'maxi-blocks/button-maxi':
						typography = {
							...getGroupAttributes(attributes, 'typography'),
						};
						typographyHover = {
							...getGroupAttributes(
								attributes,
								'typographyHover'
							),
						};
						textLevel = 'button';
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

				if (typographyHover?.['typography-status-hover'])
					response = mergeDeep(
						getAllFonts(typography, false, false, textLevel),
						getAllFonts(typographyHover, false, true, textLevel)
					);
				else
					response = getAllFonts(typography, false, false, textLevel);

				mergedResponse = mergeDeep(
					cloneDeep(oldResponse),
					cloneDeep(response)
				);

				oldResponse = cloneDeep(mergedResponse);
			}

			if (!isEmpty(innerBlocks)) getBlockFonts(innerBlocks);
		});

		return null;
	};

	getBlockFonts(getBlocks());

	return mergedResponse;
};
