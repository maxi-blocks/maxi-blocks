/**
 * Internal dependencies
 */
import { getAttributeKey } from '../styles';

/**
 * External dependencies
 */
import { cloneDeep } from 'lodash';

const GLOBAL_EXCLUDE = ['uniqueID', 'customLabel'];

const excludeAttributes = (
	rawAttributesToExclude,
	attributes,
	copyPasteMapping
) => {
	const attributesToExclude = { ...rawAttributesToExclude };

	const keysToExclude = [
		...GLOBAL_EXCLUDE,
		...(copyPasteMapping._exclude || []),
	];

	keysToExclude.forEach(prop => {
		if (attributesToExclude[prop]) delete attributesToExclude[prop];
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

			attributesToExclude[key] = cloneDeep(
				attributesToExclude['background-layers']
			);

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
