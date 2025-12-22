import { getProductData } from './getWooCommerceData';
import {
	getSimpleText,
	getTaxonomyContent,
	limitString,
	parseText,
} from './utils';

const getPrice = (rawPrice, data) => {
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

		const priceWithFullLength =
			price.length <= minorUnit ? `0${price}` : price;
		const parsedPrice = `${separateThousands(
			priceWithFullLength.slice(0, -minorUnit)
		)}${decimalSeparator}${priceWithFullLength.slice(-minorUnit)}`;

		return `${currencyPrefix}${parsedPrice}${currencySuffix}`;
	};

	return rawPrice && typeof rawPrice === 'string'
		? parsePrice(rawPrice)
		: null;
};

const getProductsContent = async (dataRequest, entityData, contentType) => {
	if (!entityData) return null;

	const { field, delimiterContent, limit, imageAccumulator, linkTarget } =
		dataRequest;

	const data = await getProductData(entityData.id);

	const taxonomyType = field === 'tags' ? 'product_tag' : 'product_cat';

	switch (field) {
		case 'name':
			return limitString(data[field]?.toString(), limit);
		case 'slug':
		case 'review_count':
		case 'average_rating':
		case 'sku':
			return data[field]?.toString();
		case 'price':
		case 'regular_price':
		case 'sale_price':
			return getPrice(data.prices[field], data.prices);
		case 'price_range':
			if (
				data.prices.price_range &&
				data.prices.price_range.min_amount !==
					data.prices.price_range.max_amount
			) {
				return `${getPrice(
					data.prices.price_range.min_amount,
					data.prices
				)} \u2013 ${getPrice(
					data.prices.price_range.max_amount,
					data.prices
				)}`;
			}

			return getPrice(data.prices.price, data.prices);
		case 'description':
		case 'short_description':
			return limitString(getSimpleText(parseText(data[field])), limit);
		case 'tags':
		case 'categories':
			return getTaxonomyContent(
				entityData[taxonomyType],
				delimiterContent,
				linkTarget === field,
				taxonomyType,
				contentType
			);
		case 'featured_media':
			return entityData[field];
		case 'gallery':
			// First image is featured image, need to skip it.
			return data.images[(imageAccumulator ?? 0) + 1]?.id;
		default:
			return null;
	}
};

const getCartContent = (dataRequest, data) => {
	const { field } = dataRequest;

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
			return getPrice(data.totals[field], data.totals);
		default:
			return null;
	}
};

export { getProductsContent, getCartContent };
