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
		attributesToExclude['background-layers'] = cloneDeep(
			attributesToExclude['background-layers']
		);

		attributesToExclude['background-layers'].forEach((layer, index) => {
			if (layer.type === 'image') {
				['mediaID', 'mediaURL'].forEach(prop => {
					const key = getAttributeKey(
						prop,
						false,
						'background-image-'
					);

					if (layer[key]) {
						if (attributes['background-layers']?.[index]?.[key]) {
							layer[key] =
								attributes['background-layers'][index][key];
						}
					}
				});
			}
		});
	}

	return attributesToExclude;
};

export default excludeAttributes;
