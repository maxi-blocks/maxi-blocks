import { getProductData } from './getWooCommerceData';
import { getSimpleText, parseText } from './utils';

const getWCContent = async dataRequest => {
	const { field, id, type, delimiterContent } = dataRequest;

	if (type === 'products') {
		const getPrice = (field, data) => {
			const rawPrice = data.prices[field];
			const parsePrice = price => {
				const {
					currency_prefix: currencyPrefix,
					currency_suffix: currencySuffix,
				} = data.prices;

				// TODO: add currency separator
				return `${currencyPrefix}${price}${currencySuffix}`;
			};

			return rawPrice ? parsePrice(rawPrice) : null;
		};

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
				return getPrice(field, data);
			case 'description':
			case 'short_description':
				return getSimpleText(parseText(data[field]));
			case 'tags':
			case 'categories':
				return data[field]
					.map(({ name }) => name)
					.join(`${delimiterContent} `);
			default:
				return null;
		}
	}

	return null;
};

export default getWCContent;
