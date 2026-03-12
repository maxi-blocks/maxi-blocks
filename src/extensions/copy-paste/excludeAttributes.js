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
	'dc-limit-by-archive',
	'cl-limit-by-archive',
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

const DEFAULT_ATTRIBUTE_CACHE = new Map();
const ALL_TIME_EXCLUDE_SET = new Set(ALL_TIME_EXCLUDE);
const ALL_TIME_EXCLUDE_SET_CACHE = new Map();
const KEYS_TO_EXCLUDE_CACHE = {
	repeater: new WeakMap(),
	default: new WeakMap(),
};
const EMPTY_COPY_PASTE_MAPPING = {};

const getDefaultAttributeValue = prop => {
	if (!DEFAULT_ATTRIBUTE_CACHE.has(prop)) {
		DEFAULT_ATTRIBUTE_CACHE.set(prop, getDefaultAttribute(prop));
	}

	return DEFAULT_ATTRIBUTE_CACHE.get(prop);
};

const getAllTimeExcludeSet = customAllTimeExclude => {
	if (!customAllTimeExclude?.length) {
		return ALL_TIME_EXCLUDE_SET;
	}

	const cacheKey = customAllTimeExclude.join('\0');

	if (!ALL_TIME_EXCLUDE_SET_CACHE.has(cacheKey)) {
		ALL_TIME_EXCLUDE_SET_CACHE.set(
			cacheKey,
			new Set([...ALL_TIME_EXCLUDE, ...customAllTimeExclude])
		);
	}

	return ALL_TIME_EXCLUDE_SET_CACHE.get(cacheKey);
};

const getKeysToExclude = (copyPasteMapping, isRepeater) => {
	const cache = isRepeater
		? KEYS_TO_EXCLUDE_CACHE.repeater
		: KEYS_TO_EXCLUDE_CACHE.default;
	const cacheKey = copyPasteMapping || EMPTY_COPY_PASTE_MAPPING;

	if (!cache.has(cacheKey)) {
		cache.set(cacheKey, [
			...(isRepeater ? REPEATER_GLOBAL_EXCLUDE : GLOBAL_EXCLUDE),
			...((copyPasteMapping?._exclude || [])),
		]);
	}

	return cache.get(cacheKey);
};

const shouldDeleteKey = (
	prop,
	attributesToExclude,
	attributes,
	isRepeater,
	blockName,
	allTimeExcludeSet,
	isDCLinkBlock
) => {
	if (isNil(attributesToExclude[prop])) {
		return false;
	}

	if (isRepeater) {
		const isSvgIconMaxiException =
			blockName === 'maxi-blocks/svg-icon-maxi' && prop === 'content';
		const isInAllTimeExclude = allTimeExcludeSet.has(prop);
		const isEqualToDefault = isEqual(
			attributes?.[prop],
			getDefaultAttributeValue(prop)
		);
		const isDCLinkBlocksException = prop === 'dc-status' && isDCLinkBlock;

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
	const keysToExclude = getKeysToExclude(copyPasteMapping, isRepeater);
	const allTimeExcludeSet = getAllTimeExcludeSet(customAllTimeExclude);
	const isDCLinkBlock = DC_LINK_BLOCKS.includes(blockName);

	keysToExclude.forEach(prop => {
		if (
			shouldDeleteKey(
				prop,
				attributesToExclude,
				attributes,
				isRepeater,
				blockName,
				allTimeExcludeSet,
				isDCLinkBlock
			)
		) {
			delete attributesToExclude[prop];
		}
	});

	if (
		attributes &&
		('background-layers' in attributesToExclude ||
			'background-layers-hover' in attributesToExclude)
	) {
		processBackgroundLayers(attributesToExclude, attributes);
	}

	return attributesToExclude;
};

export default excludeAttributes;
