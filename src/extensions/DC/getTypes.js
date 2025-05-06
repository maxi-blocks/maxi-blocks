/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { select } from '@wordpress/data';

/**
 * Internal dependencies
 */

/**
 * External dependencies
 */
import { isEmpty } from 'lodash';

const getTypes = (
	contentType,
	group = true,
	currentTemplateSlug = false,
	source = 'wp'
) => {
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
				type.value !== 'wp_font_family' &&
				type.value !== 'wp_font_face' &&
				type.value !== 'wp_global_styles'
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

	const defaultOptions =
		source === 'acf'
			? select('maxiBlocks/dynamic-content').getACFTypeOptions()
			: select('maxiBlocks/dynamic-content').getTypeOptions()[
					contentType
			  ];

	if (group) {
		return isEmpty(customPostTypes)
			? [...defaultOptions, ...allArchives]
			: {
					'Standard types': currentTemplateSlug
						? [...defaultOptions, ...allArchives]
						: defaultOptions,
					'Custom types': [...customPostTypes, ...customTaxonomies],
			  };
	}

	return [
		...defaultOptions,
		...customPostTypes,
		...customTaxonomies,
		...allArchives,
	];
};

export default getTypes;
