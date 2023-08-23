import { getProductData } from './getWooCommerceData';
import { getSimpleText, parseText } from './utils';

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

		const parsedPrice =
			price.length > minorUnit
				? `${separateThousands(
						price.slice(0, -minorUnit)
				  )}${decimalSeparator}${price.slice(-minorUnit)}`
				: price;

		return `${currencyPrefix}${parsedPrice}${currencySuffix}`;
	};

	return rawPrice ? parsePrice(rawPrice) : null;
};

const getWCContent = async (dataRequest, entityData) => {
	const { field, type, delimiterContent } = dataRequest;

	if (type === 'products') {
		const data = await getProductData(entityData.id);

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
				return getSimpleText(parseText(data[field]));
			case 'tags':
			case 'categories':
				return data[field]
					.map(({ name }) => name)
					.join(`${delimiterContent} `);
			case 'image':
				return {
					url: data.images[0].src,
					id: data.images[0].id,
				};
			default:
				return null;
		}
	}

	if (type === 'cart') {
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
				return getPrice(field, entityData.totals);
			default:
				return null;
		}
	}

	return null;
};

export default getWCContent;
