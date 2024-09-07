/**
 * WordPress dependencies
 */
import { resolveSelect, select } from '@wordpress/data';

/**
 * Internal dependencies
 */
import getDCEntity from './getDCEntity';
import { getCartUrl, getProductData } from './getWooCommerceData';
import { inlineLinkFields } from './constants';

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
		return `mailto:${data?.email}`;
	}
	if (dataRequest?.linkTarget === 'author_site') {
		return data?.url;
	}

	return data?.link;
};

const cache = {};
const MAX_CACHE_SIZE = 200;

const getDCLink = async (dataRequest, clientId) => {
	const { type, linkTarget, author } = dataRequest;

	if (type === 'cart') {
		return getCartUrl();
	}

	const customTaxonomies = select(
		'maxiBlocks/dynamic-content'
	).getCustomTaxonomies();

	if (
		inlineLinkFields.includes(linkTarget) ||
		customTaxonomies.includes(linkTarget)
	) {
		return 'Multiple Links';
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

	if (type === 'users') {
		return getUserLink(dataRequest, data);
	}

	if (linkTarget === 'author') {
		return getPostAuthorLink(author);
	}

	return data?.link || null;
};

export default getDCLink;
