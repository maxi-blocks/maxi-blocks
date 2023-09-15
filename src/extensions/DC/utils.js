/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { select } from '@wordpress/data';

/**
 * Internal dependencies
 */
import {
	fieldOptions,
	relationOptions,
	orderByRelations,
	currentEntityTypes,
	nameDictionary,
} from './constants';

/**
 * External dependencies
 */
import moment from 'moment';
import 'moment-parseformat';
import { isEmpty, isNumber, invert } from 'lodash';

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

export const validationsValues = (
	variableValue,
	field,
	relation,
	contentType,
	source,
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

	return {
		...(!isCL &&
			fieldResult &&
			!fieldResult.includes(field) && {
				[`${prefix}field`]: fieldResult[0],
			}),
		...(relation !== 'current' &&
			relationResult &&
			!relationResult.includes(relation) && {
				[`${prefix}relation`]: relationResult[0],
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

		return { [`${prefix}relation`]: 'by-id' };
	}

	return {};
};
