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

const fetchCustomPostTypesAndTaxonomies = async () => {
	const [customPostTypes, customTaxonomies] = await Promise.all([
		select('maxiBlocks/dynamic-content').getCustomPostTypes(),
		select('maxiBlocks/dynamic-content').getCustomTaxonomies(),
	]);

	customPostTypesCache = customPostTypes;
	customTaxonomiesCache = customTaxonomies;
};

const clearCustomCache = () => {
	customPostTypesCache = null;
	customTaxonomiesCache = null;
};

// Add this at the top of the file, after the imports
const cache = {
	customTaxonomy: {},
	users: {},
	categories: {},
	tags: {},
	customPostType: {},
	currentArchive: {},
	postType: {},
};

export const clearIdOptionsCache = () => {
	Object.keys(cache).forEach(key => {
		if (cache[key] && typeof cache[key] === 'object') {
			Object.keys(cache[key]).forEach(subKey => {
				cache[key][subKey] = null;
			});
		} else {
			cache[key] = null;
		}
	});
};

// Hook into the editor initialization
wp.domReady(() => {
	clearCustomCache();
	clearIdOptionsCache();
});

const fetchUsers = async type => {
	const { getUsers } = resolveSelect(coreStore);
	const users = await getUsers();

	return users && users.length
		? users.map(({ id, name }) => ({ id, name }))
		: null;
};

const MAX_CACHE_AGE = 5 * 60 * 1000; // 5 minutes in milliseconds

const getCachedData = cacheKey => {
	const cachedItem = cache[cacheKey];
	if (cachedItem && Date.now() - cachedItem.timestamp < MAX_CACHE_AGE) {
		return cachedItem.data;
	}
	return null;
};

const setCachedData = (cacheKey, data) => {
	cache[cacheKey] = {
		data,
		timestamp: Date.now(),
	};
};

/**
 * Fetches entity records with pagination support to handle more than 100 items
 *
 * @param {string} entityType The entity type to fetch (e.g., 'taxonomy', 'postType')
 * @param {string} entityName The entity name to fetch (e.g., 'category', 'post')
 * @param {Object} args       Arguments for the fetch request
 * @param {number} maxPages   Maximum number of pages to fetch (default 20 - 2000 items)
 * @return {Promise<Array>} Array of entity records
 */
const paginatedEntityFetch = async (
	entityType,
	entityName,
	args = {},
	maxPages = 20
) => {
	const { getEntityRecords } = resolveSelect(coreStore);

	// Set optimized arguments with required fields only
	const optimizedArgs = {
		...args,
		_fields: ['id', 'name', 'title'], // Only fetch required fields
		orderby: 'id', // Optimize DB query
		per_page: 100, // Maximum allowed by WP REST API
	};

	// Add timeout protection
	const timeoutDuration = 2000;
	const timeoutPromise = new Promise((_, reject) => {
		setTimeout(() => {
			reject(new Error('Timeout'));
		}, timeoutDuration);
	});

	try {
		// First attempt to fetch page 1 with timeout
		const initialData = await Promise.race([
			getEntityRecords(entityType, entityName, optimizedArgs),
			timeoutPromise,
		]);

		// If we don't have data or have less than 100 items, we're done
		if (!initialData || initialData.length < 100) {
			return initialData || [];
		}

		// We have 100 items, so there might be more pages
		const allData = [...initialData];

		// Function to fetch additional pages
		const fetchAdditionalPages = async () => {
			// Create requests for page 2
			const page2Request = getEntityRecords(entityType, entityName, {
				...optimizedArgs,
				page: 2,
			}).catch(error => {
				console.error('Error fetching page 2:', error);
				return [];
			});

			// Wait for page 2 to complete
			const page2Data = await page2Request;

			// If page 2 doesn't exist or is empty, we're done
			if (!page2Data || page2Data.length === 0) {
				return allData;
			}

			// Add page 2 data
			allData.push(...page2Data);

			// If page 2 has less than 100 items, we're done
			if (page2Data.length < 100) {
				return allData;
			}

			// Create requests for remaining pages
			const remainingRequests = [];
			for (let page = 3; page <= maxPages; page += 1) {
				remainingRequests.push(
					getEntityRecords(entityType, entityName, {
						...optimizedArgs,
						page,
					}).catch(error => {
						console.error(`Error fetching page ${page}:`, error);
						return [];
					})
				);
			}

			// Wait for all remaining requests to complete
			const remainingResults = await Promise.allSettled(
				remainingRequests
			);

			// Process the results
			for (let i = 0; i < remainingResults.length; i += 1) {
				const result = remainingResults[i];
				if (
					result.status === 'fulfilled' &&
					Array.isArray(result.value)
				) {
					// Add the data
					allData.push(...result.value);

					// If this page has less than 100 items, we've found the last page
					// and can stop checking further pages
					if (result.value.length < 100) {
						break;
					}
				} else {
					// Stop on first error
					break;
				}
			}

			return allData;
		};

		// Execute the function to fetch additional pages
		return await fetchAdditionalPages();
	} catch (error) {
		if (error.message === 'Timeout') {
			console.warn(
				`Timeout fetching ${entityType}/${entityName}, returning empty array`
			);
			return [];
		}
		console.error(
			`Error in paginatedEntityFetch for ${entityType}/${entityName}:`,
			error
		);
		return [];
	}
};

export const getIdOptions = async (
	type,
	relation,
	author,
	isCustomPostType,
	isCustomTaxonomy,
	paginationPerPage = null
) => {
	if (
		![...idTypes].includes(type) &&
		!isCustomPostType &&
		!isCustomTaxonomy
	) {
		return false;
	}

	let data;
	const args = {
		per_page: relation === 'by-id' ? -1 : paginationPerPage * 3 || -1,
	};

	try {
		if (relation.includes('by-custom-taxonomy')) {
			const taxonomy = relation.split('custom-taxonomy-').pop();
			const cacheKey = `customTaxonomy.${taxonomy}`;
			data = getCachedData(cacheKey);
			if (!data) {
				data = await paginatedEntityFetch('taxonomy', taxonomy, args);
				setCachedData(cacheKey, data);
			}
		} else if (['users'].includes(type) || relation === 'by-author') {
			data = getCachedData('users');
			if (!data) {
				data = await fetchUsers(type);
				setCachedData('users', data);
			}
		} else if (
			['categories', 'product_categories'].includes(type) ||
			relation === 'by-category'
		) {
			const categoryType = ['products', 'product_categories'].includes(
				type
			)
				? 'product_cat'
				: 'category';
			const cacheKey = `categories.${categoryType}`;

			data = getCachedData(cacheKey);

			if (!data) {
				data = await paginatedEntityFetch(
					'taxonomy',
					categoryType,
					args
				);

				if (data) {
					setCachedData(cacheKey, data);
				}
			}
		} else if (
			['tags', 'product_tags'].includes(type) ||
			relation === 'by-tag'
		) {
			const tagType = ['products', 'product_tags'].includes(type)
				? 'product_tag'
				: 'post_tag';
			const cacheKey = `tags.${tagType}`;
			data = getCachedData(cacheKey);
			if (!data) {
				data = await paginatedEntityFetch('taxonomy', tagType, args);
				setCachedData(cacheKey, data);
			}
		} else if (isCustomTaxonomy) {
			const cacheKey = `customTaxonomy.${type}`;
			data = getCachedData(cacheKey);
			if (!data) {
				data = await paginatedEntityFetch('taxonomy', type, args);
				setCachedData(cacheKey, data);
			}
		} else if (isCustomPostType) {
			const cacheKey = `customPostType.${type}`;
			data = getCachedData(cacheKey);
			if (!data) {
				data = await paginatedEntityFetch('postType', type, args);
				setCachedData(cacheKey, data);
			}
		} else if (relation === 'current-archive') {
			const currentTemplateType = getCurrentTemplateSlug();
			const cacheKey = `currentArchive.${currentTemplateType}`;
			data = getCachedData(cacheKey);
			if (!data) {
				if (currentTemplateType === 'author') {
					data = await fetchUsers();
				} else if (
					['category', 'tag', 'taxonomy'].includes(
						currentTemplateType
					)
				) {
					data = await paginatedEntityFetch(
						'taxonomy',
						currentTemplateType,
						args
					);
				} else {
					data = await paginatedEntityFetch(
						'taxonomy',
						'category',
						args
					);
				}
				setCachedData(cacheKey, data);
			}
		} else if (getCurrentTemplateSlug() === 'archive') {
			const cacheKey = 'currentArchive.archive';
			data = getCachedData(cacheKey);
			if (!data) {
				data = await paginatedEntityFetch('taxonomy', 'category', args);
				setCachedData(cacheKey, data);
			}
		} else {
			const dictionary = {
				posts: 'post',
				pages: 'page',
				media: 'attachment',
				products: 'product',
			};
			const postType = dictionary[type];
			const cacheKey = `postType.${postType}`;
			data = getCachedData(cacheKey);
			if (!data) {
				data = await paginatedEntityFetch('postType', postType, args);
				setCachedData(cacheKey, data);
			}
		}
	} catch (error) {
		console.error('Error in getIdOptions:', error);
	}

	return data;
};

const getDCOptions = async (
	{ type, id, field, relation, author },
	postIdOptions,
	contentType,
	isCL = false,
	{
		'cl-status': clStatus,
		'cl-pagination-per-page': clPaginationPerPage,
	} = {}
) => {
	let isCustomPostType = false;
	let isCustomTaxonomy = false;
	if (![...idTypes].includes(type)) {
		if (
			!customPostTypesCache ||
			!customTaxonomiesCache ||
			customPostTypesCache.length === 0 ||
			customTaxonomiesCache.length === 0
		) {
			await fetchCustomPostTypesAndTaxonomies();
		}

		isCustomPostType = customPostTypesCache.includes(type);
		isCustomTaxonomy = customTaxonomiesCache.includes(type);
	}

	const data = await getIdOptions(
		type,
		relation,
		author,
		isCustomPostType,
		isCustomTaxonomy,
		clPaginationPerPage
	);

	if (!data) {
		return {
			newValues: {},
			newPostIdOptions: [],
		};
	}

	const prefix = isCL ? 'cl-' : 'dc-';

	const newPostIdOptions = data.map(item => {
		if (relation.includes('by-custom-taxonomy')) {
			return {
				label: limitString(item.name, 25),
				value: +item.id,
			};
		}
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
				label: limitString(item.name, 25),
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
				} else if (data.length) {
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
