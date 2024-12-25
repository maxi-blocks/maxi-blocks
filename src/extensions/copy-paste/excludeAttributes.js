/**
 * Internal dependencies
 */
import { getAttributeKey, getDefaultAttribute } from '@extensions/styles';
import DC_LINK_BLOCKS from '@components/toolbar/components/link/dcLinkBlocks';

/**
 * External dependencies
 */
import { cloneDeep, isEqual, isNil } from 'lodash';

const GLOBAL_EXCLUDE = [
	'uniqueID',
	'customLabel',
	'dc-status',
	'dc-id',
	'cl-id',
	'dc-accumulator',
	'cl-accumulator',
	'cl-grandchild-accumulator',
];

const REPEATER_GLOBAL_EXCLUDE = GLOBAL_EXCLUDE.filter(
	key => key !== 'customLabel'
);

const ALL_TIME_EXCLUDE = [
	'content',
	'buttonContent',
	'captionContent',
	'altTitle',
	'altDescription',
	'number-counter-start',
	'number-counter-end',
	'url',
	'embedUrl',
	'linkSettings',
	'custom-formats',
	'dc-status',
	'dc-accumulator',
	'cl-id',
	'cl-accumulator',
	'cl-grandchild-accumulator',
];

const shouldDeleteKey = (
	prop,
	attributesToExclude,
	attributes,
	isRepeater,
	blockName,
	customAllTimeExclude
) => {
	if (isNil(attributesToExclude[prop])) {
		return false;
	}

	if (isRepeater) {
		const isSvgIconMaxiException =
			blockName === 'maxi-blocks/svg-icon-maxi' && prop === 'content';
		const isInAllTimeExclude = [
			...ALL_TIME_EXCLUDE,
			...customAllTimeExclude,
		].includes(prop);
		const isEqualToDefault = isEqual(
			attributes?.[prop],
			getDefaultAttribute(prop)
		);

		const isDCLinkBlocksException =
			prop === 'dc-status' && DC_LINK_BLOCKS.includes(blockName);

		return (
			(!isSvgIconMaxiException &&
				!isDCLinkBlocksException &&
				isInAllTimeExclude) ||
			!isEqualToDefault
		);
	}

	return true;
};

const processBackgroundLayers = (attributesToExclude, attributes) => {
	['background-layers', 'background-layers-hover'].forEach(key => {
		if (!attributesToExclude[key]) return;

		attributesToExclude[key] = cloneDeep(attributesToExclude[key]);
		attributesToExclude[key].forEach((layer, index) => {
			if (layer.type !== 'image') {
				return;
			}

			['mediaID', 'mediaURL'].forEach(prop => {
				const attrKey = getAttributeKey(
					prop,
					false,
					'background-image-'
				);
				if (layer[attrKey] && attributes[key]?.[index]?.[attrKey]) {
					layer[attrKey] = attributes[key][index][attrKey];
				}
			});
		});
	});
};

const excludeAttributes = (
	rawAttributesToExclude,
	attributes,
	copyPasteMapping,
	isRepeater = false,
	blockName,
	customAllTimeExclude = []
) => {
	const attributesToExclude = { ...rawAttributesToExclude };

	const keysToExclude = [
		...(isRepeater ? REPEATER_GLOBAL_EXCLUDE : GLOBAL_EXCLUDE),
		...(copyPasteMapping._exclude || []),
	];

	keysToExclude.forEach(prop => {
		if (
			shouldDeleteKey(
				prop,
				attributesToExclude,
				attributes,
				isRepeater,
				blockName,
				customAllTimeExclude
			)
		) {
			delete attributesToExclude[prop];
		}
	});

	if (
		attributes &&
		(Object.keys(attributesToExclude).includes('background-layers') ||
			Object.keys(attributesToExclude).includes(
				'background-layers-hover'
			))
	) {
		processBackgroundLayers(attributesToExclude, attributes);
	}

	return attributesToExclude;
};

export default excludeAttributes;
