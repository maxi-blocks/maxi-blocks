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
	if (limit === 0) return value;

	const str = cutTags(value).trim();

	if (str.length > limit && limit !== 0) return `${str.substr(0, limit)}…`;

	return str;
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

	const postType = select('core').getPostType(type);

	console.log('postType field', postType);

	const addField = (label, value) => {
		fields.push({
			label: __(label, 'maxi-blocks'),
			value,
		});
	};

	if (contentType === 'image') {
		if (postType.supports.thumbnail) {
			addField('Featured image', 'featured_media');
		}

		return fields;
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

export const getFields = (contentType, type) => {
	if (
		select('maxiBlocks/dynamic-content').getCustomPostTypes().includes(type)
	)
		return getCustomPostTypeFields(contentType, type);
	if (
		select('maxiBlocks/dynamic-content')
			.getCustomTaxonomies()
			.includes(type)
	)
		return getCustomTaxonomyFields(type);

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

// Utility function to add an item to the options array if it doesn't already exist
const addUniqueOption = (options, newItem) => {
	if (
		!options.some(
			item => item.label === newItem.label && item.value === newItem.value
		)
	) {
		options.push(newItem);
	}
};

export const getCurrentTemplateSlug = () => {
	const currentTemplateTypeRaw =
		select('core/edit-site')?.getEditedPostContext()?.templateSlug ||
		select('core/edit-site')?.getEditedPostId(); // fix for WordPress 6.5

	let currentTemplateType = currentTemplateTypeRaw;

	// Use array destructuring to extract the part after '//' if it exists
	if (currentTemplateType && currentTemplateType.includes('//')) {
		[, currentTemplateType] = currentTemplateType.split('//');
	}

	return currentTemplateType;
};

export const getRelationOptions = (type, contentType) => {
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
			label: __('Get current', 'maxi-blocks'),
			value: 'current',
		};

		addUniqueOption(options, newItem);
	}

	const isFSE = select('core/edit-site') !== undefined;

	if (isFSE) {
		const allowedTemplateTypes = [
			'category',
			'tag',
			'author',
			'date',
			'archive',
		];
		const currentTemplateType = getCurrentTemplateSlug();

		// Check if currentTemplateType is one of the allowed types
		if (allowedTemplateTypes.includes(currentTemplateType)) {
			const newItem = {
				label: __('Get current archive', 'maxi-blocks'),
				value: 'current-archive',
			};

			addUniqueOption(options, newItem);
		}

		const allowedTemplateTypesCurrent = [
			'category',
			'tag',
			'author',
			'date',
			'archive',
			'date',
			'single',
			'page',
		];
		const showCurrent = () => {
			if (
				allowedTemplateTypesCurrent.includes(currentTemplateType) &&
				type.includes(currentTemplateType)
			)
				return true;

			if (currentTemplateType === 'single' && type === 'posts')
				return true;

			return false;
		};
		console.log('currentTemplateType', currentTemplateType);
		console.log('type', type);
		// Check if currentTemplateType is one of the allowed types
		if (showCurrent()) {
			const newItem = {
				label: __('Get current', 'maxi-blocks'),
				value: 'current',
			};

			addUniqueOption(options, newItem);
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
	isCL = false
) => {
	if (
		source === 'acf' ||
		[
			...select(
				'maxiBlocks/dynamic-content'
			).getWasCustomPostTypesLoaded(),
			...select(
				'maxiBlocks/dynamic-content'
			).getWasCustomTaxonomiesLoaded(),
		].includes(variableValue)
	)
		return {};

	const prefix = isCL ? 'cl-' : 'dc-';

	const fieldResult = getFields(contentType, variableValue)?.map(
		x => x.value
	);
	const relationOptions = getRelationOptions(variableValue, contentType);
	const relationResult = Array.isArray(relationOptions)
		? relationOptions.map(x => x.value)
		: [];
	const typeResult = getTypes(contentType, false)?.map(item => item.value);
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
