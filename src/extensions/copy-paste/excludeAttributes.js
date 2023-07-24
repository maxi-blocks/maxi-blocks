/**
 * Internal dependencies
 */
import { getAttributeKey, getDefaultAttribute } from '../styles';

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
];

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
			!isNil(attributesToExclude[prop]) &&
			(!isRepeater ||
				(isRepeater &&
					((!(
						blockName === 'maxi-blocks/svg-icon-maxi' &&
						prop === 'content'
					) &&
						[...ALL_TIME_EXCLUDE, ...customAllTimeExclude].includes(
							prop
						)) ||
						!isEqual(
							attributes?.[prop],
							getDefaultAttribute(prop)
						))))
		)
			delete attributesToExclude[prop];
	});

	if (
		attributes &&
		(Object.keys(attributesToExclude).includes('background-layers') ||
			Object.keys(attributesToExclude).includes(
				'background-layers-hover'
			))
	) {
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
	}

	return attributesToExclude;
};

export default excludeAttributes;
