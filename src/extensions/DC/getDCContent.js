/**
 * WordPress dependencies
 */
import { resolveSelect } from '@wordpress/data';

/**
 * Internal dependencies
 */
import { relationTypes, renderedFields } from './constants';
import getDCErrors from './getDCErrors';
import { getSimpleText, limitFormat } from './utils';
import processDCDate, { formatDateOptions } from './date/processDCDate';

/**
 * External dependencies
 */
import { isNil } from 'lodash';

const getContentValue = async (dataRequest, data) => {
	const {
		'dc-type': type,
		'dc-field': field,
		'dc-limit': limit,
		'dc-custom-date': isCustomDate,
		'dc-format': format,
		'dc-locale': locale,
	} = dataRequest;

	let contentValue;

	if (
		renderedFields.includes(field) &&
		!isNil(data[field]?.rendered) &&
		!['tags', 'categories'].includes(type)
	) {
		contentValue = data[field].rendered;
	} else {
		contentValue = data[field];
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
	} else if (field === 'excerpt') {
		contentValue = limitFormat(contentValue, limit);
	} else if (field === 'content') {
		contentValue = limitFormat(getSimpleText(contentValue), limit);
	}

	if (contentValue) {
		return contentValue;
	}

	return null;
};

const getDCContent = async dataRequest => {
	const {
		'dc-type': type,
		'dc-id': id,
		'dc-error': error,
		'dc-show': show,
		'dc-relation': relation,
		'dc-author': author,
	} = dataRequest;

	const contentError = getDCErrors(type, error, show, relation);

	if (contentError) return contentError;

	if (type === 'users') {
		dataRequest.id = author ?? id;
	}

	const kindDictionary = {
		posts: 'postType',
		pages: 'postType',
		media: 'postType',
		settings: 'root',
		categories: 'taxonomy',
		tags: 'taxonomy',
	};
	const nameDictionary = {
		posts: 'post',
		pages: 'page',
		media: 'attachment',
		settings: '__unstableBase',
		categories: 'category',
		tags: 'post_tag',
	};

	if (type === 'users') {
		const { getUsers } = resolveSelect('core');

		const user = await getUsers({ p: author });

		return getContentValue(dataRequest, user[0]);
	}
	if (relationTypes.includes(type) && relation === 'random') {
		const randomEntity = await resolveSelect('core').getEntityRecords(
			kindDictionary[type],
			nameDictionary[type],
			{
				per_page: 100,
				hide_empty: false,
			}
		);

		return getContentValue(
			dataRequest,
			randomEntity[Math.floor(Math.random() * randomEntity.length)]
		);
	}
	if (type === 'settings') {
		const canEdit = await resolveSelect('core').canUser(
			'update',
			'settings'
		);
		const settings = canEdit
			? await resolveSelect('core').getEditedEntityRecord(
					kindDictionary[type],
					'site'
			  )
			: {};
		const readOnlySettings = await resolveSelect('core').getEntityRecord(
			kindDictionary[type],
			'__unstableBase'
		);

		const siteEntity = canEdit ? settings : readOnlySettings;

		return getContentValue(dataRequest, siteEntity);
	}
	if (['tags', 'categories'].includes(type)) {
		const termsEntity = await resolveSelect('core').getEntityRecords(
			kindDictionary[type],
			nameDictionary[type],
			{
				per_page: 1,
				hide_empty: false,
				include: id,
			}
		);

		return getContentValue(dataRequest, termsEntity[0]);
	}

	// Get selected entity
	const entity = await resolveSelect('core').getEntityRecord(
		kindDictionary[type],
		nameDictionary[type] ?? type,
		id,
		{
			per_page: 1,
		}
	);

	if (entity) return getContentValue(dataRequest, entity);

	return null;
};

export default getDCContent;
