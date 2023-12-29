/**
 * WordPress dependencies
 */
import { resolveSelect } from '@wordpress/data';

/**
 * Internal dependencies
 */
import { nameDictionary, typeOptions } from './constants';

/**
 * External dependencies
 */
import { isEmpty } from 'lodash';

// Standard types that are not supported by Maxi
const excludedStandardTypes = [
	'nav_menu_item',
	'wp_block',
	'wp_template',
	'wp_template_part',
	'wp_navigation',
];

const getPostTypes = async contentType => {
	const allPostTypes = await resolveSelect('core').getPostTypes();
	const standardPostTypes = typeOptions[contentType].map(
		option => nameDictionary[option.value]
	);

	const excludedTypes = new Set([
		...standardPostTypes,
		...excludedStandardTypes,
	]);

	const customPostTypes = allPostTypes
		.filter(postType => !excludedTypes.has(postType.slug))
		.map(postType => ({
			label: postType.labels.singular_name,
			value: postType.slug,
		}));

	return isEmpty(customPostTypes)
		? typeOptions[contentType]
		: {
				'Standard types': typeOptions[contentType],
				'Custom types': customPostTypes,
		  };
};

export default getPostTypes;
