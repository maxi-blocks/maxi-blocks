import apiFetch from '@wordpress/api-fetch';
import memoize from 'memize';

const API_ENDPOINT = 'wc/store/v1';
let indexedProducts = null;

// Use object destructuring in the function parameter
const indexProducts = (products = []) =>
  products.reduce((acc, { id, ...product }) => ({ ...acc, [id]: product }), {});

const getProducts = memoize(async () => {
  const products = await apiFetch({
    path: `${API_ENDPOINT}/products`,
    method: 'GET',
  });

  indexedProducts = indexProducts(products);

  return products;
});

const getProductData = async productID => {
  if (!productID) return null;

  if (!indexedProducts?.[productID]) {
    try {
      const product = await apiFetch({
        path: `${API_ENDPOINT}/products/${productID}`,
        method: 'GET',
      });

      // Use object spread to simplify the assignment
      indexedProducts = { ...indexedProducts, [productID]: product };
    } catch (error) {
      console.error(`Failed to fetch product with ID ${productID}:`, error);
      return null;
    }
  }

  return indexedProducts[productID];
};

// Use object shorthand for the path and method properties
const getCartData = memoize(() => apiFetch({ path: `${API_ENDPOINT}/cart`, method: 'GET' }));

const getCartUrl = memoize(() => apiFetch({ path: '/maxi-blocks/v1.0/wc/get-cart-url' }));

export { getProducts, getProductData, getCartData, getCartUrl };
