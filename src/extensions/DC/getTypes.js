/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { select } from '@wordpress/data';

/**
 * Internal dependencies
 */
import { typeOptions } from './constants';

/**
 * External dependencies
 */
import { isEmpty } from 'lodash';

const getTypes = (contentType, group = true, currentTemplateSlug = false) => {
	const customPostTypes = select('maxiBlocks/dynamic-content')
		.getCustomPostTypes()
		.map(type => {
			const postType = select('core').getPostType(type);

			return {
				label: postType.labels.singular_name,
				value: postType.slug,
			};
		})
		.filter(
			type =>
				type.value !== 'wp_font_family' && type.value !== 'wp_font_face'
		);
	const customTaxonomies = select('maxiBlocks/dynamic-content')
		.getCustomTaxonomies()
		.map(type => {
			const taxonomy = select('core').getTaxonomy(type);

			return {
				label: taxonomy.labels.singular_name,
				value: taxonomy.slug,
			};
		});

	const allArchives =
		currentTemplateSlug && currentTemplateSlug.includes('archive')
			? [
					{
						label: __('All archives', 'maxi-blocks'),
						value: 'archive',
					},
			  ]
			: [];

	if (group) {
		return isEmpty(customPostTypes)
			? typeOptions[contentType]
			: {
					'Standard types': currentTemplateSlug
						? [...typeOptions[contentType], ...allArchives]
						: typeOptions[contentType],
					'Custom types': [...customPostTypes, ...customTaxonomies],
			  };
	}

	return [
		...typeOptions[contentType],
		...customPostTypes,
		...customTaxonomies,
		...allArchives,
	];
};

export default getTypes;
