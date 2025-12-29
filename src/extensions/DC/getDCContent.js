/**
 * WordPress dependencies
 */
import { resolveSelect, select } from '@wordpress/data';
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import { limitFields, nameDictionary, renderedFields } from './constants';
import {
	getItemLinkContent,
	getSimpleText,
	getTaxonomyContent,
	limitString,
	parseText,
	getCurrentTemplateSlug,
} from './utils';
import processDCDate, { formatDateOptions } from './processDCDate';
import getDCEntity from './getDCEntity';
import { getACFFieldContent } from './getACFData';
import getACFContentByType from './getACFContentByType';
import { getCartContent, getProductsContent } from './getWCContent';
import { createDCCache } from './dcCache';

/**
 * External dependencies
 */
import { isNil, isEmpty, capitalize } from 'lodash';

export const handleParentField = async (contentValue, type) => {
	if (!contentValue || contentValue === 0)
		return __('No parent', 'maxi-blocks');
	const parent = await resolveSelect('core').getEntityRecords(
		'taxonomy',
		nameDictionary[type] ?? type,
		{ per_page: 1, include: contentValue }
	);
	return parent?.[0]?.name || __('No parent', 'maxi-blocks');
};

const cache = createDCCache('content', { maxSize: 100 });

const getDCContent = async (dataRequest, clientId) => {
	if (isEmpty(dataRequest)) return null;
	const { field } = dataRequest;

	if (field === 'archive-type') {
		return getCurrentTemplateSlug().replace(/-/g, ' ');
	}

	const filteredDataRequest = { ...dataRequest };
	const keysToRemove = ['content', 'customDelimiterStatus', 'customFormat'];
	keysToRemove.forEach(key => delete filteredDataRequest[key]);

	let data = await cache.get(filteredDataRequest);

	if (!data) {
		data = await getDCEntity(dataRequest, clientId);
		await cache.set(filteredDataRequest, data);
	}

	const { source, relation } = dataRequest;

	if (relation === 'current' && isEmpty(data)) {
		if (source === 'acf') {
			if (field) {
				return capitalize(field) + __(': example value', 'maxi-blocks');
			}
			return __('ACF: example value', 'maxi-blocks');
		}
		return (
			capitalize(dataRequest.field) + __(': example value', 'maxi-blocks')
		);
	}
	if (!data) return null;

	const { acfFieldType } = dataRequest;
	let contentValue;

	if (source === 'acf') {
		contentValue = await getACFFieldContent(field, data.id);
		return getACFContentByType(contentValue, acfFieldType, dataRequest);
	}

	const { type } = dataRequest;
	let isCustomTaxonomyType = false;
	if (
		![
			'posts',
			'pages',
			'media',
			'users',
			'authors',
			'products',
			'archive',
		].includes(type)
	) {
		if (
			[
				'tags',
				'categories',
				'product_tags',
				'product_categories',
			].includes(type)
		) {
			isCustomTaxonomyType = true;
		} else {
			const customTaxonomies = select(
				'maxiBlocks/dynamic-content'
			).getCustomTaxonomies();
			if ([...customTaxonomies].includes(type)) {
				isCustomTaxonomyType = true;
			}
		}
	}

	if (
		renderedFields.includes(field) &&
		!isNil(data[field]?.rendered) &&
		!isCustomTaxonomyType
	) {
		contentValue = data[field].rendered;
	} else {
		contentValue = data[field];
	}

	if (type === 'products') {
		return getProductsContent(dataRequest, data);
	}

	if (type === 'cart') {
		return getCartContent(dataRequest, data);
	}

	const limitTypes = select('maxiBlocks/dynamic-content').getLimitTypes();

	if (field === 'date') {
		const { customDate, format, locale } = dataRequest;
		const options = formatDateOptions(dataRequest);
		contentValue = processDCDate(
			contentValue,
			customDate,
			format,
			locale,
			options
		);
	} else if (limitTypes.includes(type) && limitFields.includes(field)) {
		contentValue =
			typeof contentValue === 'string'
				? parseText(contentValue)
				: contentValue;
		if (field === 'content') contentValue = getSimpleText(contentValue);
		const { limit } = dataRequest;
		contentValue = limitString(contentValue, limit);
	} else if (field === 'author') {
		const { getUsers } = resolveSelect('core');
		const { postTaxonomyLinksStatus, subField } = dataRequest;
		const userField = subField ?? 'name';
		const user = await getUsers({ include: contentValue });
		contentValue = getItemLinkContent(
			user[0]?.[userField],
			postTaxonomyLinksStatus
		);
	}

	if (isCustomTaxonomyType && field === 'parent') {
		contentValue = await handleParentField(contentValue, type);
	}

	let isCustomTaxonomyField = false;
	if (
		![
			'title',
			'content',
			'excerpt',
			'date',
			'author',
			'static_text',
		].includes(field)
	) {
		if (
			[
				'tags',
				'categories',
				'product_tags',
				'product_categories',
			].includes(field)
		) {
			isCustomTaxonomyField = true;
		} else {
			const customTaxonomies = select(
				'maxiBlocks/dynamic-content'
			).getCustomTaxonomies();
			if ([...customTaxonomies].includes(field)) {
				isCustomTaxonomyField = true;
			}
		}
	}

	if (isCustomTaxonomyField) {
		const { delimiterContent, linkTarget } = dataRequest;
		contentValue = await getTaxonomyContent(
			contentValue,
			delimiterContent,
			linkTarget === field,
			nameDictionary[field] || field
		);
	}

	return contentValue || null;
};

export default getDCContent;
