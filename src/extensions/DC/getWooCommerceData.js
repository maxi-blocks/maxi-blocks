import apiFetch from '@wordpress/api-fetch';
import memoize from 'memize';

let indexedProducts = null;

const indexProducts = products => {
	return products.reduce((acc, product) => {
		acc[product.id] = product;
		return acc;
	}, {});
};

const getProducts = memoize(async () => {
	const products = await apiFetch({
		path: '/wc/store/v1/products',
		method: 'GET',
	});

	indexedProducts = indexProducts(products);

	return products;
});

const getProductData = async productID => {
	if (!indexedProducts?.[productID]) {
		const product = await apiFetch({
			path: `wc/store/v1/products/${productID}`,
			method: 'GET',
		});

		indexedProducts = {
			...indexedProducts,
			[productID]: product,
		};
	}

	return indexedProducts[productID];
};

const getCartData = memoize(async () => {
	return apiFetch({
		path: '/wc/store/v1/cart',
		method: 'GET',
	});
});

export { getProducts, getProductData, getCartData };
