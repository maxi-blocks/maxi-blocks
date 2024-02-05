/**
 * WordPress dependencies
 */
import { select } from '@wordpress/data';

/**
 * Internal dependencies
 */
import { typeOptions } from './constants';

/**
 * External dependencies
 */
import { isEmpty } from 'lodash';

const getTypes = (contentType, group = true) => {
	const customPostTypes = select('maxiBlocks/dynamic-content')
		.getCustomPostTypes()
		.map(type => {
			const postType = select('core').getPostType(type);

			return {
				label: postType.labels.singular_name,
				value: postType.slug,
			};
		});
	const customTaxonomies = select('maxiBlocks/dynamic-content')
		.getCustomTaxonomies()
		.map(type => {
			const taxonomy = select('core').getTaxonomy(type);

			return {
				label: taxonomy.labels.singular_name,
				value: taxonomy.slug,
			};
		});

	if (group) {
		return isEmpty(customPostTypes)
			? typeOptions[contentType]
			: {
					'Standard types': typeOptions[contentType],
					'Custom types': [...customPostTypes, ...customTaxonomies],
			  };
	}

	return [
		...typeOptions[contentType],
		...customPostTypes,
		...customTaxonomies,
	];
};

export default getTypes;
