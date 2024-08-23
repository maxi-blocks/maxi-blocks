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
import { getACFOptions } from '../../components/dynamic-content/acf-settings-control/utils';

/**
 * External dependencies
 */
import { isNil, isEmpty, capitalize, isEqual } from 'lodash';

const handleParentField = async (contentValue, type) => {
	if (!contentValue || contentValue === 0)
		return __('No parent', 'maxi-blocks');
	const parent = await resolveSelect('core').getEntityRecords(
		'taxonomy',
		nameDictionary[type] ?? type,
		{ per_page: 1, include: contentValue }
	);
	return parent?.[0]?.name || __('No parent', 'maxi-blocks');
};

const cache = {};
const MAX_CACHE_SIZE = 200;

const getDCContent = async (dataRequest, clientId) => {
	if (isEmpty(dataRequest)) return null;
	const { source, relation, field } = dataRequest;

	if (field === 'archive-type') {
		return getCurrentTemplateSlug().replace(/-/g, ' ');
	}

	const filteredDataRequest = { ...dataRequest };
	const keysToRemove = [
		'content',
		'customDelimiterStatus',
		'customFormat',
		'linkTarget',
		'linkUrl',
		'linkStatus',
		'field',
	];
	keysToRemove.forEach(key => delete filteredDataRequest[key]);

	const cacheKey = JSON.stringify(filteredDataRequest);
	let data;

	if (cache[cacheKey]) {
		data = cache[cacheKey];
	} else {
		data = await getDCEntity(dataRequest, clientId);

		// Check if the cache size exceeds the maximum limit
		if (Object.keys(cache).length >= MAX_CACHE_SIZE) {
			// Remove the oldest entry from the cache
			const oldestKey = Object.keys(cache)[0];
			delete cache[oldestKey];
		}
		cache[cacheKey] = data;
	}

	if (relation === 'current' && isEmpty(data)) {
		if (source === 'acf') {
			if (field) {
				return capitalize(field) + __(': example value', 'maxi-blocks');
			} else {
				return __('ACF: example value', 'maxi-blocks');
			}
		}
		return (
			capitalize(dataRequest.field) + __(': example value', 'maxi-blocks')
		);
	}
	if (!data) return null;

	const {
		type,
		limit,
		delimiterContent,
		customDate,
		format,
		locale,
		postTaxonomyLinksStatus,
		acfFieldType,
		linkTarget,
	} = dataRequest;

	let contentValue;

	if (source === 'acf') {
		contentValue = await getACFFieldContent(field, data.id);
		return getACFContentByType(contentValue, acfFieldType, dataRequest);
	}

	const customTaxonomies = select(
		'maxiBlocks/dynamic-content'
	).getCustomTaxonomies();

	const isCustomTaxonomyType = [
		...customTaxonomies,
		'tags',
		'categories',
		'product_tags',
		'product_categories',
	].includes(type);

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

	if (type === 'customers') {
		const getCustomerDataField = field => data?.customerData?.[field]?.[0];

		if (field === 'billing_name' || field === 'shipping_name') {
			const firstNameField = field.replace('_name', '_first_name');
			const firstName = getCustomerDataField(firstNameField);
			const lastNameField = field.replace('_name', '_last_name');
			const lastName = getCustomerDataField(lastNameField);
			return `${firstName} ${lastName}`;
		}

		return getCustomerDataField(field) || null;
	}

	const limitTypes = select('maxiBlocks/dynamic-content').getLimitTypes();

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
		contentValue =
			typeof contentValue === 'string'
				? parseText(contentValue)
				: contentValue;
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

	if (isCustomTaxonomyType && field === 'parent') {
		contentValue = await handleParentField(contentValue, type);
	}

	const isCustomTaxonomyField = [
		...customTaxonomies,
		'tags',
		'categories',
		'product_tags',
		'product_categories',
	].includes(field);

	if (
		isCustomTaxonomyField &&
		!isNil(contentValue) &&
		!isEmpty(contentValue)
	) {
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
