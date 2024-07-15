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

const getAuthorLink = async authorId => {
	const { getUsers } = resolveSelect('core');
	const user = await getUsers({ include: authorId });
	return user?.[0]?.link;
};

const getDCLink = async (dataRequest, clientId) => {
	const { type, linkTarget, author } = dataRequest;

	if (type === 'cart') {
		return getCartUrl();
	}

	const customTaxonomies = select(
		'maxiBlocks/dynamic-content'
	).getCustomTaxonomies();

	if (inlineLinkFields.includes(linkTarget) || customTaxonomies.includes(linkTarget)) {
		return 'Multiple Links';
	}

	const data = await getDCEntity(dataRequest, clientId);

	if (type === 'products') {
		return getProductsLink(dataRequest, data);
	}

	if (linkTarget === 'author') {
		return getAuthorLink(author);
	}

	return data?.link || null;
};

export default getDCLink;
