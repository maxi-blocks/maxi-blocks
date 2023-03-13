/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import { fieldOptions } from './constants';

/**
 * External dependencies
 */
import moment from 'moment';
import 'moment-parseformat';
import { isEmpty, isNumber } from 'lodash';

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

export const validationsValues = (variableValue, field, contentType) => {
	const result = fieldOptions[contentType][variableValue].map(x => x.value);

	return result.includes(field) ? {} : { 'dc-field': result[0] };
};

export const getDCDateCustomFormat = date => moment.parseFormat(date);
