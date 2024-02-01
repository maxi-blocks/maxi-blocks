/**
 * WordPress dependencies
 */
import { resolveSelect, select } from '@wordpress/data';

/**
 * Internal dependencies
 */
import getDCErrors from './getDCErrors';
import { getDCOrder, getRelationKeyForId } from './utils';
import { getCartData } from './getWooCommerceData';
import { kindDictionary, nameDictionary, orderRelations } from './constants';

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

	const customPostTypes = select(
		'maxiBlocks/dynamic-content'
	).getCustomPostTypes();
	const customTaxonomies = select(
		'maxiBlocks/dynamic-content'
	).getCustomTaxonomies();

	const getKind = type => {
		if (customPostTypes.includes(type)) return 'postType';
		if (customTaxonomies.includes(type)) return 'taxonomy';

		return kindDictionary[type];
	};

	if (type === 'users') {
		dataRequest.id = author ?? id;

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

			return users?.at(-1);
		}

		const user = await getUser(author ?? id);

		return user;
	}

	const relationTypes = select(
		'maxiBlocks/dynamic-content'
	).getRelationTypes();

	if (relationTypes.includes(type) && relation === 'random') {
		return getRandomEntity(
			await resolveSelect('core').getEntityRecords(
				getKind(type),
				nameDictionary[type] ?? type,
				{
					per_page: 100,
					hide_empty: false,
				}
			),
			clientId
		);
	}

	const orderTypes = select('maxiBlocks/dynamic-content').getOrderTypes();

	if (orderTypes.includes(type) && orderRelations.includes(relation)) {
		const relationKeyForId = getRelationKeyForId(relation, type);

		const entities = await resolveSelect('core').getEntityRecords(
			getKind(type),
			nameDictionary[type] ?? type,
			{
				per_page: accumulator + 1,
				hide_empty: false,
				order,
				orderby: getDCOrder(relation, orderBy),
				...(relationKeyForId && { [relationKeyForId]: id }),
			}
		);

		return entities?.at(-1);
	}

	if (type === 'settings') {
		const settings = await resolveSelect('core').getEditedEntityRecord(
			getKind(type),
			'site'
		);

		return settings;
	}
	if (type === 'cart') {
		const cart = await getCartData();

		return cart;
	}
	if (
		['tags', 'categories', 'product_categories', 'product_tags'].includes(
			type
		)
	) {
		const termsEntity = await resolveSelect('core').getEntityRecords(
			getKind(type),
			nameDictionary[type] ?? type,
			{
				per_page: 1,
				hide_empty: false,
				include: id,
			}
		);

		return termsEntity[0];
	}

	if (relation === 'current') {
		return (
			resolveSelect('core').getEditedEntityRecord(
				getKind(type),
				nameDictionary[type] ?? type,
				select('core/editor').getCurrentPostId()
			) ?? {}
		);
	}

	const existingPost = await resolveSelect('core').getEntityRecords(
		getKind(type) ?? 'postType', // TODO: don't use ?? here
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
		getKind(type) ?? 'postType',
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
