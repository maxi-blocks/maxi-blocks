/**
 * WordPress dependencies
 */
import { resolveSelect, select } from '@wordpress/data';
import { store as coreStore } from '@wordpress/core-data';

/**
 * Internal dependencies
 */
import { getFields, limitString, getCurrentTemplateSlug } from './utils';
import { idOptionByField, idTypes, orderByRelations } from './constants';

/**
 * External dependencies
 */
import { find, isEmpty, isEqual } from 'lodash';

export const getIdOptions = async (
	type,
	relation,
	author,
	isCustomPostType,
	isCustomTaxonomy
) => {
	if (![...idTypes].includes(type) && !isCustomPostType && !isCustomTaxonomy)
		return false;

	const { getEntityRecords, getUsers } = resolveSelect(coreStore);
	let data;

	const dictionary = {
		posts: 'post',
		pages: 'page',
		media: 'attachment',
		products: 'product',
	};

	const args = {
		per_page: -1,
	};

	if (type === 'users' || relation === 'by-author') {
		const users = await getUsers();

		if (users) {
			data = users.map(({ id, name }) => ({
				id,
				name,
			}));
		}
	} else if (
		['categories', 'product_categories'].includes(type) ||
		relation === 'by-category'
	) {
		const categoryType = ['products', 'product_categories'].includes(type)
			? 'product_cat'
			: 'category';
		console.log('categoryType', categoryType);
		console.log('args', args);
		data = await getEntityRecords('taxonomy', categoryType, args);
		console.log('data', data);
	} else if (
		['tags', 'product_tags'].includes(type) ||
		relation === 'by-tag'
	) {
		const tagType = ['products', 'product_tags'].includes(type)
			? 'product_tag'
			: 'post_tag';
		data = await getEntityRecords('taxonomy', tagType, args);
	} else if (isCustomTaxonomy) {
		data = await getEntityRecords('taxonomy', type, args);
	} else if (isCustomPostType) {
		data = await getEntityRecords('postType', type, args);
	} else if (relation === 'current-archive') {
		const currentTemplateType = getCurrentTemplateSlug();
		if (currentTemplateType === 'author') {
			const users = await getUsers();

			if (users) {
				data = users.map(({ id, name }) => ({
					id,
					name,
				}));
			}
		} else if (['category', 'tag'].includes(currentTemplateType)) {
			data = await getEntityRecords(
				'taxonomy',
				currentTemplateType,
				args
			);
		} else {
			data = await getEntityRecords('taxonomy', 'category', args);
		}
	} else {
		data = await getEntityRecords('postType', dictionary[type], args);
	}

	return data;
};

// TODO: looks like it's not necessary
// const disabledType = (valueType, contentType) => {
// 	const hide = options =>
// 		Object.keys(options).forEach(key => {
// 			if (options[key].value === valueType) {
// 				options[key].disabled = true;
// 			}
// 		});

// 	hide(typeOptions[contentType]);
// };

const getDCOptions = async (
	dataRequest,
	postIdOptions,
	contentType,
	isCL = false,
	contextLoop
) => {
	const { type, id, field, relation, author } = dataRequest;

	const customPostTypes = select(
		'maxiBlocks/dynamic-content'
	).getCustomPostTypes();

	const isCustomPostType = customPostTypes.includes(type);

	const isCustomTaxonomy = select('maxiBlocks/dynamic-content')
		.getCustomTaxonomies()
		.includes(type);

	const data = await getIdOptions(
		type,
		relation,
		author,
		isCustomPostType,
		isCustomTaxonomy
	);

	if (!data) return null;

	const prefix = isCL ? 'cl-' : 'dc-';

	const newValues = {};

	const newPostIdOptions = data.map(item => {
		if (
			[
				'tags',
				'categories',
				'product_tags',
				'product_categories',
			].includes(type) ||
			orderByRelations.includes(relation)
		) {
			return {
				label: limitString(item.name, 10),
				value: +item.id,
			};
		}

		if (isCustomPostType || isCustomTaxonomy) {
			let title;

			if (isCustomPostType) {
				title = item.title?.rendered ?? item.title;
			} else {
				title = item.name?.rendered ?? item.name;
			}

			return {
				label: `${item.id}${title ? ` - ${title}` : ''}`,
				value: +item.id,
			};
		}

		return {
			label: `${item.id} - ${
				item[idOptionByField[type]]?.rendered ??
				item[idOptionByField[type]]
			}`,
			value: +item.id,
		};
	});

	if (!isEqual(newPostIdOptions, postIdOptions)) {
		// Ensures first post id is selected
		if (isEmpty(find(newPostIdOptions, { value: id }))) {
			if (!contextLoop?.['cl-status']) {
				if (
					orderByRelations.includes(relation) &&
					!newPostIdOptions.length
				) {
					newValues[`${prefix}relation`] = 'by-date';
					newValues[`${prefix}order`] = 'desc';
				} else {
					newValues[`${prefix}id`] = Number(data[0].id);
					idTypes.current = data[0].id;
				}
			} else {
				newValues[`${prefix}id`] = undefined;
			}
		}

		if (!isCL) {
			if (isEmpty(newPostIdOptions)) {
				if (relation === 'by-author')
					newValues[`${prefix}error`] = relation;

				if (['tags', 'media'].includes(type)) {
					newValues[`${prefix}error`] = type;
					// TODO: this does not work without the second parameter, so it never works ^_^
					// disabledType(type);
				}

				return { newValues, newPostIdOptions: [] };
			}
			if (relation === 'by-author') newValues[`${prefix}error`] = '';

			// Ensures first field is selected
			if (!field)
				newValues[`${prefix}field`] = getFields(
					contentType,
					type
				)[0].value;
		}

		return { newValues, newPostIdOptions };
	}

	return null;
};

export default getDCOptions;
