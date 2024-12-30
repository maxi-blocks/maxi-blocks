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
import { getGroupAttributes } from '@extensions/styles';
import getAttributeKey from '@extensions/styles/getAttributeKey';
import { getCustomFormatValue } from '@extensions/text/formats';
import { goThroughMaxiBlocks } from '@extensions/maxi-block';

const breakpoints = ['general', 'xxl', 'xl', 'l', 'm', 's', 'xs'];

export const getAllFonts = (
	attr,
	recursiveKey = false,
	isHover = false,
	textLevel = 'p',
	blockStyle = 'light',
	onlyBackend = false,
	prefixes = ['']
) => {
	const { receiveMaxiSelectedStyleCard } = select('maxiBlocks/style-cards');
	const styleCard = receiveMaxiSelectedStyleCard()?.value || {};

	const result = {};

	const getAllFontsRecursively = obj => {
		breakpoints.forEach(breakpoint => {
			prefixes.forEach(prefix => {
				const propertiesToCheck = [
					'font-family',
					'font-weight',
					'font-style',
				];

				let finalFontName = null;
				let finalFontWeight = null;
				let finalFontStyle = null;

				propertiesToCheck.forEach(baseProperty => {
					const property = getAttributeKey(
						baseProperty,
						isHover,
						prefix,
						breakpoint
					);
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
							finalFontName = finalValue;
						} else if (baseProperty.includes('font-weight')) {
							finalValue =
								value ??
								getCustomFormatValue({
									typography: { ...obj },
									prop: 'font-weight',
									breakpoint,
									isHover,
									textLevel,
									styleCard,
								})?.toString();
							finalFontWeight = finalValue;
						} else if (baseProperty.includes('font-style')) {
							finalValue =
								value ??
								getCustomFormatValue({
									typography: { ...obj },
									prop: 'font-style',
									breakpoint,
									isHover,
									textLevel,
									styleCard,
								});
							finalFontStyle = finalValue;
						}

						// Update the result object if we have a final font name
						if (finalFontName) {
							if (!result[finalFontName]) {
								result[finalFontName] = {
									weight: undefined,
									style: undefined,
								};
							}

							if (finalFontWeight) {
								result[finalFontName].weight = finalFontWeight;
							}

							if (finalFontStyle) {
								result[finalFontName].style = finalFontStyle;
							}
						}
					}
				});
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
		'maxi-blocks/list-item-maxi',
		'maxi-blocks/image-maxi',
		'maxi-blocks/accordion-maxi',
		'maxi-blocks/search-maxi',
		'maxi-blocks/map-maxi',
		'maxi-blocks/row-maxi', // Pagination
		'maxi-blocks/column-maxi', // Pagination
		'maxi-blocks/group-maxi', // Pagination
		'maxi-blocks/container-maxi', // Pagination
	];

	const gutenbergBlocksStatus = select(
		'maxiBlocks/style-cards'
	).receiveMaxiActiveStyleCard()?.value?.gutenberg_blocks_status;

	goThroughMaxiBlocks(({ clientId, attributes, name }) => {
		if (blocksWithFonts.includes(name) && !isEmpty(attributes)) {
			let typography = {};
			let typographyHover = {};
			let textLevel = attributes?.textLevel || 'p';
			const { blockStyle } = attributes;
			const prefixes = [''];

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
				case 'maxi-blocks/column-maxi':
				case 'maxi-blocks/group-maxi':
				case 'maxi-blocks/container-maxi':
					typography = {
						...getGroupAttributes(
							attributes,
							'typography',
							false,
							'cl-pagination-'
						),
					};
					prefixes.push('cl-pagination-');
					break;
				case 'maxi-blocks/map-maxi':
					typography = {
						...getGroupAttributes(attributes, 'typography'),
						...getGroupAttributes(
							attributes,
							'typography',
							false,
							'description-'
						),
					};
					prefixes.push('description-');
					break;
				case 'maxi-blocks/accordion-maxi':
					typography = {
						...getGroupAttributes(
							attributes,
							'typography',
							false,
							'title-'
						),
						...getGroupAttributes(
							attributes,
							'typography',
							false,
							'active-title-'
						),
					};
					typographyHover = {
						...getGroupAttributes(
							attributes,
							'typographyHover',
							false,
							'title-'
						),
					};
					prefixes.push(...['title-', 'active-title-']);
					break;
				case 'maxi-blocks/search-maxi':
					typography = {
						...getGroupAttributes(
							attributes,
							'typography',
							false,
							'button-'
						),
						...getGroupAttributes(
							attributes,
							'typography',
							false,
							'input-'
						),
					};
					typographyHover = {
						...getGroupAttributes(
							attributes,
							'typographyHover',
							false,
							'button-'
						),
						...getGroupAttributes(
							attributes,
							'typographyHover',
							false,
							'input-'
						),
					};
					prefixes.push('button-', 'input-');
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

			if (
				prefixes.some(
					prefix =>
						typographyHover?.[`${prefix}typography-status-hover`]
				)
			)
				response = mergeDeep(
					getAllFonts(
						typography,
						'custom-formats',
						false,
						textLevel,
						blockStyle,
						onlyBackend,
						prefixes
					),
					getAllFonts(
						typographyHover,
						'custom-formats',
						true,
						textLevel,
						blockStyle,
						onlyBackend,
						prefixes
					)
				);
			else
				response = getAllFonts(
					typography,
					'custom-formats',
					false,
					textLevel,
					blockStyle,
					onlyBackend,
					prefixes
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
