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

let customPostTypesCache = null;
let customTaxonomiesCache = null;

const clearCustomCache = () => {
	customPostTypesCache = null;
	customTaxonomiesCache = null;
};

// Hook into the editor initialization
wp.domReady(() => {
	clearCustomCache();
});

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

	const args = { per_page: -1 };

	const currentTemplateType = getCurrentTemplateSlug();

	const fetchUsers = async () => {
		const users = await getUsers();
		return users ? users.map(({ id, name }) => ({ id, name })) : null;
	};

	if (type === 'users' || relation === 'by-author') {
		data = await fetchUsers();
	} else if (
		['categories', 'product_categories'].includes(type) ||
		relation === 'by-category'
	) {
		const categoryType = ['products', 'product_categories'].includes(type)
			? 'product_cat'
			: 'category';
		data = await getEntityRecords('taxonomy', categoryType, args);
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
		if (currentTemplateType === 'author') {
			data = await fetchUsers();
		} else if (['category', 'tag'].includes(currentTemplateType)) {
			data = await getEntityRecords(
				'taxonomy',
				currentTemplateType,
				args
			);
		} else {
			data = await getEntityRecords('taxonomy', 'category', args);
		}
	} else if (currentTemplateType === 'archive') {
		data = await getEntityRecords('taxonomy', 'category', args);
	} else {
		data = await getEntityRecords('postType', dictionary[type], args);
	}

	return data;
};

const getDCOptions = async (
	{ type, id, field, relation, author },
	postIdOptions,
	contentType,
	isCL = false,
	{ 'cl-status': clStatus } = {}
) => {
	if (!customPostTypesCache || !customTaxonomiesCache) {
		const [customPostTypes, customTaxonomies] = await Promise.all([
			select('maxiBlocks/dynamic-content').getCustomPostTypes(),
			select('maxiBlocks/dynamic-content').getCustomTaxonomies(),
		]);

		customPostTypesCache = customPostTypes;
		customTaxonomiesCache = customTaxonomies;
	}

	const isCustomPostType = customPostTypesCache.includes(type);
	const isCustomTaxonomy = customTaxonomiesCache.includes(type);

	const data = await getIdOptions(
		type,
		relation,
		author,
		isCustomPostType,
		isCustomTaxonomy
	);

	if (!data) {
		return null;
	}

	const prefix = isCL ? 'cl-' : 'dc-';

	const newPostIdOptions = data.map(item => {
		if (
			[
				'tags',
				'categories',
				'product_tags',
				'product_categories',
				'archive',
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

	const newValues = {};

	if (!isEqual(newPostIdOptions, postIdOptions)) {
		if (isEmpty(find(newPostIdOptions, { value: id }))) {
			if (!clStatus) {
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
				if (relation === 'by-author') {
					newValues[`${prefix}error`] = relation;
				}

				if (['tags', 'media'].includes(type)) {
					newValues[`${prefix}error`] = type;
				}

				return { newValues, newPostIdOptions: [] };
			}

			if (relation === 'by-author') {
				newValues[`${prefix}error`] = '';
			}

			if (!field) {
				newValues[`${prefix}field`] = getFields(
					contentType,
					type
				)[0].value;
			}
		}

		return { newValues, newPostIdOptions };
	}

	return null;
};

export default getDCOptions;
