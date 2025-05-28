import { __ } from '@wordpress/i18n';

/**
 * Source constants
 */
export const sourceOptions = [
	{
		label: __('WordPress', 'maxi-blocks'),
		value: 'wp',
	},
];

/**
 * Type constants
 */
export const generalTypeOptions = [
	{ label: __('Post', 'maxi-blocks'), value: 'posts' },
	{ label: __('Page', 'maxi-blocks'), value: 'pages' },
	{ label: __('Site', 'maxi-blocks'), value: 'settings' },
	{ label: __('Media', 'maxi-blocks'), value: 'media' },
	{ label: __('Author', 'maxi-blocks'), value: 'users' },
	{ label: __('Categories', 'maxi-blocks'), value: 'categories' },
	{ label: __('Tags', 'maxi-blocks'), value: 'tags' },
];

export const imageTypeOptions = generalTypeOptions.filter(
	option => !['categories', 'tags'].includes(option.value)
);

export const ACFTypeOptions = generalTypeOptions.filter(
	option => !['settings'].includes(option.value)
);

export const WCTypeOptions = [
	{ label: __('Product', 'maxi-blocks'), value: 'products' },
	{ label: __('Cart', 'maxi-blocks'), value: 'cart' },
	{
		label: __('Product categories', 'maxi-blocks'),
		value: 'product_categories',
	},
	{ label: __('Product tags', 'maxi-blocks'), value: 'product_tags' },
];
