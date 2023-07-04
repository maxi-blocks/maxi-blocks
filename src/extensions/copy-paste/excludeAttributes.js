/**
 * Internal dependencies
 */
import { getAttributeKey, getDefaultAttribute } from '../styles';

/**
 * External dependencies
 */
import { cloneDeep } from 'lodash';

const GLOBAL_EXCLUDE = ['uniqueID', 'customLabel'];

const REPEATER_GLOBAL_EXCLUDE = GLOBAL_EXCLUDE.filter(
	key => key !== 'customLabel'
);

const TEXT_CONTENT_EXCLUDE = [
	'content',
	'buttonContent',
	'captionContent',
	'altTitle',
	'altDescription',
];

const excludeAttributes = (
	rawAttributesToExclude,
	attributes,
	copyPasteMapping,
	isRepeater = false,
	blockName
) => {
	const attributesToExclude = { ...rawAttributesToExclude };

	const keysToExclude = [
		...(isRepeater ? REPEATER_GLOBAL_EXCLUDE : GLOBAL_EXCLUDE),
		...(copyPasteMapping._exclude || []),
	];

	keysToExclude.forEach(prop => {
		if (
			attributesToExclude[prop] &&
			(!isRepeater ||
				(isRepeater &&
					((!(
						blockName === 'maxi-blocks/svg-icon-maxi' &&
						prop === 'content'
					) &&
						TEXT_CONTENT_EXCLUDE.includes(prop)) ||
						attributes?.[prop] !== getDefaultAttribute(prop))))
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
