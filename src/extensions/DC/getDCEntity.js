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
import { isEmpty } from 'lodash';

// New function to get a seeded random index
const getSeededRandomIndex = (seed, max) => {
	const x = Math.sin(seed) * 10000;
	return Math.floor((x - Math.floor(x)) * max);
};

// Updated getRandomEntity function
const getRandomEntity = (entities, accumulator) => {
	if (isEmpty(entities)) return null;

	const seed = accumulator;
	const randomIndex = getSeededRandomIndex(seed, entities.length);

	return entities[randomIndex];
};

const getPostBySlug = async slug => {
	const posts = await select('core').getEntityRecords('postType', 'post', {
		slug,
		per_page: 1,
	});

	if (posts && posts.length > 0) {
		return posts[0];
	}

	return null;
};

const getAuthorBySlug = async slug => {
	const users = await select('core').getEntityRecords('root', 'user', {
		slug,
		per_page: 1,
	});

	if (users && users.length > 0) {
		return users[0];
	}

	return null;
};

const getCategoryBySlug = async slug => {
	const categories = await select('core').getEntityRecords(
		'taxonomy',
		'category',
		{
			slug,
			per_page: 1,
		}
	);

	if (categories && categories.length > 0) {
		return categories[0];
	}

	return null;
};

const getTagBySlug = async slug => {
	const tags = await select('core').getEntityRecords('taxonomy', 'post_tag', {
		slug,
		per_page: 1,
	});

	if (tags && tags.length > 0) {
		return tags[0];
	}

	return null;
};

const getProductBySlug = async slug => {
	const products = await select('core').getEntityRecords(
		'postType',
		'product',
		{
			slug,
			per_page: 1,
		}
	);

	if (products && products.length > 0) {
		return products[0];
	}

	return null;
};

const existingEntities = {};
const nonExistingEntities = {};

const getKind = type => {
	if (kindDictionary[type]) {
		return kindDictionary[type];
	}

	const customPostTypes = select(
		'maxiBlocks/dynamic-content'
	).getCustomPostTypes();
	if (customPostTypes.includes(type)) return 'postType';

	const customTaxonomies = select(
		'maxiBlocks/dynamic-content'
	).getCustomTaxonomies();
	if (customTaxonomies.includes(type)) return 'taxonomy';

	return 'postType';
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

	if (relation === 'current') {
		const isFSE = select('core/edit-site') !== undefined;

		if (isFSE) {
			const currentTemplateType = getCurrentTemplateSlug();
			if (
				currentTemplateType.includes('single-post-') &&
				type === 'posts'
			) {
				const postSlug = currentTemplateType.replace(
					'single-post-',
					''
				);
				const post = await getPostBySlug(postSlug);
				if (post) return post;
			} else if (
				currentTemplateType.includes('author-') &&
				type === 'users'
			) {
				const authorSlug = currentTemplateType.replace('author-', '');
				const author = await getAuthorBySlug(authorSlug);
				if (author) return author;
			} else if (
				currentTemplateType.includes('category-') &&
				type === 'categories'
			) {
				const categorySlug = currentTemplateType.replace(
					'category-',
					''
				);
				const category = await getCategoryBySlug(categorySlug);
				if (category) return category;
			} else if (
				currentTemplateType.includes('tag-') &&
				type === 'tags'
			) {
				const tagSlug = currentTemplateType.replace('tag-', '');
				const tag = await getTagBySlug(tagSlug);
				if (tag) return tag;
			} else if (
				currentTemplateType.includes('single-product-') &&
				type === 'products'
			) {
				const productSlug = currentTemplateType.replace(
					'single-product-',
					''
				);
				const product = await getProductBySlug(productSlug);
				if (product) return product;
			}
		}
	}

	if (['users'].includes(type)) {
		let user;
		if (type === 'users') dataRequest.id = author ?? id;

		const { getUser } = resolveSelect('core');

		if (relation === 'random') {
			const users = await resolveSelect('core').getUsers({
				who: 'authors',
				per_page: 100,
				hide_empty: false,
			});
			return getRandomEntity(users, accumulator);
		}

		if (['by-date', 'alphabetical'].includes(relation)) {
			const users = await resolveSelect('core').getUsers({
				who: 'authors',
				per_page: accumulator + 1,
				hide_empty: false,
				order,
				orderby: relation === 'by-date' ? 'registered_date' : 'name',
			});

			user = users?.at(-1);
		} else if (relation === 'current') {
			const currentUserId = select('core').getCurrentUser()?.id; // getCurrentUser doesn't have all the data we need
			user = await getUser(currentUserId);
		} else user = await getUser(dataRequest.id);

		return user;
	}

	if (relation === 'random') {
		const relationTypes = select(
			'maxiBlocks/dynamic-content'
		).getRelationTypes();
		if (relationTypes.includes(type)) {
			const entities = await resolveSelect('core').getEntityRecords(
				getKind(type),
				nameDictionary[type] ?? type,
				{
					per_page: 100,
					hide_empty: false,
				}
			);
			return getRandomEntity(entities, accumulator);
		}
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

	const orderTypes = select('maxiBlocks/dynamic-content').getOrderTypes();

	if (
		(orderTypes.includes(type) && orderRelations.includes(relation)) ||
		relation.includes('custom-taxonomy') ||
		relation === 'current-archive'
	) {
		let relationKeyForId = getRelationKeyForId(relation, type);
		const currentTemplateType = getCurrentTemplateSlug();
		let currentId = id;
		if (relation === 'current-archive') {
			const getRelationKeyForIdByTemplate = templateType => {
				if (templateType.includes('single-post')) {
					return 'post';
				}
				if (templateType.includes('author')) {
					return 'author';
				}
				if (templateType.includes('category')) {
					return 'categories';
				}
				if (templateType.includes('tag')) {
					return 'tags';
				}
				if (templateType.includes('single-product-')) {
					return 'product_categories';
				}
				if (templateType.includes('taxonomy')) {
					return templateType.replace('taxonomy-', '');
				}
				return null;
			};
			relationKeyForId =
				getRelationKeyForIdByTemplate(currentTemplateType);

			const taxonomyName =
				relationKeyForId === 'tags'
					? 'post_tag'
					: relationKeyForId === 'categories'
					? 'category'
					: relationKeyForId;

			const taxonomyRecords = await resolveSelect(
				'core'
			).getEntityRecords('taxonomy', taxonomyName, {
				per_page: 1,
				hide_empty: false,
			});

			if (taxonomyRecords && taxonomyRecords.length > 0) {
				const firstRecord = taxonomyRecords[0];
				currentId = firstRecord.id;
			}
		}

		if (relationKeyForId && currentId) {
			let hasEntity;
			const entityKey = `${relationKeyForId}-${currentId}`;
			if (nonExistingEntities[entityKey]) {
				return null;
			}
			if (existingEntities[entityKey]) {
				hasEntity = existingEntities[entityKey];
			} else {
				try {
					if (relationKeyForId === 'author') {
						hasEntity = await resolveSelect('core').getEntityRecord(
							'root',
							'user',
							currentId
						);
					} else {
						const taxonomyName =
							relationKeyForId === 'tags'
								? 'post_tag'
								: relationKeyForId === 'categories'
								? 'category'
								: relationKeyForId;

						const delay = ms =>
							new Promise(resolve => {
								setTimeout(resolve, ms);
							});
						await delay(1000); // Delay for 1 second

						hasEntity = await resolveSelect('core').getEntityRecord(
							'taxonomy',
							taxonomyName,
							currentId
						);
					}
					if (hasEntity) {
						existingEntities[entityKey] = hasEntity;
					} else {
						nonExistingEntities[entityKey] = true;
					}
				} catch (error) {
					// Silent error handling
					hasEntity = null;
				}
			}

			if (!hasEntity) {
				return null;
			}
		}
		const entities = await resolveSelect('core').getEntityRecords(
			getKind(type),
			nameDictionary[type] ?? type,
			{
				per_page: 1,
				order,
				orderby: getDCOrder(relation, orderBy),
				offset: accumulator,
				...(relationKeyForId && {
					[relationKeyForId]: currentId,
				}),
			}
		);
		if (entities && entities.length > 0) {
			return entities.slice(-1)[0];
		}
		return null;
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
				const taxonomyData = {};

				try {
					const postType =
						type === 'posts'
							? select('core').getPostType('post')
							: select('core').getPostType(type);
					if (postType) {
						const taxonomies = postType?.taxonomies;

						if (taxonomies) {
							const customTaxonomies = taxonomies.filter(
								taxonomy =>
									!['category', 'post_tag'].includes(taxonomy)
							);

							const termsPerTaxonomy = {};
							for (const taxonomy of customTaxonomies) {
								termsPerTaxonomy[taxonomy] = resolveSelect(
									'core'
								).getEntityRecords('taxonomy', taxonomy, {
									per_page: 2,
								});
							}

							await Promise.all(Object.values(termsPerTaxonomy));

							Object.entries(termsPerTaxonomy).forEach(
								([taxonomy, terms]) => {
									const termIds = terms
										? terms.map(term => term.id)
										: [];
									taxonomyData[taxonomy] = termIds;
								}
							);
						}
					}
				} catch (error) {
					// silent error
				}

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
					generated_slug: 'example-post',
					acf: {
						custom_field: 'Field: example custom field',
					},
					description: 'Description: example description.',
					count: 100,
					...(categoriesIds.length > 0 && {
						categories: categoriesIds,
					}),
					...(tagsIds.length > 0 && { tags: tagsIds }),
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
					if (
						!entity.categories ||
						(entity.categories.length === 0 &&
							categoriesIds.length > 0)
					) {
						entity.categories = categoriesIds;
					}
					if (
						!entity.tags ||
						(entity.tags.length === 0 && tagsIds.length > 0)
					) {
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
		} else {
			const entity = await resolveSelect('core').getEditedEntityRecord(
				getKind(type),
				nameDictionary[type] ?? type,
				select('core/editor').getCurrentPostId()
			);
			if (entity) return entity;
		}
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
