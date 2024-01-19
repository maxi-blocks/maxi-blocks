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

const getPostTypes = async contentType => {
	const customPostTypes = select('maxiBlocks/dynamic-content')
		.getCustomPostTypes()
		.map(type => {
			const postType = select('core').getPostType(type);

			return {
				label: postType.labels.singular_name,
				value: postType.slug,
			};
		});

	return isEmpty(customPostTypes)
		? typeOptions[contentType]
		: {
				'Standard types': typeOptions[contentType],
				'Custom types': customPostTypes,
		  };
};

export default getPostTypes;
