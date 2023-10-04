/**
 * WordPress dependencies
 */
import { select } from '@wordpress/data';

/**
 * Internal dependencies
 */
import getDCEntity from './getDCEntity';
import { getProductData } from './getWooCommerceData';

const getProductsLink = async dataRequest => {
	const data = await getProductData(dataRequest?.id);

	if (dataRequest?.linkTarget === 'add_to_cart') {
		return `${select('core').getSite()?.url}${data?.add_to_cart?.url}`;
	}

	return data?.permalink;
};

const getDCContent = async (dataRequest, clientId) => {
	if (dataRequest?.type === 'products') {
		return getProductsLink(dataRequest);
	}

	const data = await getDCEntity(dataRequest, clientId);

	const contentValue = data?.link;

	if (contentValue) return contentValue;

	return null;
};

export default getDCContent;
