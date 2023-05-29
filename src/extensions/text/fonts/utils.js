/**
 * WordPress dependencies
 */
import { select } from '@wordpress/data';

/**
 * External dependencies
 */
import { isEmpty, isString, cloneDeep, isObject } from 'lodash';

/**
 * Internal dependencies
 */
import { getAttributesValue, getGroupAttributes } from '../../attributes';
import { getCustomFormatValue } from '../formats';
import { goThroughMaxiBlocks } from '../../maxi-block';

const breakpoints = ['g', 'xxl', 'xl', 'l', 'm', 's', 'xs'];

export const getAllFonts = (
	attr,
	recursiveKey = false,
	isHover = false,
	textLevel = 'p',
	blockStyle = 'light',
	onlyBackend = false
) => {
	const { receiveMaxiSelectedStyleCard } = select('maxiBlocks/style-cards');
	const styleCard = receiveMaxiSelectedStyleCard()?.value || {};

	const result = {};

	const getAllFontsRecursively = obj => {
		breakpoints.forEach(breakpoint => {
			const fontName = obj[`_ff-${breakpoint}`];
			const fontWeight = obj[`_fwe-${breakpoint}`];
			const fontStyle = obj[`_fst-${breakpoint}`];

			if (fontName || fontWeight || fontStyle || breakpoint === 'g') {
				const finalFontName =
					fontName ??
					getCustomFormatValue({
						typography: { ...obj },
						prop: '_ff',
						breakpoint,
						isHover,
						textLevel,
						avoidSC: !onlyBackend,
						styleCard,
					}) ??
					`sc_font_${blockStyle}_${textLevel}`;

				let finalFontWeight =
					fontWeight ??
					getCustomFormatValue({
						typography: { ...obj },
						prop: '_fwe',
						breakpoint,
						isHover,
						textLevel,
						styleCard,
					})?.toString();

				let finalFontStyle =
					fontStyle ??
					getCustomFormatValue({
						typography: { ...obj },
						prop: '_fst',
						breakpoint,
						isHover,
						textLevel,
						styleCard,
					});

				if (result[finalFontName]) {
					const {
						fontWeight: currentFontWeight,
						fontStyle: currentFontStyle,
					} = result[finalFontName];

					if (
						currentFontWeight &&
						!currentFontWeight.includes(finalFontWeight)
					)
						finalFontWeight = `${currentFontWeight},${finalFontWeight}`;
					if (
						currentFontStyle &&
						!currentFontStyle.includes(finalFontStyle)
					)
						finalFontStyle = `${currentFontStyle},${finalFontStyle}`;
				}

				result[finalFontName] = {
					weight: finalFontWeight,
					style: finalFontStyle,
				};
			}
		});

		Object.entries(obj).forEach(([key, val]) => {
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

	return result;
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
			if (!targetValue.includes(sourceValue))
				target[key] = `${targetValue},${sourceValue}`;
		} else target[key] = sourceValue;
	});

	return target;
};

export const getPageFonts = (onlyBackend = false) => {
	let response = {};
	let oldResponse = {};
	let mergedResponse = {};
	const blocksWithFonts = [
		'maxi-blocks/number-counter-maxi',
		'maxi-blocks/button-maxi',
		'maxi-blocks/text-maxi',
		'maxi-blocks/image-maxi',
	];

	goThroughMaxiBlocks(({ attributes, name }) => {
		if (blocksWithFonts.includes(name) && !isEmpty(attributes)) {
			let typography = {};
			let typographyHover = {};
			const [blockStyle, rawTextLevel] = getAttributesValue({
				target: ['_bs', '_tl'],
				props: attributes,
			});
			let textLevel = rawTextLevel || 'p';

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
						...getGroupAttributes(attributes, 'typographyHover'),
					};
					textLevel = 'button';
					break;
				default:
					typography = {
						...getGroupAttributes(attributes, 'typography'),
					};
					typographyHover = {
						...getGroupAttributes(attributes, 'typographyHover'),
					};
					break;
			}

			if (typographyHover?.['t.sh'])
				response = mergeDeep(
					getAllFonts(
						typography,
						false,
						false,
						textLevel,
						blockStyle,
						onlyBackend
					),
					getAllFonts(
						typographyHover,
						false,
						true,
						textLevel,
						blockStyle,
						onlyBackend
					)
				);
			else
				response = getAllFonts(
					typography,
					false,
					false,
					textLevel,
					blockStyle,
					onlyBackend
				);

			mergedResponse = mergeDeep(
				cloneDeep(oldResponse),
				cloneDeep(response)
			);

			oldResponse = cloneDeep(mergedResponse);
		}
	});

	return mergedResponse;
};
