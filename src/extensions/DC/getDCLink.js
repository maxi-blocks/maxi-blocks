/**
 * WordPress dependencies
 */
import { select } from '@wordpress/data';

/**
 * Internal dependencies
 */
import getDCEntity from './getDCEntity';
import { getCartUrl, getProductData } from './getWooCommerceData';

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

	const contentValue = data?.link;

	if (contentValue) return contentValue;

	return null;
};

export default getDCContent;
