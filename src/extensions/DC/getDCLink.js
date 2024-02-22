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
		if (!siteUrl || !addToCartUrl) {
			return null;
		}

		return `${siteUrl}${addToCartUrl}`;
	}

	return productData?.permalink;
};

const getDCContent = async (dataRequest, clientId) => {
	if (dataRequest?.type === 'cart') {
		return getCartUrl();
	}

	const data = await getDCEntity(dataRequest, clientId);

	if (dataRequest?.type === 'products') {
		return getProductsLink(dataRequest, data);
	}

	if (dataRequest?.linkTarget === 'author') {
		const { getUsers } = resolveSelect('core');

		const user = await getUsers({ include: dataRequest?.author });

		return user?.[0]?.link;
	}

	if (inlineLinkFields.includes(dataRequest?.linkTarget)) {
		return 'Multiple Links';
	}

	const contentValue = data?.link;

	if (contentValue) return contentValue;

	return null;
};

export default getDCContent;
