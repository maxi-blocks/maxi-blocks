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
	getHaveLoadedIntegrationsOptions,
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
		type.includes(currentTemplateType)
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
		allowedTemplateTypes.includes(currentTemplateType) &&
		type.includes('posts')
	)
		return true;

	if (
		currentTemplateType.includes('taxonomy') &&
		currentTemplateType.includes(type)
	)
		return true;

	return false;
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
		label: 'Selected entity',
		value: 'entity',
	});

	targets.push(...linkTypesOptions[type]);
	targets.push(...linkFieldsOptions[field]);

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
	if (postType.taxonomies.includes('category')) {
		addField('Categories', 'categories');
	}
	if (postType.taxonomies.includes('post_tag')) {
		addField('Tags', 'tags');
	}
	if (postType.supports.comments) {
		addField('Comments', 'comments');
	}

	return fields;
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

// Utility function to add an item to the options array if it doesn't already exist
const addUniqueOption = (options, newItem) => {
	if (!options) return;
	if (
		!options.some(
			item => item.label === newItem.label && item.value === newItem.value
		)
	) {
		options.push(newItem);
	}
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
		if (showCurrent(type, getCurrentTemplateSlug())) {
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
	else options = relationOptions[contentType]?.[type];

	if (type.includes(select('core/editor').getCurrentPostType())) {
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
			options?.filter(option => option.value !== 'current');
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
	acfGroup
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
		? relationOptions.map(x => x.value)
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
			getHaveLoadedIntegrationsOptions() && {
				[`${prefix}type`]: typeResult[0],
			}),
		...(linkTargetResult &&
			!linkTargetResult.includes(linkTarget) && {
				[`${prefix}link-target`]: linkTargetResult[0],
			}),
	};
};

export const getDCOrder = (relation, orderBy) => {
	const dictionary = {
		'by-date': 'date',
		alphabetical: 'title',
	};

	if (orderByRelations.includes(relation)) {
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
	const relationType = relationDictionary[relation];
	if (relationType) {
		return relationType[type] || relationType.default;
	}
	return null;
};
