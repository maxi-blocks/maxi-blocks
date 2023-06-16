/**
 * WordPress dependencies
 */
import { resolveSelect } from '@wordpress/data';

/**
 * Internal dependencies
 */
import getDCErrors from './getDCErrors';
import { getDCOrderBy } from './utils';
import { orderRelations, orderTypes, relationTypes } from './constants';

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

const getDCEntity = async dataRequest => {
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
			const randomUser = await getUsers({
				who: 'authors',
				per_page: 100,
				hide_empty: false,
			});

			return randomUser[Math.floor(Math.random() * randomUser.length)];
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
		const randomEntity = await resolveSelect('core').getEntityRecords(
			kindDictionary[type],
			nameDictionary[type],
			{
				per_page: 100,
				hide_empty: false,
			}
		);

		return randomEntity[Math.floor(Math.random() * randomEntity.length)];
	}

	if (orderTypes.includes(type) && orderRelations.includes(relation)) {
		const entities = await resolveSelect('core').getEntityRecords(
			kindDictionary[type],
			nameDictionary[type],
			{
				per_page: accumulator + 1,
				hide_empty: false,
				order,
				orderby: getDCOrderBy(relation, orderBy),
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
