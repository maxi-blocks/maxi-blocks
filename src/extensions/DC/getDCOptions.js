/**
 * WordPress dependencies
 */
import { resolveSelect } from '@wordpress/data';
import { store as coreStore } from '@wordpress/core-data';

/**
 * Internal dependencies
 */
import {
	fieldOptions,
	idFields,
	idOptionByField,
	relationOptions,
	typeOptions,
} from './constants';

/**
 * External dependencies
 */
import { isEmpty, find, isEqual } from 'lodash';

export const getIdOptions = async (type, relation, author) => {
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
	} else if (type === 'categories') {
		data = await getEntityRecords('taxonomy', 'category');
	} else if (type === 'tags') {
		data = await getEntityRecords('taxonomy', 'post_tag');
	} else if (relation === 'author') {
		data = await getEntityRecords('postType', dictionary[type], {
			author,
		});
	} else {
		data = await getEntityRecords('postType', dictionary[type]);
	}

	return data;
};

const disabledType = (valueType, thisType = 'type') => {
	const hide = options =>
		Object.keys(options).forEach(key => {
			if (options[key].value === valueType) {
				options[key].disabled = true;
			}
		});

	hide(thisType === 'relation' ? relationOptions : typeOptions);
};

const getDCOptions = async (dataRequest, postIdOptions) => {
	const { type, id, field, relation, author } = dataRequest;

	const data = await getIdOptions(type, relation, author);

	if (!data) return null;

	const newValues = {};

	const newPostIdOptions = data.map(item => {
		if (['tags', 'categories'].includes(type)) {
			return {
				label: item.name,
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
		if (isEmpty(newPostIdOptions)) {
			if (relation === 'author') newValues['dc-error'] = relation;

			if (['tags', 'media'].includes(type)) {
				newValues['dc-error'] = type;
				disabledType(type);
			}

			return { newValues, newPostIdOptions: [] };
		}
		if (relation === 'author') newValues['dc-error'] = '';

		// Ensures first post id is selected
		if (isEmpty(find(newPostIdOptions, { value: id }))) {
			newValues['dc-id'] = Number(data[0].id);
			idFields.current = data[0].id;
		}

		// Ensures first field is selected
		if (!field) newValues['dc-field'] = fieldOptions[type][0].value;

		return { newValues, newPostIdOptions };
	}

	return null;
};

export default getDCOptions;
