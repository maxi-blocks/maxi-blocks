import { getCartData, getProductData } from './getWooCommerceData';
import {
	getSimpleText,
	getTaxonomyContent,
	limitString,
	parseText,
} from './utils';

const getPrice = (field, data) => {
	const rawPrice = data[field];
	const parsePrice = price => {
		const {
			currency_prefix: currencyPrefix,
			currency_suffix: currencySuffix,
			currency_minor_unit: minorUnit,
			currency_decimal_separator: decimalSeparator,
			currency_thousand_separator: thousandSeparator,
		} = data;

		// https://stackoverflow.com/a/2901298
		const separateThousands = price =>
			price.replace(/\B(?=(\d{3})+(?!\d))/g, thousandSeparator);

		return `${currencyPrefix}${separateThousands(
			price.slice(0, -minorUnit)
		)}${decimalSeparator}${price.slice(-minorUnit)}${currencySuffix}`;
	};

	return rawPrice ? parsePrice(rawPrice) : null;
};

const getWCContent = async (dataRequest, entityData) => {
	const {
		field,
		type,
		delimiterContent,
		postTaxonomyLinksStatus,
		taxonomyType,
		limit,
		id,
	} = dataRequest;

	if (type === 'products') {
		const data = await getProductData(id);

		switch (field) {
			case 'name':
			case 'slug':
			case 'review_count':
			case 'average_rating':
			case 'sku':
				return data[field];
			case 'price':
			case 'regular_price':
			case 'sale_price':
				return getPrice(field, data.prices);
			case 'description':
			case 'short_description':
				return limitString(
					getSimpleText(parseText(data[field])),
					limit
				);
			case 'tags':
			case 'categories':
				return getTaxonomyContent(
					entityData[taxonomyType],
					delimiterContent,
					postTaxonomyLinksStatus,
					taxonomyType
				);
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
