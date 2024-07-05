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

/**
 * External dependencies
 */
import { isNil, isEmpty, capitalize } from 'lodash';

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

const getDCContent = async (dataRequest, clientId) => {
	const data = await getDCEntity(dataRequest, clientId);
	if (!data) return null;

	const {
		source,
		relation,
		type,
		field,
		limit,
		delimiterContent,
		customDate,
		format,
		locale,
		postTaxonomyLinksStatus,
		acfFieldType,
		linkTarget,
	} = dataRequest;

	if (field === 'archive-type') {
		return getCurrentTemplateSlug().replace(/-/g, ' ');
	}

	let contentValue;

	if (source === 'acf') {
		contentValue = await getACFFieldContent(field, data.id);
		return getACFContentByType(contentValue, acfFieldType, dataRequest);
	}

	if (relation === 'current' && isEmpty(data)) {
		return `${capitalize(field)}: example ${field}`;
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

	if (isCustomTaxonomyField && !isNil(contentValue) && !isEmpty(contentValue)) {
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
