/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { resolveSelect } from '@wordpress/data';
import apiFetch from '@wordpress/api-fetch';
import { store as coreStore } from '@wordpress/core-data';

/**
 * External dependencies
 */
import { isEmpty } from 'lodash';
import moment from 'moment';
import { fieldOptions, idFields } from './constants';

/**
 * TODO: Returns an array of CPT options for a SelectControl
 */
export const getCPTOptions = () => {
	return [{}];
};

/**
 * TODO: Returns an array of CT (Custom Taxonomies) options for a SelectControl
 */
export const getCTOptions = () => {
	return [{}];
};

export const processDate = (
	dateValue,
	isCustomDate,
	format,
	locale,
	options
) => {
	const NewDate = new Date(dateValue);
	let content;
	let newFormat;
	if (!isCustomDate) {
		newFormat = format
			.replace(/DV/g, 'x')
			.replace(/DS/g, 'z')
			.replace(/MS/g, 'c');
		const map = {
			z: 'ddd',
			x: 'dd',
			c: 'MMM',
			d: 'D',
			D: 'dddd',
			m: 'MM',
			M: 'MMMM',
			y: 'YY',
			Y: 'YYYY',
			t: 'HH:MM:SS',
		};
		newFormat = newFormat.replace(/[xzcdDmMyYt]/g, m => map[m]);
		content = moment(NewDate).format(newFormat);
	} else {
		content = NewDate.toLocaleString(locale, options);
	}
	return content;
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

export const limitFormat = (value, limit) => {
	const str = cutTags(value).trim();
	return str.length > limit && limit !== 0
		? `${str.substr(0, limit).trim()}...`
		: limit !== 0
		? str
		: value;
};

// In case content is empty, show this text
export const sanitizeContent = content =>
	!isEmpty(content) || typeof content === 'number'
		? __(content, 'maxi-blocks')
		: __('No content found', 'maxi-blocks');

export const getIdOptions = async (type, defaultValues, relation, author) => {
	if (!idFields.includes(type) || (relation === 'author' && !author))
		return false;

	const { getEntityRecords, getUsers } = resolveSelect(coreStore);
	let data;

	const dictionary = {
		posts: 'post',
		pages: 'page',
		media: 'attachment',
	};

	if (type === 'users') {
		const users = await getUsers();

		if (users) {
			data = users.map(({ id, name }) => ({
				id,
				name,
			}));
		}
	} else if (relation === 'author') {
		data = await getEntityRecords('postType', dictionary[type], {
			author: defaultValues.author ? defaultValues['dc-autor'] : author,
		});
	} else {
		data = await getEntityRecords('postType', dictionary[type]);
	}

	return data;
};

export const validationsValues = (variableValue, field) => {
	const result = fieldOptions[variableValue].map(x => x.value);

	return result.includes(field) ? {} : { 'dc-field': result[0] };
};

export const getAuthorByID = async thisId =>
	apiFetch({ path: `/wp/v2/users/${thisId}` }).then(
		author => author.name ?? 'No name'
	);
