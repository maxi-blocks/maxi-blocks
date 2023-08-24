/**
 * WordPress dependencies
 */
import { resolveSelect } from '@wordpress/data';
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import { limitFields, limitTypes, renderedFields } from './constants';
import {
	getItemLinkContent,
	getSimpleText,
	getTaxonomyContent,
	limitString,
	parseText,
} from './utils';
import processDCDate, { formatDateOptions } from './processDCDate';
import getDCEntity from './getDCEntity';
import { getACFFieldContent } from './getACFData';
import getACFContentByType from './getACFContentByType';
import { getCartContent, getProductsContent } from './getWCContent';

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

const getDCContent = async (dataRequest, clientId) => {
	const data = await getDCEntity(dataRequest, clientId);

	if (!data) return null;

	const {
		source,
		type,
		field,
		limit,
		delimiterContent,
		customDate,
		format,
		locale,
		postTaxonomyLinksStatus,
		acfFieldType,
	} = dataRequest;

	let contentValue;

	if (source === 'acf') {
		contentValue = await getACFFieldContent(field, data.id);

		return getACFContentByType(contentValue, acfFieldType, dataRequest);
	}

	if (
		renderedFields.includes(field) &&
		!isNil(data[field]?.rendered) &&
		!['tags', 'categories'].includes(type)
	) {
		contentValue = data?.[field].rendered;
	} else {
		contentValue = data?.[field];
	}

	if (type === 'products') {
		return getProductsContent(dataRequest, data);
	}
	if (type === 'cart') {
		return getCartContent(dataRequest, data);
	}

	if (field === 'date') {
		const options = formatDateOptions(dataRequest);

		contentValue = processDCDate(
			contentValue,
			customDate,
			format,
			locale,
			options
		);
	} else if (limitTypes.includes(type) && limitFields.includes(field)) {
		// Parse content value
		if (typeof contentValue === 'string') {
			contentValue = parseText(contentValue);
		}

		if (field === 'content') contentValue = getSimpleText(contentValue);

		contentValue = limitString(contentValue, limit);
	} else if (field === 'author') {
		const { getUsers } = resolveSelect('core');

		const user = await getUsers({ include: contentValue });

		contentValue = getItemLinkContent(
			user[0].name,
			postTaxonomyLinksStatus
		);
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
		contentValue = await getTaxonomyContent(
			contentValue,
			delimiterContent,
			postTaxonomyLinksStatus,
			nameDictionary[field]
		);
	}

	if (contentValue) return contentValue;

	return null;
};

export default getDCContent;
