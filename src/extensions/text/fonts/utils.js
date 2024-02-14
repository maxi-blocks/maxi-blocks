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
import { getGroupAttributes } from '../../styles';
import { getCustomFormatValue } from '../formats';
import { goThroughMaxiBlocks } from '../../maxi-block';

const breakpoints = ['general', 'xxl', 'xl', 'l', 'm', 's', 'xs'];

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
			const propertiesToCheck = [
				'font-family',
				'font-weight',
				'font-style',
				// Add new font property bases here
				'cl-pagination-font-family',
				'cl-pagination-font-weight',
				'cl-pagination-font-style',
			];

			propertiesToCheck.forEach(baseProperty => {
				const property = `${baseProperty}-${breakpoint}`;
				const value = obj[property];

				if (value || breakpoint === 'general') {
					const finalPropertyName = baseProperty.includes(
						'cl-pagination'
					)
						? baseProperty.replace(`-${breakpoint}`, '')
						: baseProperty;
					let finalValue;

					if (baseProperty.includes('font-family')) {
						finalValue =
							value ??
							getCustomFormatValue({
								typography: { ...obj },
								prop: 'font-family',
								breakpoint,
								isHover,
								textLevel,
								avoidSC: !onlyBackend,
								styleCard,
							}) ??
							(finalPropertyName.includes('pagination')
								? undefined
								: `sc_font_${blockStyle}_${textLevel}`);
					} else if (baseProperty.includes('font-weight')) {
						finalValue =
							value ??
							getCustomFormatValue({
								typography: { ...obj },
								prop: 'font-weight',
								breakpoint,
								isHover,
								textLevel,
								avoidSC: !onlyBackend,
								styleCard,
							})?.toString();
					} else if (baseProperty.includes('font-style')) {
						finalValue =
							value ??
							getCustomFormatValue({
								typography: { ...obj },
								prop: 'font-style',
								breakpoint,
								isHover,
								textLevel,
								avoidSC: !onlyBackend,
								styleCard,
							});
					}

					// Process and store the final font information
					if (finalValue) {
						let finalFontName;
						let finalFontWeight;
						let finalFontStyle;

						if (finalPropertyName.includes('font-family')) {
							finalFontName = finalValue;
						} else if (finalPropertyName.includes('font-weight')) {
							finalFontWeight = finalValue;
						} else if (finalPropertyName.includes('font-style')) {
							finalFontStyle = finalValue;
						}

						// Assuming result is the accumulator for fonts
						if (finalFontName) {
							if (!result[finalFontName]) {
								result[finalFontName] = {
									weight: undefined,
									style: undefined,
								};
							}
							if (
								finalFontWeight &&
								!result[finalFontName].weight?.includes(
									finalFontWeight
								)
							) {
								result[finalFontName].weight = result[
									finalFontName
								].weight
									? `${result[finalFontName].weight},${finalFontWeight}`
									: finalFontWeight;
							}
							if (
								finalFontStyle &&
								!result[finalFontName].style?.includes(
									finalFontStyle
								)
							) {
								result[finalFontName].style = result[
									finalFontName
								].style
									? `${result[finalFontName].style},${finalFontStyle}`
									: finalFontStyle;
							}
						}
					}
				}
			});
		});

		// Recursively process nested properties
		Object.entries(obj).forEach(([key, val]) => {
			if (
				typeof val === 'object' &&
				val !== null &&
				recursiveKey &&
				key.includes(recursiveKey)
			) {
				Object.values(val).forEach(recursiveVal => {
					getAllFontsRecursively(recursiveVal);
				});
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
		'maxi-blocks/row-maxi', // Pagination
	];

	const gutenbergBlocksStatus = select(
		'maxiBlocks/style-cards'
	).receiveMaxiActiveStyleCard().value.gutenberg_blocks_status;

	goThroughMaxiBlocks(({ clientId, attributes, name }) => {
		if (blocksWithFonts.includes(name) && !isEmpty(attributes)) {
			let typography = {};
			let typographyHover = {};
			let textLevel = attributes?.textLevel || 'p';
			const { blockStyle } = attributes;

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
				case 'maxi-blocks/row-maxi':
					typography = {
						...getGroupAttributes(
							attributes,
							'typography',
							false,
							'cl-pagination-'
						),
					};
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

			if (typographyHover?.['typography-status-hover'])
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

		if (gutenbergBlocksStatus && name.includes('core/')) {
			const parentsClientIds =
				select('core/block-editor').getBlockParents(clientId);
			const isBlockInMaxiBlock = parentsClientIds.some(parentClientId =>
				select('core/block-editor')
					.getBlockName(parentClientId)
					.includes('maxi-blocks/')
			);

			if (isBlockInMaxiBlock) {
				const { level } = attributes;

				const getTextLevel = () => {
					if (name === 'core/button') return 'button';
					if (level) return `h${level}`;
					return 'p';
				};

				const textLevel = getTextLevel();

				response = getAllFonts(
					{},
					false,
					false,
					textLevel,
					undefined,
					onlyBackend
				);

				mergedResponse = mergeDeep(
					cloneDeep(oldResponse),
					cloneDeep(response)
				);

				oldResponse = cloneDeep(mergedResponse);
			}
		}
	}, true);

	return mergedResponse;
};
