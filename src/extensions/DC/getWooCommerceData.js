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
	if (!indexedProducts) {
		return apiFetch({
			path: `wc/store/v1/products/${productID}`,
			method: 'GET',
		});
	}

	return indexedProducts[productID];
};

// getProducts().then(products => {
// 	console.log(products);
// });

export { getProducts, getProductData };
