/**
 * WordPress dependencies
 */
import { resolveSelect } from '@wordpress/data';

/**
 * Internal dependencies
 */
import { relationTypes } from './constants';
import getDCErrors from './getDCErrors';

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
		'dc-type': type,
		'dc-id': id,
		'dc-error': error,
		'dc-show': show,
		'dc-relation': relation,
		'dc-author': author,
		'dc-order': order,
		'dc-accumulator': accumulator,
	} = dataRequest;

	const contentError = getDCErrors(type, error, show, relation);

	if (contentError) return contentError;

	if (type === 'users') {
		dataRequest.id = author ?? id;
	}

	if (type === 'users') {
		const { getUsers } = resolveSelect('core');

		const user = await getUsers({ p: author });

		return user[0];
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
	if (
		relationTypes.includes(type) &&
		['by-date', 'alphabetical'].includes(relation)
	) {
		const entities = await resolveSelect('core').getEntityRecords(
			kindDictionary[type],
			nameDictionary[type],
			{
				per_page: accumulator + 1,
				hide_empty: false,
				order,
				orderby: relation === 'by-date' ? 'date' : 'title',
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
