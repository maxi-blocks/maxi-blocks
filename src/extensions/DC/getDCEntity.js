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
		dc_ty: type,
		dc_id: id,
		dc_er: error,
		dc_sho: show,
		dc_rel: relation,
		dc_au: author,
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
