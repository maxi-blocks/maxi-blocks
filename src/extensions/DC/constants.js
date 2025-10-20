/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

// Post types to show in "Standard types" section
export const supportedPostTypes = ['post', 'page', 'attachment', 'product'];

// Post types to hide
export const ignoredPostTypes = [
	'nav_menu_item',
	'wp_block',
	'wp_template',
	'wp_template_part',
	'wp_navigation',
];

// Taxonomies to show in "Standard types" section
export const supportedTaxonomies = [
	'category',
	'post_tag',
	'product_cat',
	'product_tag',
];

// Taxonomies to hide
export const ignoredTaxonomies = [
	'nav_menu',
	'link_category',
	'post_format',
	'product_shipping_class',
	'wp_pattern_category',
	'maxi-image-type',
];

/**
 * Relation constants
 */
const generalRelationOptionsPosts = [
	{ label: __('Get by id', 'maxi-blocks'), value: 'by-id' },
	{ label: __('Get random'), value: 'random' },
	{ label: __('Get by date'), value: 'by-date' },
	{ label: __('Get alphabetical'), value: 'alphabetical' },
	{ label: __('Get by author'), value: 'by-author' },
	{ label: __('Get by category'), value: 'by-category' },
	{ label: __('Get by tag', 'maxi-blocks'), value: 'by-tag' },
	// { label: __('Date', 'maxi-blocks'), value: 'date' },	// TODO: add date support
	// { label: __('Modified', 'maxi-blocks'), value: 'modified' },	// TODO: add modified support
];

const generalRelationOptionsPages = [
	{ label: __('Get by id', 'maxi-blocks'), value: 'by-id' },
	{ label: __('Get random', 'maxi-blocks'), value: 'random' },
	{ label: __('Get by date', 'maxi-blocks'), value: 'by-date' },
	{ label: __('Get alphabetical', 'maxi-blocks'), value: 'alphabetical' },
	{ label: __('Get by author', 'maxi-blocks'), value: 'by-author' },
];

const generalRelationOptionsUsers = [
	{ label: __('Get by date', 'maxi-blocks'), value: 'by-date' },
	{ label: __('Get by id', 'maxi-blocks'), value: 'by-id' },
	{ label: __('Get random', 'maxi-blocks'), value: 'random' },
	{ label: __('Get alphabetical', 'maxi-blocks'), value: 'alphabetical' },
];

const generalRelationOptionsCategories = [
	{ label: __('Get by id', 'maxi-blocks'), value: 'by-id' },
	{ label: __('Get random', 'maxi-blocks'), value: 'random' },
];

const generalRelationOptionsTags = [
	{ label: __('Get by id', 'maxi-blocks'), value: 'by-id' },
	{ label: __('Get random', 'maxi-blocks'), value: 'random' },
];

const generalRelationOptionsProducts = generalRelationOptionsPosts.filter(
	({ value }) => !['current', 'by-author'].includes(value)
);

// Relation options available for all post types
export const postTypeRelationOptions = [
	{ label: __('Get by id', 'maxi-blocks'), value: 'by-id' },
	{ label: __('Get random', 'maxi-blocks'), value: 'random' },
	{ label: __('Get by date', 'maxi-blocks'), value: 'by-date' },
];

// Relation options available for all taxonomies
export const taxonomyRelationOptions = [
	{ label: __('Get by id', 'maxi-blocks'), value: 'by-id' },
	{ label: __('Get random', 'maxi-blocks'), value: 'random' },
];

const generalRelationOptions = {
	posts: generalRelationOptionsPosts,
	pages: generalRelationOptionsPages,
	settings: generalRelationOptionsPosts,
	media: generalRelationOptionsPages,
	users: generalRelationOptionsUsers,
	categories: generalRelationOptionsCategories,
	tags: generalRelationOptionsTags,
	products: generalRelationOptionsProducts,
	cart: generalRelationOptionsPosts,
	product_categories: generalRelationOptionsCategories,
	product_tags: generalRelationOptionsTags,
};

export const relationOptions = {
	text: generalRelationOptions,
	button: generalRelationOptions,
	image: generalRelationOptions,
	container: generalRelationOptions,
	row: generalRelationOptions,
	column: generalRelationOptions,
	group: generalRelationOptions,
	pane: generalRelationOptions,
	slide: generalRelationOptions,
	accordion: generalRelationOptions,
	slider: generalRelationOptions,
	divider: generalRelationOptions,
};

/**
 * Field constants
 */
const generalPostsPagesFields = [
	{
		label: __('Title', 'maxi-blocks'),
		value: 'title',
	},
	{
		label: __('Content', 'maxi-blocks'),
		value: 'content',
	},
	{
		label: __('Excerpt', 'maxi-blocks'),
		value: 'excerpt',
	},
	{ label: __('Date', 'maxi-blocks'), value: 'date' },
	{ label: __('Author', 'maxi-blocks'), value: 'author' },
	{ label: __('Static text', 'maxi-blocks'), value: 'static_text' },
	// TODO: add URL
];

const generalPostsFields = [
	...generalPostsPagesFields,
	{ label: __('Categories', 'maxi-blocks'), value: 'categories' },
	{ label: __('Tags', 'maxi-blocks'), value: 'tags' },
];

const generalSettingsFields = [
	{ label: __('Title', 'maxi-blocks'), value: 'title' },
	{ label: __('Description', 'maxi-blocks'), value: 'tagline' },
	{ label: __('Site URL', 'maxi-blocks'), value: 'url' },
	{ label: __('Admin email', 'maxi-blocks'), value: 'email' },
	{ label: __('Language', 'maxi-blocks'), value: 'language' },
];

const generalMediaFields = [
	{ label: __('Title', 'maxi-blocks'), value: 'title' },
	{ label: __('Caption', 'maxi-blocks'), value: 'caption' },
	{ label: __('Description', 'maxi-blocks'), value: 'description' },
	{ label: __('Alt text', 'maxi-blocks'), value: 'alt_text' },
	{ label: __('Link', 'maxi-blocks'), value: 'link' },
	{ label: __('URL', 'maxi-blocks'), value: 'source_url' },
	{ label: __('Mime type', 'maxi-blocks'), value: 'mime_type' },
	{ label: __('Date', 'maxi-blocks'), value: 'date' },
	{ label: __('Author', 'maxi-blocks'), value: 'author' },
];

const generalUsersFields = [
	{ label: __('Name', 'maxi-blocks'), value: 'name' },
	{ label: __('Username', 'maxi-blocks'), value: 'username' },
	{ label: __('First name', 'maxi-blocks'), value: 'first_name' },
	{ label: __('Last name', 'maxi-blocks'), value: 'last_name' },
	{ label: __('Nickname', 'maxi-blocks'), value: 'nickname' },
	{ label: __('Biographical info', 'maxi-blocks'), value: 'description' },
	{ label: __('Email', 'maxi-blocks'), value: 'email' },
	{ label: __('Link', 'maxi-blocks'), value: 'link' },
	{ label: __('Website', 'maxi-blocks'), value: 'url' },
	{ label: __('Static text', 'maxi-blocks'), value: 'static_text' },
];

const generalCategoryFields = [
	{ label: __('Name', 'maxi-blocks'), value: 'name' },
	{ label: __('Description', 'maxi-blocks'), value: 'description' },
	{ label: __('Slug', 'maxi-blocks'), value: 'slug' },
	{ label: __('Parent', 'maxi-blocks'), value: 'parent' },
	{ label: __('Count', 'maxi-blocks'), value: 'count' },
	{ label: __('Link', 'maxi-blocks'), value: 'link' },
];

const generalTagFields = generalCategoryFields.filter(
	option => option.value !== 'parent'
);

const buttonPostsPagesFields = [
	...generalPostsPagesFields.filter(option =>
		['title', 'author'].includes(option.value)
	),
	{ label: __('Static text', 'maxi-blocks'), value: 'static_text' },
];

const buttonSettingsFields = [
	...generalSettingsFields.filter(option =>
		['title', 'tagline', 'email'].includes(option.value)
	),
	{ label: __('Static text', 'maxi-blocks'), value: 'static_text' },
];

const buttonMediaFields = [
	...generalMediaFields.filter(option =>
		['title', 'tagline', 'email'].includes(option.value)
	),
	{ label: __('Static text', 'maxi-blocks'), value: 'static_text' },
];

const buttonAuthorFields = generalUsersFields;

const buttonCategoryFields = [
	...generalCategoryFields.filter(option =>
		['title', 'tagline', 'email'].includes(option.value)
	),
	{ label: __('Static text', 'maxi-blocks'), value: 'static_text' },
];

const buttonTagFields = [
	...generalTagFields.filter(option =>
		['title', 'tagline', 'email'].includes(option.value)
	),
	{ label: __('Static text', 'maxi-blocks'), value: 'static_text' },
];

const mediaPostsPagesFields = [
	{ label: __('Featured media', 'maxi-blocks'), value: 'featured_media' },
	{ label: __("Author's avatar", 'maxi-blocks'), value: 'author_avatar' },
];

const mediaSettingsFields = [
	{ label: __('Logo', 'maxi-blocks'), value: 'site_logo' },
];

const mediaMediaFields = [{ label: __('Image', 'maxi-blocks'), value: 'id' }];

const mediaAuthorFields = [
	{ label: __('Avatar', 'maxi-blocks'), value: 'avatar' },
];

const textACFFieldTypes = [
	'text',
	'textarea',
	'number',
	'email',
	'url',
	'password',
	'range',
	'date_picker',
	'date_time_picker',
	'time_picker',
	'select',
	'radio',
	'checkbox',
	'button_group',
];

const mediaACFFieldTypes = ['image'];

const buttonACFFieldTypes = textACFFieldTypes;

const generalProductFields = [
	{ label: __('Name', 'maxi-blocks'), value: 'name' },
	{ label: __('Description', 'maxi-blocks'), value: 'description' },
	{
		label: __('Short description', 'maxi-blocks'),
		value: 'short_description',
	},
	{ label: __('Slug', 'maxi-blocks'), value: 'slug' },
	{ label: __('SKU', 'maxi-blocks'), value: 'sku' },
	{ label: __('Review count', 'maxi-blocks'), value: 'review_count' },
	{ label: __('Average rating', 'maxi-blocks'), value: 'average_rating' },
	{ label: __('Price', 'maxi-blocks'), value: 'price' },
	{ label: __('Regular price', 'maxi-blocks'), value: 'regular_price' },
	{ label: __('Sale price', 'maxi-blocks'), value: 'sale_price' },
	{ label: __('Price range', 'maxi-blocks'), value: 'price_range' },
	{ label: __('Categories', 'maxi-blocks'), value: 'categories' },
	{ label: __('Tags', 'maxi-blocks'), value: 'tags' },
];

const buttonProductFields = [
	...generalProductFields.filter(
		option =>
			![
				'short_description',
				'description',
				'categories',
				'tags',
			].includes(option.value)
	),
	{ label: __('Static text', 'maxi-blocks'), value: 'static_text' },
];

const imageProductFields = [
	{ label: __('Featured image', 'maxi-blocks'), value: 'featured_media' },
	{ label: __('Gallery image', 'maxi-blocks'), value: 'gallery' },
];

const generalCartFields = [
	{ label: __('Total price', 'maxi-blocks'), value: 'total_price' },
	{ label: __('Total tax', 'maxi-blocks'), value: 'total_tax' },
	{ label: __('Total shipping', 'maxi-blocks'), value: 'total_shipping' },
	{
		label: __('Total shipping tax', 'maxi-blocks'),
		value: 'total_shipping_tax',
	},
	{ label: __('Total discount', 'maxi-blocks'), value: 'total_discount' },
	{ label: __('Total items', 'maxi-blocks'), value: 'total_items' },
	{
		label: __('Total items tax', 'maxi-blocks'),
		value: 'total_items_tax',
	},
	{ label: __('Total fees', 'maxi-blocks'), value: 'total_fees' },
	{ label: __('Total fees tax', 'maxi-blocks'), value: 'total_fees_tax' },
];

const buttonCartFields = [
	...generalCartFields,
	{ label: __('Static text', 'maxi-blocks'), value: 'static_text' },
];

const dividerFields = [
	{ label: __('Static', 'maxi-blocks'), value: 'static_text' },
];

export const fieldOptions = {
	text: {
		posts: generalPostsFields,
		pages: generalPostsPagesFields,
		settings: generalSettingsFields,
		media: generalMediaFields,
		users: generalUsersFields,
		categories: generalCategoryFields,
		tags: generalTagFields,
		products: generalProductFields,
		cart: generalCartFields,
		product_categories: generalCategoryFields,
		product_tags: generalTagFields,
	},
	button: {
		posts: buttonPostsPagesFields,
		pages: buttonPostsPagesFields,
		settings: buttonSettingsFields,
		media: buttonMediaFields,
		users: buttonAuthorFields,
		categories: buttonCategoryFields,
		tags: buttonTagFields,
		products: buttonProductFields,
		cart: buttonCartFields,
		product_categories: buttonCategoryFields,
		product_tags: buttonTagFields,
	},
	image: {
		posts: mediaPostsPagesFields,
		pages: mediaPostsPagesFields,
		settings: mediaSettingsFields,
		media: mediaMediaFields,
		users: mediaAuthorFields,
		products: imageProductFields,
	},
	divider: {
		posts: dividerFields,
		pages: dividerFields,
		settings: dividerFields,
		media: dividerFields,
		users: dividerFields,
		categories: dividerFields,
		tags: dividerFields,
		products: dividerFields,
		cart: dividerFields,
		product_categories: dividerFields,
		product_tags: dividerFields,
	},
};

export const acfFieldTypes = {
	text: textACFFieldTypes,
	button: buttonACFFieldTypes,
	image: mediaACFFieldTypes,
};

export const mediaFieldOptions = Object.values(fieldOptions.image).map(
	type => type.map(option => option.value)[0]
);

// Fields that contain HTML that needs to be rendered in their content
export const htmlFields = ['tags', 'categories'];

/**
 * Link constants
 */
export const multipleLinksTypes = ['products', 'users'];

export const linkTypesOptions = {
	products: [
		{ label: __('Add to cart', 'maxi-blocks'), value: 'add_to_cart' },
	],
	users: [
		{ label: __('Author email', 'maxi-blocks'), value: 'author_email' },
		{ label: __('Author site', 'maxi-blocks'), value: 'author_site' },
	],
};

// Fields that can have their own links
export const linkFields = ['categories', 'tags', 'author', 'author_avatar'];
export const inlineLinkFields = ['categories', 'tags'];

export const linkFieldsOptions = {
	categories: [
		{
			label: __('Categories links', 'maxi-blocks'),
			value: 'categories',
		},
	],
	tags: [
		{
			label: __('Tags links', 'maxi-blocks'),
			value: 'tags',
		},
	],
	author: [
		{
			label: __('Author profile page', 'maxi-blocks'),
			value: 'author',
		},
		{ label: __('Author email', 'maxi-blocks'), value: 'author_email' },
		{ label: __('Author site', 'maxi-blocks'), value: 'author_site' },
	],
	author_avatar: [
		{
			label: __('Author profile page', 'maxi-blocks'),
			value: 'author',
		},
		{ label: __('Author email', 'maxi-blocks'), value: 'author_email' },
		{ label: __('Author site', 'maxi-blocks'), value: 'author_site' },
	],
};

/**
 * Option constants
 */
// Random get-by types
export const postsRandomOptions = [
	'author',
	'date',
	'id',
	'modified',
	'parent',
	'slug',
	'include_slugs',
	'title',
];

export const pagesRandomOptions = [
	'author',
	'date',
	'id',
	'modified',
	'parent',
	'slug',
	'include_slugs',
	'title',
];

export const mediaRandomOptions = [
	'author',
	'date',
	'id',
	'modified',
	'parent',
	'slug',
	'include_slugs',
	'title',
];

export const usersRandomOptions = [
	'id',
	'include',
	'name',
	'registered_date',
	'slug',
	'include_slugs',
	'email',
	'url',
];

export const categoriesRandomOptions = [
	'id',
	'include',
	'name',
	'slug',
	'include_slugs',
	'term_group',
	'description',
	'count',
];

export const tagsRandomOptions = [
	'id',
	'include',
	'name',
	'slug',
	'include_slugs',
	'term_group',
	'description',
	'count',
];

export const randomOptions = {
	posts: postsRandomOptions,
	pages: pagesRandomOptions,
	settings: [],
	media: mediaRandomOptions,
	users: usersRandomOptions,
	categories: categoriesRandomOptions,
	tags: tagsRandomOptions,
};

/**
 * Other constants
 */
export const idOptionByField = {
	posts: 'title',
	pages: 'title',
	media: 'title',
	products: 'title',
	tags: 'name',
	users: 'name',
	author: 'name',
	categories: 'name',
	product_categories: 'name',
	product_tags: 'name',
};

// Fields that use id field
export const idTypes = [
	'posts',
	'pages',
	'media',
	'users',
	'categories',
	'tags',
	'authors',
	'products',
	'product_categories',
	'product_tags',
	'archive',
];

// Fields that have rendered and raw content
export const renderedFields = [
	'title',
	'content',
	'excerpt',
	'caption',
	'description',
];

// Types that accept relations
export const relationTypes = [
	'posts',
	'pages',
	'media',
	'categories',
	'tags',
	'users', // TODO: Add support for users
	'products',
	'product_categories',
	'product_tags',
];

// Types that can have relation "current".
export const currentEntityTypes = ['posts', 'pages', 'users'];

export const ignoreEmptyFields = ['avatar', 'author_avatar'];

export const descriptionOfErrors = {
	next: __(
		'Sorry, there is no next post, please choose something else.',
		'maxi-blocks'
	),
	previous: __(
		'Sorry, there is no previous post, please choose something else.',
		'maxi-blocks'
	),
	object: __('Value is not an object.', 'maxi-blocks'),
	author: __(
		'Sorry, this author has no posts yet, please choose something else.',
		'maxi-blocks'
	),
	media: __(
		'Sorry, you do not have any images yet, please choose something else.',
		'maxi-blocks'
	),
	tags: __(
		'Sorry, you do not have any tags yet, please choose something else.',
		'maxi-blocks'
	),
};

export const limitTypes = [
	'posts',
	'pages',
	'tags',
	'categories',
	'products',
	'product_categories',
	'product_tags',
	'users',
	'media',
	'settings',
	'archive',
];

export const limitFields = [
	'excerpt',
	'content',
	'description',
	'short_description',
	'title',
	'tagline',
	'caption',
	'alt_text',
	'name',
];

export const limitOptions = {
	disableReset: false,
	steps: 1,
	withInputField: false,
	min: 0,
	max: 9999,
};

export const orderByRelations = [
	'by-category',
	'by-author',
	'by-tag',
	'current-archive',
];

export const orderRelations = ['by-date', 'alphabetical', ...orderByRelations];

export const orderByOptions = [
	{ label: __('By date', 'maxi-blocks'), value: 'by-date' },
	{ label: __('Alphabetical', 'maxi-blocks'), value: 'alphabetical' },
];

export const orderTypes = ['posts', 'pages', 'media', 'users', 'products'];

export const orderOptions = {
	'by-date': [
		{ label: __('New/old', 'maxi-blocks'), value: 'desc' },
		{ label: __('Old/new', 'maxi-blocks'), value: 'asc' },
	],
	alphabetical: [
		{ label: __('A/Z', 'maxi-blocks'), value: 'asc' },
		{ label: __('Z/A', 'maxi-blocks'), value: 'desc' },
	],
};

export const limitByArchiveOptions = [
	{ label: __('No', 'maxi-blocks'), value: 'no' },
	{ label: __('Yes', 'maxi-blocks'), value: 'yes' },
];

export const kindDictionary = {
	posts: 'postType',
	pages: 'postType',
	media: 'postType',
	settings: 'root',
	categories: 'taxonomy',
	tags: 'taxonomy',
	products: 'postType',
	product_categories: 'taxonomy',
	product_tags: 'taxonomy',
	archive: 'taxonomy',
};
export const nameDictionary = {
	posts: 'post',
	pages: 'page',
	media: 'attachment',
	settings: '__unstableBase',
	categories: 'category',
	tags: 'post_tag',
	products: 'product',
	product_categories: 'product_cat',
	product_tags: 'product_tag',
	archive: 'category',
};

export const relationDictionary = {
	'by-category': {
		default: 'categories',
		products: 'product_cat',
	},
	'by-author': {
		default: 'author',
	},
	'by-tag': {
		default: 'tags',
		products: 'product_tag',
	},
};

export const attributeDefaults = {
	status: false,
	source: 'wp',
	type: 'posts',
	relation: 'by-id',
	'order-by': 'by-date',
	order: attributes => {
		const dictionary = {
			'by-date': 'desc',
			alphabetical: 'asc',
		};

		const relation = attributes?.relation ?? attributes?.['cl-relation'];
		if (orderByRelations.includes(relation)) {
			return dictionary[attributes?.orderBy];
		}

		return dictionary[relation];
	},
	accumulator: 0,
	'limit-by-archive': null,
};
