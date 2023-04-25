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
		'dc-type': type,
		'dc-field': field,
		'dc-limit': limit,
		'dc-delimiter-content': delimiter,
		'dc-custom-date': isCustomDate,
		'dc-format': format,
		'dc-locale': locale,
		'dc-post-taxonomy-links-status': postTaxonomyLinksStatus,
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
	if (['tags', 'categories'].includes(field)) {
		const { getEntityRecord } = resolveSelect('core');
		const idArray = contentValue;

		const getItemContent = item =>
			postTaxonomyLinksStatus
				? `<a class="maxi-text-block--link"><span>${item.name}</span></a>`
				: item.name;

		const namesArray = await Promise.all(
			idArray.map(async id => {
				const taxonomyItem = await getEntityRecord(
					'taxonomy',
					nameDictionary[field],
					id
				);

				return getItemContent(taxonomyItem);
			})
		);

		contentValue = postTaxonomyLinksStatus
			? `<span>${namesArray.join(`${delimiter} `)}</span>`
			: namesArray.join(`${delimiter} `);
	}

	if (contentValue) return contentValue;

	return null;
};

export default getDCContent;
