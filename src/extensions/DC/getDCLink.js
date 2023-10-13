/**
 * WordPress dependencies
 */
import { select } from '@wordpress/data';

/**
 * Internal dependencies
 */
import getDCEntity from './getDCEntity';
import { getCartUrl, getProductData } from './getWooCommerceData';

const getProductsLink = async dataRequest => {
	const data = await getProductData(dataRequest?.id);

	if (dataRequest?.linkTarget === 'add_to_cart') {
		const siteUrl = select('core').getSite()?.url;
		const addToCartUrl = data?.add_to_cart?.url;
		if (!siteUrl || !addToCartUrl) {
			return null;
		}

		return `${siteUrl}${addToCartUrl}`;
	}

	return data?.permalink;
};

const getDCContent = async (dataRequest, clientId) => {
	if (dataRequest?.type === 'products') {
		return getProductsLink(dataRequest);
	}
	if (dataRequest?.type === 'cart') {
		return getCartUrl();
	}

	const data = await getDCEntity(dataRequest, clientId);

	const contentValue = data?.link;

	if (contentValue) return contentValue;

	return null;
};

export default getDCContent;
