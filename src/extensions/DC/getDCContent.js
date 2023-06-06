/**
 * WordPress dependencies
 */
import { resolveSelect } from '@wordpress/data';
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import { limitFields, limitTypes, renderedFields } from './constants';
import { getSimpleText, limitString } from './utils';
import processDCDate, { formatDateOptions } from './processDCDate';
import getDCEntity from './getDCEntity';

/**
 * External dependencies
 */
import { isNil } from 'lodash';

const nameDictionary = {
	posts: 'post',
	pages: 'page',
	media: 'attachment',
	settings: '__unstableBase',
	categories: 'category',
	tags: 'post_tag',
};

const getDCContent = async dataRequest => {
	const data = await getDCEntity(dataRequest);

	const {
		dc_ty: type,
		dc_f: field,
		dc_lim: limit,
		dc_cd: isCustomDate,
		dc_fo: format,
		dc_loc: locale,
	} = dataRequest;

	let contentValue;

	if (
		renderedFields.includes(field) &&
		!isNil(data[field]?.rendered) &&
		!['tags', 'categories'].includes(type)
	) {
		contentValue = data?.[field].rendered;
	} else {
		contentValue = data?.[field];
	}

	if (field === 'date') {
		const options = formatDateOptions(dataRequest);

		contentValue = processDCDate(
			contentValue,
			isCustomDate,
			format,
			locale,
			options
		);
	} else if (limitTypes.includes(type) && limitFields.includes(field)) {
		// Parse content value
		if (typeof contentValue === 'string') {
			const parser = new DOMParser();
			const doc = parser.parseFromString(contentValue, 'text/html');
			contentValue = doc.body.textContent;
		}

		if (field === 'content') contentValue = getSimpleText(contentValue);

		contentValue = limitString(contentValue, limit);
	} else if (field === 'author') {
		const { getUsers } = resolveSelect('core');

		const user = await getUsers({ p: contentValue });

		contentValue = user[0].name;
	}
	if (['tags', 'categories'].includes(type) && field === 'parent') {
		if (!contentValue || contentValue === 0)
			contentValue = __('No parent', 'maxi-blocks');
		else {
			const { getEntityRecords } = resolveSelect('core');

			const parent = await getEntityRecords(
				'taxonomy',
				nameDictionary[type],
				{
					per_page: 1,
					include: contentValue,
				}
			);

			contentValue = parent[0].name;
		}
	}

	if (contentValue) return contentValue;

	return null;
};

export default getDCContent;
