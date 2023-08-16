import { getCartData, getProductData } from './getWooCommerceData';
import { getSimpleText, parseText } from './utils';

const getPrice = (field, data) => {
	const rawPrice = data[field];
	const parsePrice = price => {
		const {
			currency_prefix: currencyPrefix,
			currency_suffix: currencySuffix,
			currency_minor_unit: currencyMinorUnit,
		} = data;

		// TODO: add thousand and decimal separators
		return `${currencyPrefix}${price}${currencySuffix}`;
	};

	return rawPrice ? parsePrice(rawPrice) : null;
};

const getWCContent = async dataRequest => {
	const { field, id, type, delimiterContent } = dataRequest;

	if (type === 'products') {
		const data = await getProductData(id);

		switch (field) {
			case 'name':
			case 'slug':
			case 'review_count':
			case 'average_rating':
				return data[field];
			case 'price':
			case 'regular_price':
			case 'sale_price':
				return getPrice(field, data.prices);
			case 'description':
			case 'short_description':
				return getSimpleText(parseText(data[field]));
			case 'tags':
			case 'categories':
				return data[field]
					.map(({ name }) => name)
					.join(`${delimiterContent} `);
			case 'image':
			case 'featured_media':
				// TODO: add image index option
				return {
					url: data.images[0].src,
					id: data.images[0].id,
				};
			default:
				return null;
		}
	}

	if (type === 'cart') {
		const data = await getCartData();

		switch (field) {
			case 'total_price':
			case 'total_tax':
			case 'total_shipping':
			case 'total_shipping_tax':
			case 'total_discount':
			case 'total_items':
			case 'total_items_tax':
			case 'total_fees':
			case 'total_fees_tax':
				return getPrice(field, data.totals);
			default:
				return null;
		}
	}

	return null;
};

export default getWCContent;
