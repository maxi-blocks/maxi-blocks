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
	if (!taxonomyIds) return null;

	const { getEntityRecords } = resolveSelect('core');

	const taxonomyArray = await getEntityRecords('taxonomy', taxonomyType, {
		include: taxonomyIds,
	});

	if (!taxonomyArray) return null;

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
	if (source === 'acf') return {};

	const prefix = isCL ? 'cl-' : 'dc-';

	const fieldResult = fieldOptions?.[contentType]?.[variableValue].map(
		x => x.value
	);
	const relationResult = relationOptions?.[contentType]?.[variableValue].map(
		x => x.value
	);
	const typeResult = typeOptions[contentType].map(item => item.value);

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
		...(!typeResult.includes(variableValue) &&
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

	return {};
};
