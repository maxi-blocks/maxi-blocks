/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { resolveSelect, select } from '@wordpress/data';

/**
 * Internal dependencies
 */
import {
	fieldOptions,
	relationOptions,
	orderByRelations,
	currentEntityTypes,
	nameDictionary,
	relationDictionary,
	postTypeRelationOptions,
	taxonomyRelationOptions,
	linkTypesOptions,
	linkFieldsOptions,
} from './constants';
import getTypes from './getTypes';

/**
 * External dependencies
 */
import { isEmpty, isNumber, invert } from 'lodash';
import DOMPurify from 'dompurify';

const showCurrent = (type, currentTemplateType) => {
	if (!type || !currentTemplateType) {
		return false;
	}
	const allowedTemplateTypesCurrent = [
		'category',
		'tag',
		'author',
		'date',
		'archive',
		'single',
		'page',
	];

	if (
		allowedTemplateTypesCurrent.includes(currentTemplateType) &&
		(type?.includes(currentTemplateType) ||
			(type === 'users' && currentTemplateType === 'author'))
	)
		return true;

	if (currentTemplateType === 'single' && type === 'posts') return true;
	if (currentTemplateType === 'category' && type === 'categories')
		return true;
	if (
		currentTemplateType.includes('taxonomy') &&
		currentTemplateType.includes(type)
	)
		return true;
	if (currentTemplateType === 'author' && type === 'users') return true;
	if (
		currentTemplateType.includes('single-') &&
		currentTemplateType.includes(type)
	)
		return true;
	// for specific single post templates
	if (currentTemplateType.includes('single-post-') && type === 'posts')
		return true;
	// for specific author templates
	if (currentTemplateType.includes('author-') && type === 'users')
		return true;
	// for specific category templates
	if (currentTemplateType.includes('category-') && type === 'categories')
		return true;
	// for specific tag templates
	if (currentTemplateType.includes('tag-') && type === 'tags') return true;
	// for specific woo products templates
	if (currentTemplateType.includes('single-product') && type === 'products')
		return true;
	// for taxonomies archive
	if (
		currentTemplateType.includes('taxonomy') &&
		currentTemplateType.includes(type)
	)
		return true;
	if (currentTemplateType.includes('taxonomy') && type.includes('posts'))
		return true;

	return false;
};

const showCurrentArchive = (type, currentTemplateType) => {
	const allowedTemplateTypes = [
		'category',
		'tag',
		'author',
		'date',
		'archive',
	];

	if (
		(allowedTemplateTypes.includes(currentTemplateType) ||
			allowedTemplateTypes.some(template =>
				currentTemplateType.includes(template)
			)) &&
		type.includes('posts')
	)
		return true;

	if (type.includes('posts') && currentTemplateType.includes('taxonomy'))
		return true;

	return false;
};

/**
 * Determines whether to show the "Limit by current archive posts" option
 * @param {string} type                - DC/CL type
 * @param {string} currentTemplateType - Current template type
 * @param {string} relation            - Current relation
 * @returns {boolean} Whether to show the limit by archive option
 */
export const showLimitByArchiveOption = (
	type,
	currentTemplateType,
	relation
) => {
	// Only show if we're in an archive context and relation is not current-archive
	return (
		showCurrentArchive(type, currentTemplateType) &&
		relation !== 'current-archive'
	);
};

export const parseText = value => {
	const parser = new DOMParser();
	const doc = parser.parseFromString(DOMPurify.sanitize(value), 'text/html');
	return doc.body.textContent;
};

export const cutTags = str => {
	if (!str) return '';
	const regex = /( |<([^>]+)>)/gi;
	const result = str.replace(regex, ' ');
	return result;
};

export const getSimpleText = str => {
	if (!str) return '';
	const result = str
		.replace(/<style.*?<\/style>/g, '')
		.replace(/<svg.*?<\/svg>/g, '');

	return cutTags(result);
};

export const limitString = (value, limit) => {
	if (limit <= 0) return value;
	const str = cutTags(value).trim();
	return str.length > limit ? `${str.substr(0, limit)}…` : str;
};

/**
 * Retrieves the link targets based on selected DC type and field.
 *
 * @param {string} type  - DC type.
 * @param {string} field - DC field.
 * @returns {Array} An array of link targets with label and value keys.
 */
export const getLinkTargets = (type, field) => {
	const targets = [];

	targets.push({
		label: __('Selected entity', 'maxi-blocks'),
		value: 'entity',
	});

	targets.push(...linkTypesOptions[type]);
	targets.push(...linkFieldsOptions[field]);

	const customTaxonomies = select(
		'maxiBlocks/dynamic-content'
	).getCustomTaxonomies();

	if (customTaxonomies.includes(field)) {
		const capitalizedField = field.charAt(0).toUpperCase() + field.slice(1);
		targets.push({
			label: `${capitalizedField} ${__('links', 'maxi-blocks')}`,
			value: field,
		});
	}

	return targets;
};

// In case content is empty, show this text
export const sanitizeDCContent = content =>
	!isEmpty(content) || isNumber(content)
		? __(content, 'maxi-blocks')
		: __('No content found', 'maxi-blocks');

export const getItemLinkContent = (item, linkStatus) =>
	linkStatus
		? `<a class="maxi-text-block--link"><span>${item}</span></a>`
		: item;

export const getTaxonomyContent = async (
	taxonomyIds,
	delimiterContent,
	linkStatus,
	taxonomyType
) => {
	if (!taxonomyIds || !taxonomyIds.length) return null;

	const { getEntityRecords } = resolveSelect('core');

	const taxonomyArray = await getEntityRecords('taxonomy', taxonomyType, {
		include: taxonomyIds,
	});

	if (!taxonomyArray || !taxonomyArray.length) return null;

	const namesArray = taxonomyArray.map(({ name }) =>
		getItemLinkContent(name, linkStatus)
	);

	return linkStatus
		? `<span>${namesArray.join(`${delimiterContent} `)}</span>`
		: namesArray.join(`${delimiterContent} `);
};

const getCustomPostTypeFields = (contentType, type) => {
	// TODO: refactor possibly by filtering post/page fields
	const fields = [];

	const addField = (label, value) => {
		fields.push({
			label: __(label, 'maxi-blocks'),
			value,
		});
	};

	if (contentType === 'divider') {
		addField('Static', 'static_text');
		return fields;
	}

	const postType = select('core').getPostType(type);

	if (contentType === 'image') {
		if (postType.supports.thumbnail) {
			addField('Featured image', 'featured_media');
		}

		return fields;
	}

	if (contentType === 'text' || contentType === 'button') {
		addField('Static text', 'static_text');
	}

	if (postType.supports.title) {
		addField('Title', 'title');
	}
	if (postType.supports.editor) {
		addField('Content', 'content');
	}
	if (postType.supports.excerpt) {
		addField('Excerpt', 'excerpt');
	}
	addField('Date', 'date');
	if (postType.supports.author) {
		addField('Author', 'author');
	}
	if (postType?.taxonomies)
		postType.taxonomies.forEach(taxonomy => {
			if (taxonomy === 'category') {
				addField('Categories', 'categories');
			} else if (taxonomy === 'post_tag') {
				addField('Tags', 'tags');
			} else {
				// Capitalize the first letter of the taxonomy
				const label = taxonomy
					.split('-')
					.map(word => word.charAt(0).toUpperCase() + word.slice(1))
					.join(' ');
				addField(label, taxonomy);
			}
		});
	if (postType.supports.comments) {
		addField('Comments', 'comments');
	}

	return fields;
};

export const getCurrentTemplateSlug = () => {
	const editSite = select('core/edit-site');
	if (!editSite) return null;

	const currentTemplateTypeRaw =
		editSite?.getEditedPostContext()?.templateSlug ||
		editSite?.getEditedPostId(); // fix for WordPress 6.5

	if (!currentTemplateTypeRaw) return null;

	// Extract the part after '//' if it exists
	const [, currentTemplateType] = currentTemplateTypeRaw.split('//');

	return currentTemplateType || currentTemplateTypeRaw;
};

const getCustomTaxonomyFields = type => {
	const fields = [];

	const taxonomy = select('core').getTaxonomy(type);

	const addField = (label, value) => {
		fields.push({
			label: __(label, 'maxi-blocks'),
			value,
		});
	};

	addField('Name', 'name');
	addField('Description', 'description');
	addField('Slug', 'slug');
	if (taxonomy.hierarchical) {
		addField('Parent', 'parent');
	}
	addField('Count', 'count');
	addField('Link', 'link');
	if (getCurrentTemplateSlug()?.includes(type)) {
		addField("Archive type's name", 'archive-type');
	}

	return fields;
};

// Utility function to add an item to the options array if it doesn't already exist
const addUniqueOption = (options, newItem) => {
	if (!options || !newItem) return options;

	if (
		!options.some(
			item =>
				item?.label === newItem?.label && item?.value === newItem?.value
		)
	) {
		options.push(newItem);
	}

	return options.filter(Boolean);
};

export const getFields = (contentType, type) => {
	const { getCustomPostTypes, getCustomTaxonomies } = select(
		'maxiBlocks/dynamic-content'
	);

	const customPostTypes = getCustomPostTypes();
	if (customPostTypes.includes(type)) {
		return getCustomPostTypeFields(contentType, type);
	}

	const customTaxonomies = getCustomTaxonomies();
	if (customTaxonomies.includes(type)) {
		return getCustomTaxonomyFields(type);
	}

	const isFSE = select('core/edit-site') !== undefined;
	if (isFSE) {
		if (
			contentType !== 'image' &&
			showCurrent(type, getCurrentTemplateSlug())
		) {
			const newItem = {
				label: __("Archive type's name", 'maxi-blocks'),
				value: 'archive-type',
			};
			const options =
				fieldOptions[contentType]?.[type] ||
				fieldOptions[contentType]?.categories;
			addUniqueOption(options, newItem);
			return options;
		}
	}

	return fieldOptions[contentType]?.[type];
};

const getPostTypeRelationOptions = type => {
	const postType = select('core').getPostType(type);

	const relationOptions = [...postTypeRelationOptions];

	if (postType.supports.title) {
		relationOptions.push({
			label: __('Get alphabetical', 'maxi-blocks'),
			value: 'alphabetical',
		});
	}
	if (postType.supports.author) {
		relationOptions.push({
			label: __('Get by author', 'maxi-blocks'),
			value: 'by-author',
		});
	}
	if (postType.taxonomies.includes('category')) {
		relationOptions.push({
			label: __('Get by category', 'maxi-blocks'),
			value: 'by-category',
		});
	}
	if (postType.taxonomies.includes('post_tag')) {
		relationOptions.push({
			label: __('Get by tag', 'maxi-blocks'),
			value: 'by-tag',
		});
	}

	return relationOptions;
};

const getTaxonomyRelationOptions = () => taxonomyRelationOptions;

export const getRelationOptions = (type, contentType, currentTemplateType) => {
	let options;

	if (
		select('maxiBlocks/dynamic-content').getCustomPostTypes().includes(type)
	) {
		options = getPostTypeRelationOptions(type);
	} else if (
		select('maxiBlocks/dynamic-content')
			.getCustomTaxonomies()
			.includes(type)
	)
		options = getTaxonomyRelationOptions();
	else {
		options = relationOptions[contentType]?.[type];
		if (type !== 'archive') {
			const ct = select(
				'maxiBlocks/dynamic-content'
			).getCustomTaxonomies();
			const ctOptions = ct.map(taxonomy => ({
				label: `Get by ${taxonomy.replace(/_/g, ' ')}`,
				value: `by-custom-taxonomy-${taxonomy}`,
			}));

			const mergedOptions = [...options, ...ctOptions];
			options = mergedOptions;
		}
	}

	const currentPostType = select('core/editor').getCurrentPostType();
	if (type.includes(currentPostType) || currentPostType?.includes(type)) {
		const newItem = {
			label: __("Get the current item's data", 'maxi-blocks'),
			value: 'current',
		};

		addUniqueOption(options, newItem);
	}
	if (currentTemplateType) {
		// Check if currentTemplateType is one of the allowed types
		if (showCurrentArchive(type, currentTemplateType)) {
			const newItem = {
				label: __("Get the current archive's posts", 'maxi-blocks'),
				value: 'current-archive',
			};

			addUniqueOption(options, newItem);
		}

		// Check if currentTemplateType is one of the allowed types
		if (showCurrent(type, currentTemplateType)) {
			const newItem = {
				label: __("Get the current item's data", 'maxi-blocks'),
				value: 'current',
			};

			addUniqueOption(options, newItem);
		} else {
			options?.filter(option => option?.value !== 'current');
		}
	}

	return options;
};

export const validationsValues = (
	variableValue,
	field,
	relation,
	contentType,
	source = 'wp',
	linkTarget,
	isCL = false,
	acfGroup,
	limitByArchive
) => {
	if (
		!select('maxiBlocks/dynamic-content').getWasCustomPostTypesLoaded() ||
		!select('maxiBlocks/dynamic-content').getWasCustomTaxonomiesLoaded()
	)
		return {};

	const prefix = isCL ? 'cl-' : 'dc-';

	const fieldResult =
		source !== 'acf' &&
		getFields(contentType, variableValue)?.map(x => x.value);
	const currentTemplateType = getCurrentTemplateSlug();
	const relationOptions = getRelationOptions(
		variableValue,
		contentType,
		currentTemplateType
	);
	const relationResult = Array.isArray(relationOptions)
		? relationOptions.map(x => x?.value)
		: [];
	const typeResult = getTypes(
		contentType,
		false,
		currentTemplateType,
		source
	)?.map(item => item.value);
	const linkTargetResult = getLinkTargets(variableValue, field).map(
		item => item.value
	);

	return {
		...(!isCL &&
			fieldResult &&
			!fieldResult.includes(field) && {
				[`${prefix}field`]: fieldResult[0],
			}),
		...(relationResult &&
			!relationResult.includes(relation) && {
				[`${prefix}relation`]: relationResult[0],
			}),
		...(typeResult &&
			!typeResult.includes(variableValue) &&
			// Only validate type of DC once all integrations have loaded
			select('maxiBlocks/dynamic-content').isIntegrationListLoaded() && {
				[`${prefix}type`]: typeResult[0],
			}),
		...(linkTargetResult &&
			!linkTargetResult.includes(linkTarget) && {
				[`${prefix}link-target`]: linkTargetResult[0],
			}),
	};
};

export const getDCOrder = (relation, orderBy) => {
	if (!relation || !orderBy) return null;
	const dictionary = {
		'by-date': 'date',
		alphabetical: 'title',
	};

	if (
		orderByRelations.includes(relation) ||
		relation.includes('custom-taxonomy')
	) {
		return dictionary[orderBy];
	}

	return dictionary[relation];
};

export const canCurrentEntityBeSelected = type =>
	currentEntityTypes.includes(type) &&
	nameDictionary[type] === select('core/editor').getCurrentPostType();

export const validateRelations = (type, relation, isCL) => {
	const prefix = isCL ? 'cl-' : 'dc-';

	if (relation === 'current' && !canCurrentEntityBeSelected(type)) {
		const currentType = select('core/editor').getCurrentPostType();
		const postTypeToDCType = invert(nameDictionary);

		if (currentEntityTypes.includes(postTypeToDCType[currentType])) {
			return { [`${prefix}type`]: postTypeToDCType[currentType] };
		}
	}

	return null;
};

export const getAttributesWithoutPrefix = (attributes, prefix) => {
	const result = {};

	Object.keys(attributes).forEach(key => {
		if (key.startsWith(prefix)) {
			result[key.replace(prefix, '')] = attributes[key];
		}
	});

	return result;
};

export const getRelationKeyForId = (relation, type) => {
	if (!relation || !type) return null;
	if (relation.includes('custom-taxonomy'))
		return relation?.split('custom-taxonomy-').pop();
	const relationType = relationDictionary[relation];
	if (relationType) {
		return relationType[type] || relationType.default;
	}
	return null;
};

export const isLinkObfuscationEnabled = (
	dcStatus,
	dcLinkStatus,
	dcLinkTarget
) => dcStatus && dcLinkStatus && ['author_email'].includes(dcLinkTarget);

// Helper function to create a delay
const delay = ms =>
	new Promise(resolve => {
		setTimeout(resolve, ms);
	});

// Function to retry an async operation with exponential backoff
const retryOperation = async (
	operation,
	maxRetries = 3,
	initialDelay = 300
) => {
	let retries = 0;
	let currentDelay = initialDelay;

	// eslint-disable-next-line no-constant-condition
	while (retries < maxRetries) {
		try {
			// eslint-disable-next-line no-await-in-loop
			const result = await operation();

			// If we have a result, return it immediately
			if (result && (Array.isArray(result) ? result.length > 0 : true)) {
				return result;
			}

			// eslint-disable-next-line no-await-in-loop
			await delay(currentDelay);
			retries += 1;
			currentDelay *= 2; // Exponential backoff
		} catch (error) {
			// eslint-disable-next-line no-await-in-loop
			await delay(currentDelay);
			retries += 1;
			currentDelay *= 2;
		}
	}

	// Last attempt after all retries
	return operation();
};

export const getPostBySlug = async slug => {
	// First try with the exact slug, with retries
	const getPostsOperation = () =>
		select('core').getEntityRecords('postType', 'post', {
			slug,
			per_page: 1,
		});

	const posts = await retryOperation(getPostsOperation);

	if (posts && posts.length > 0) {
		return posts[0];
	}

	// If no post found and slug ends with a pattern like "-4", try without the suffix
	const numericSuffixMatch = slug.match(/-(\d+)$/);
	if (numericSuffixMatch) {
		const slugWithoutSuffix = slug.replace(/-\d+$/, '');
		const getPostsWithoutSuffixOperation = () =>
			select('core').getEntityRecords('postType', 'post', {
				slug: slugWithoutSuffix,
				per_page: 1,
			});

		const postsWithoutSuffix = await retryOperation(
			getPostsWithoutSuffixOperation
		);

		if (postsWithoutSuffix && postsWithoutSuffix.length > 0) {
			return postsWithoutSuffix[0];
		}
	}

	return null;
};
