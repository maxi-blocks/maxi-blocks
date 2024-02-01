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
	typeOptions,
	getHaveLoadedIntegrationsOptions,
	currentEntityTypes,
	nameDictionary,
	relationDictionary,
	postTypeRelationOptions,
} from './constants';

/**
 * External dependencies
 */
import moment from 'moment';
import 'moment-parseformat';
import { isEmpty, isNumber, invert } from 'lodash';
import DOMPurify from 'dompurify';

export const parseText = value => {
	const parser = new DOMParser();
	const doc = parser.parseFromString(DOMPurify.sanitize(value), 'text/html');
	return doc.body.textContent;
};

export const cutTags = str => {
	const regex = /( |<([^>]+)>)/gi;
	const result = str.replace(regex, ' ');
	return result;
};

export const getSimpleText = str => {
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

export const validationsValues = (
	variableValue,
	field,
	relation,
	contentType,
	source = 'wp',
	isCL = false
) => {
	if (
		source === 'acf' ||
		[
			...select('maxiBlocks/dynamic-content').getCustomPostTypes(),
			...select('maxiBlocks/dynamic-content').getCustomTaxonomies(), // TODO: validation for custom types
		].includes(variableValue)
	)
		return {};

	const prefix = isCL ? 'cl-' : 'dc-';

	const fieldResult = fieldOptions?.[contentType]?.[variableValue]?.map(
		x => x.value
	);
	const relationResult = relationOptions?.[contentType]?.[variableValue]?.map(
		x => x.value
	);
	const typeResult = typeOptions[contentType]?.map(item => item.value);

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
	};
};

export const getDCDateCustomFormat = date => moment.parseFormat(date);

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

const getCustomTypeFields = (contentType, type) => {
	// TODO: refactor possibly by filtering post/page fields
	const fields = [];

	const postType = select('core').getPostType(type);

	const addField = (label, value) => {
		fields.push({
			label: __(label, 'maxi-blocks'),
			value,
		});
	};

	if (contentType === 'image') {
		if (postType.supports.thumbnail) {
			addField('Featured image', 'featured_image');
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

export const getFields = (contentType, type) => {
	if (
		select('maxiBlocks/dynamic-content').getCustomPostTypes().includes(type)
	)
		return getCustomTypeFields(contentType, type);

	return fieldOptions[contentType][type];
};

export const getCustomRelationOptions = type => {
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
