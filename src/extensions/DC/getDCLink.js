/**
 * WordPress dependencies
 */
import { resolveSelect, select } from '@wordpress/data';

/**
 * Internal dependencies
 */
import getDCEntity from './getDCEntity';
import { getCartUrl, getProductData } from './getWooCommerceData';
import { inlineLinkFields, nameDictionary } from './constants';
import { getCurrentTemplateSlug, getPostBySlug } from './utils';

const getProductsLink = async (dataRequest, data) => {
	const productData = await getProductData(data?.id);

	if (dataRequest?.linkTarget === 'add_to_cart') {
		const siteUrl = select('core').getSite()?.url;
		const addToCartUrl = productData?.add_to_cart?.url;
		return siteUrl && addToCartUrl ? `${siteUrl}${addToCartUrl}` : null;
	}

	return productData?.permalink;
};

const getPostAuthorLink = async authorId => {
	const { getUsers } = resolveSelect('core');
	const user = await getUsers({ include: authorId });
	return user?.[0]?.link;
};

const getUserLink = (dataRequest, data) => {
	if (dataRequest?.linkTarget === 'author_email') {
		return data?.email ? `mailto:${data?.email}` : null;
	}
	if (dataRequest?.linkTarget === 'author_site') {
		return data?.url;
	}

	return data?.link;
};

const cache = {};
const MAX_CACHE_SIZE = 200;

const getDCLink = async (dataRequest, clientId) => {
	const { type, linkTarget, author, relation } = dataRequest;
	if (type === 'cart') {
		return getCartUrl();
	}
	if (linkTarget.includes('author')) {
		let userId = author;
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
					if (post) {
						userId = post.author;
					}
				}
			} else {
				const postId = select('core/editor').getCurrentPostId();
				const post = await resolveSelect('core').getEntityRecord(
					'postType',
					'post',
					postId
				);
				if (post?.author) {
					userId = post.author;
				}
			}
		} else {
			const data = await getDCEntity(dataRequest, clientId);

			if (data?.author) {
				userId = data.author;
			} else if (data?.id) {
				const post = await resolveSelect('core').getEntityRecord(
					'postType',
					nameDictionary[type] ?? type,
					data.id
				);
				if (post?.author) {
					userId = post.author;
				}
			} else if (dataRequest?.id) {
				const post = await resolveSelect('core').getEntityRecord(
					'postType',
					nameDictionary[type] ?? type,
					dataRequest.id
				);
				if (post?.author) {
					userId = post.author;
				}
			}
		}

		if (!userId) {
			return null;
		}

		if (linkTarget === 'author') return getPostAuthorLink(userId);

		const { getUser } = resolveSelect('core');

		const user = await getUser(userId);
		const userTarget = linkTarget === 'author_email' ? 'email' : 'url';

		return user?.[userTarget];
	}

	if (inlineLinkFields.includes(linkTarget)) {
		return 'Multiple Links';
	}

	if (linkTarget !== 'entity') {
		const customTaxonomies = select(
			'maxiBlocks/dynamic-content'
		).getCustomTaxonomies();

		if (customTaxonomies.includes(linkTarget)) {
			return 'Multiple Links';
		}
	}

	const filteredDataRequest = { ...dataRequest };
	const keysToRemove = [
		'content',
		'customDelimiterStatus',
		'customFormat',
		'linkTarget',
		'linkUrl',
		'linkStatus',
		'field',
	];
	keysToRemove.forEach(key => delete filteredDataRequest[key]);
	const cacheKey = JSON.stringify(filteredDataRequest);
	let data;

	if (cache[cacheKey]) {
		data = cache[cacheKey];
	} else {
		data = await getDCEntity(dataRequest, clientId);
		// Check if the cache size exceeds the maximum limit
		if (Object.keys(cache).length >= MAX_CACHE_SIZE) {
			// Remove the oldest entry from the cache
			const oldestKey = Object.keys(cache)[0];
			delete cache[oldestKey];
		}
		cache[cacheKey] = data;
	}

	if (type === 'products') {
		return getProductsLink(dataRequest, data);
	}

	if (
		type === 'users' ||
		linkTarget === 'author_email' ||
		linkTarget === 'author_site'
	) {
		return getUserLink(dataRequest, data);
	}

	if (type === 'settings') {
		return data?.url || null;
	}

	return data?.link || null;
};

export default getDCLink;
