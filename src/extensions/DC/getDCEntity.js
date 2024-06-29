/**
 * WordPress dependencies
 */
import { resolveSelect, select } from '@wordpress/data';

/**
 * Internal dependencies
 */
import getDCErrors from './getDCErrors';
import {
	getDCOrder,
	getRelationKeyForId,
	getCurrentTemplateSlug,
} from './utils';
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
				per_page: 1,
				order,
				orderby: getDCOrder(relation, orderBy),
				offset: accumulator,
				...(relationKeyForId && { [relationKeyForId]: id }),
			}
		);

		return entities?.slice(-1)[0];
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
	if (relation === 'current' || type === 'archive') {
		const isFSE = select('core/edit-site') !== undefined;

		if (isFSE) {
			const allowedTemplateTypesCurrent = [
				'category',
				'tag',
				'author',
				'date',
				'archive',
				'single',
				'page',
			];
			const currentTemplateType = getCurrentTemplateSlug();
			if (
				(type.includes(currentTemplateType) &&
					allowedTemplateTypesCurrent.includes(
						currentTemplateType
					)) ||
				currentTemplateType === 'single'
			) {
				const categories = await resolveSelect('core').getEntityRecords(
					'taxonomy',
					'category',
					{ per_page: 2 }
				);

				const categoriesIds = categories
					? categories.map(category => category.id)
					: [];

				const tags = await resolveSelect('core').getEntityRecords(
					'taxonomy',
					'post_tag',
					{ per_page: 2 }
				);

				const tagsIds = tags ? tags.map(tag => tag.id) : [];

				const postType = select('core').getPostType(type);
				const taxonomies = postType.taxonomies;

				const customTaxonomies = taxonomies.filter(
				  taxonomy => !['category', 'post_tag'].includes(taxonomy)
				);

				const taxonomyData = {};

				for (const taxonomy of customTaxonomies) {
				  const terms = await resolveSelect('core').getEntityRecords(
					'taxonomy',
					taxonomy,
					{ per_page: 2 }
				  );

				  const termIds = terms ? terms.map(term => term.id) : [];
				  taxonomyData[taxonomy] = termIds;
				}

				console.log('taxonomyData', taxonomyData);

				const templateEntity = {
					id: 10000,
					date: '2024-04-02T12:20:15',
					date_gmt: '2024-04-02T11:20:15',
					modified: '2024-04-02T12:21:30',
					modified_gmt: '2024-04-02T11:21:30',
					password: '',
					slug: 'example',
					status: 'publish',
					type: 'post',
					link: '/example/',
					title: {
						raw: 'Title: example title',
						rendered: 'Title: example title',
					},
					content: {
						raw: '<!-- wp:paragraph -->\n<p>Content: example content.</p>\n<!-- /wp:paragraph -->',
						rendered: '<p>Content: example content.</p>',
						protected: false,
						block_version: 1,
					},
					excerpt: {
						raw: 'Excerpt: example excerpt.',
						rendered: '<p>Excerpt: example excerpt.</p>',
						protected: false,
					},
					author: 1,
					featured_media: 123,
					comment_status: 'open',
					ping_status: 'closed',
					sticky: false,
					template: '',
					format: 'standard',
					meta: {
						_acf_changed: true,
						footnotes: 'Footnotes: Example footnotes.',
					},
					categories: categoriesIds,
					tags: tagsIds,
					generated_slug: 'example-post',
					acf: {
						custom_field: 'Field: example custom field',
					},
					description: 'Description: example description.',
					count: 100,
					...taxonomyData,
				};

				let entity = null;
				try {
					entity = await resolveSelect('core').getEntityRecord(
						getKind(type),
						nameDictionary[type] ?? type,
						id,
						{
							per_page: 1,
						}
					);
				} catch (error) {
					// Handle the error silently
				}

				if (entity) {
					console.log('entity', entity);
					if (!entity.categories || entity.categories.length === 0) {
						entity.categories = categoriesIds;
					}
					if (!entity.tags || entity.tags.length === 0) {
						entity.tags = tagsIds;
					}
					if (!entity.title) {
						entity.title = templateEntity.title;
					}
					if (!entity?.content?.rendered) {
						entity.content = templateEntity.content.rendered;
					}
					if (!entity?.excerpt?.rendered) {
						entity.excerpt = templateEntity.excerpt.rendered;
					}
					if (!entity.link) {
						entity.link = templateEntity.link;
					}
					if (!entity?.description) {
						entity.description = templateEntity.description;
					}
					if (!entity?.count) {
						entity.count = templateEntity.count;
					}

					return entity;
				}
				return templateEntity;
			}
			if (currentTemplateType.includes('taxonomy')) {
				const taxonomies = select('core').getTaxonomies({
					per_page: -1,
				});
				const taxonomy = taxonomies.find(tax => tax.slug === type);
				if (taxonomy) return taxonomy;
			}
		}

		if(!isFSE) return (
			resolveSelect('core').getEditedEntityRecord(
				getKind(type),
				nameDictionary[type] ?? type,
				select('core/editor').getCurrentPostId()
			)
		);

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

		return termsEntity?.[0];
	}

	const existingPost = await resolveSelect('core').getEntityRecords(
		getKind(type),
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
		getKind(type),
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
