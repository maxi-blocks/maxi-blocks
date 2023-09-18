/**
 * WordPress dependencies
 */
import { resolveSelect, select } from '@wordpress/data';

/**
 * Internal dependencies
 */
import getDCErrors from './getDCErrors';
import { getDCOrder } from './utils';
import {
	kindDictionary,
	nameDictionary,
	orderRelations,
	orderTypes,
	relationTypes,
} from './constants';

/**
 * External dependencies
 */
import { isNil } from 'lodash';

const randomEntityIndexes = {};

// Gets a random entity from a list of entities and stores the index per block
const getRandomEntity = (entities, clientId) => {
	if (
		isNil(randomEntityIndexes[clientId]) ||
		randomEntityIndexes[clientId] > entities.length
	) {
		randomEntityIndexes[clientId] = Math.floor(
			Math.random() * entities.length
		);
	}

	return entities[randomEntityIndexes[clientId]];
};

const getDCEntity = async (dataRequest, clientId) => {
	const {
		type,
		id,
		error,
		show,
		relation,
		author,
		orderBy,
		order,
		accumulator,
	} = dataRequest;

	const contentError = getDCErrors(type, error, show, relation);

	if (contentError) return contentError;

	if (type === 'users') {
		dataRequest.id = author ?? id;
	}

	if (type === 'users') {
		const { getUsers, getUser } = resolveSelect('core');

		if (relation === 'random') {
			return getRandomEntity(
				await getUsers({
					who: 'authors',
					per_page: 100,
					hide_empty: false,
				}),
				clientId
			);
		}

		if (['by-date', 'alphabetical'].includes(relation)) {
			const users = await getUsers({
				who: 'authors',
				per_page: accumulator + 1,
				hide_empty: false,
				order,
				orderby: relation === 'by-date' ? 'registered_date' : 'name',
			});

			return users.at(-1);
		}

		const user = await getUser(author ?? id);

		return user;
	}
	if (relationTypes.includes(type) && relation === 'random') {
		return getRandomEntity(
			await resolveSelect('core').getEntityRecords(
				kindDictionary[type],
				nameDictionary[type],
				{
					per_page: 100,
					hide_empty: false,
				}
			),
			clientId
		);
	}

	if (orderTypes.includes(type) && orderRelations.includes(relation)) {
		const entities = await resolveSelect('core').getEntityRecords(
			kindDictionary[type],
			nameDictionary[type],
			{
				per_page: accumulator + 1,
				hide_empty: false,
				order,
				orderby: getDCOrder(relation, orderBy),
				...(relation === 'by-category' && { categories: id }),
				...(relation === 'by-author' && { author: id }),
				...(relation === 'by-tag' && { tags: id }),
			}
		);

		return entities.at(-1);
	}

	if (type === 'settings') {
		const settings = await resolveSelect('core').getEditedEntityRecord(
			kindDictionary[type],
			'site'
		);

		return settings;
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

		return termsEntity[0];
	}

	if (relation === 'current') {
		return resolveSelect('core').getEditedEntityRecord(
			kindDictionary[type],
			nameDictionary[type],
			select('core/editor').getCurrentPostId()
		);
	}

	const existingPost = await resolveSelect('core').getEntityRecords(
		kindDictionary[type],
		nameDictionary[type] ?? type,
		{
			include: id,
		}
	);

	if (!existingPost || existingPost.length === 0) {
		return null;
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

	if (entity) return entity;

	return null;
};

export default getDCEntity;
