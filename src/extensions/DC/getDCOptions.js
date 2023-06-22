/**
 * WordPress dependencies
 */
import { resolveSelect } from '@wordpress/data';
import { store as coreStore } from '@wordpress/core-data';

/**
 * Internal dependencies
 */
import { fieldOptions, idFields, idOptionByField } from './constants';

/**
 * External dependencies
 */
import { find, isEmpty, isEqual } from 'lodash';
import { limitString } from './utils';

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

	const args = {
		per_page: -1,
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
		data = await getEntityRecords('taxonomy', 'category', args);
	} else if (type === 'tags') {
		data = await getEntityRecords('taxonomy', 'post_tag', args);
	} else if (relation === 'author') {
		data = await getEntityRecords('postType', dictionary[type], {
			...args,
			author,
		});
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

	const data = await getIdOptions(type, relation, author);

	if (!data) return null;

	const prefix = isCL ? 'cl-' : 'dc-';

	const newValues = {};

	const newPostIdOptions = data.map(item => {
		if (['tags', 'categories'].includes(type)) {
			return {
				label: limitString(item.name, 10),
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
			if (
				!contextLoop?.['cl-status'] ||
				(contextLoop?.['cl-status'] &&
					type !== contextLoop?.['cl-type'])
			) {
				newValues[`${prefix}id`] = Number(data[0].id);
				idFields.current = data[0].id;
			} else {
				newValues[`${prefix}id`] = undefined;
			}
		}

		if (!isCL) {
			if (isEmpty(newPostIdOptions)) {
				if (relation === 'author')
					newValues[`${prefix}error`] = relation;

				if (['tags', 'media'].includes(type)) {
					newValues[`${prefix}error`] = type;
					// TODO: this does not work without the second parameter, so it never works ^_^
					// disabledType(type);
				}

				return { newValues, newPostIdOptions: [] };
			}
			if (relation === 'author') newValues[`${prefix}error`] = '';

			// Ensures first field is selected
			if (!field)
				newValues[`${prefix}field`] =
					fieldOptions[contentType][type][0].value;
		}

		return { newValues, newPostIdOptions };
	}

	return null;
};

export default getDCOptions;
