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

const getTypes = (
	contentType,
	group = true,
	currentTemplateSlug = false,
	source = 'wp'
) => {
	// Fix for cases where contentType="acf" but source="wp"
	// This happens due to how the function is called in some places
	const isAcfSource = source === 'acf' || contentType === 'acf';

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

	// Only include taxonomies if NOT using ACF source
	const customTaxonomies = !isAcfSource
		? select('maxiBlocks/dynamic-content')
				.getCustomTaxonomies()
				.map(type => {
					const taxonomy = select('core').getTaxonomy(type);

					return {
						label: taxonomy.labels.singular_name,
						value: taxonomy.slug,
					};
				})
		: [];

	const allArchives =
		currentTemplateSlug && currentTemplateSlug.includes('archive')
			? [
					{
						label: __('All archives', 'maxi-blocks'),
						value: 'archive',
					},
			  ]
			: [];

	// Get the correct options based on whether this is ACF related
	const defaultOptions = isAcfSource
		? typeOptions.acf
		: typeOptions[contentType === 'acf' ? 'text' : contentType];

	if (group) {
		const result = isEmpty(customPostTypes)
			? [...defaultOptions, ...allArchives]
			: {
					'Standard types': currentTemplateSlug
						? [...defaultOptions, ...allArchives]
						: defaultOptions,
					'Custom types': [...customPostTypes, ...customTaxonomies],
			  };

		return result;
	}

	const result = [
		...defaultOptions,
		...customPostTypes,
		...customTaxonomies, // This is already empty for ACF source
		...allArchives,
	];

	return result;
};

export default getTypes;
