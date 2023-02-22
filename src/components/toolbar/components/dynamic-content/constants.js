/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

export const typeOptions = [
	{ label: __('Post', 'maxi-blocks'), value: 'posts' },
	{ label: __('Page', 'maxi-blocks'), value: 'pages' },
	{ label: __('Site', 'maxi-blocks'), value: 'settings' },
	{ label: __('Media', 'maxi-blocks'), value: 'media' },
	{ label: __('Author', 'maxi-blocks'), value: 'users' },
	{ label: __('Categories', 'maxi-blocks'), value: 'categories' },
	{ label: __('Tags', 'maxi-blocks'), value: 'tags' },
];
export const relationOptionsPosts = [
	{ label: __('Get by id', 'maxi-blocks'), value: 'by-id' },
	// { label: __('Get by author', 'maxi-blocks'), value: 'author' }, // TODO: add author support
	{ label: __('Get random'), value: 'random' },
	// { label: __('Date', 'maxi-blocks'), value: 'date' },	// TODO: add date support
	// { label: __('Modified', 'maxi-blocks'), value: 'modified' },	// TODO: add modified support
];
export const relationOptionsUsers = [
	{ label: __('Get by author', 'maxi-blocks'), value: 'author' },
];
export const relationOptionsPages = [
	{ label: __('Get by id', 'maxi-blocks'), value: 'by-id' },
	{ label: __('Get by author', 'maxi-blocks'), value: 'author' },
	{ label: __('Get random'), value: 'random' },
];
export const relationOptionsCategories = [
	{ label: __('Get by id', 'maxi-blocks'), value: 'by-id' },
	{ label: __('Get random'), value: 'random' },
];
export const relationOptionsTags = [
	{ label: __('Get by id', 'maxi-blocks'), value: 'by-id' },
	{ label: __('Get random'), value: 'random' },
];
export const relationOptions = {
	posts: relationOptionsPosts,
	pages: relationOptionsPages,
	settings: relationOptionsPosts,
	media: relationOptionsPosts,
	users: relationOptionsUsers,
	categories: relationOptionsCategories,
	tags: relationOptionsTags,
};

export const getByOptions = [
	{ label: __('Date', 'maxi-blocks'), value: 'date' },
	{ label: __('Author', 'maxi-blocks'), value: 'author' },
	{ label: __('Modified', 'maxi-blocks'), value: 'modified' },
];

export const postsPagesOptions = [
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
];

export const catTagOptions = [
	{ label: __('Name', 'maxi-blocks'), value: 'name' },
	{ label: __('Description', 'maxi-blocks'), value: 'description' },
	{ label: __('Slug', 'maxi-blocks'), value: 'slug' },
	{ label: __('Parent', 'maxi-blocks'), value: 'parent' },
	{ label: __('Count', 'maxi-blocks'), value: 'count' },
	{ label: __('Link', 'maxi-blocks'), value: 'link' },
];

export const fieldOptions = {
	posts: postsPagesOptions,
	pages: postsPagesOptions,
	settings: [
		{ label: __('Title', 'maxi-blocks'), value: 'title' },
		{ label: __('Description', 'maxi-blocks'), value: 'tagline' },
		{ label: __('Site URL', 'maxi-blocks'), value: 'url' },
		{ label: __('Admin email', 'maxi-blocks'), value: 'email' },
		{ label: __('Language', 'maxi-blocks'), value: 'language' },
	],
	media: [
		{ label: __('Title', 'maxi-blocks'), value: 'title' },
		{ label: __('Caption', 'maxi-blocks'), value: 'caption' },
		{ label: __('Description', 'maxi-blocks'), value: 'description' },
		{ label: __('Alt text', 'maxi-blocks'), value: 'alt_text' },
		{ label: __('Link', 'maxi-blocks'), value: 'link' },
		{ label: __('URL', 'maxi-blocks'), value: 'source_url' },
		{ label: __('Mime type', 'maxi-blocks'), value: 'mime_type' },
		{ label: __('Date', 'maxi-blocks'), value: 'date' },
		{ label: __('Author', 'maxi-blocks'), value: 'author' },
	],
	users: [
		{ label: __('Name', 'maxi-blocks'), value: 'name' },
		{ label: __('Description', 'maxi-blocks'), value: 'description' },
		{ label: __('Email', 'maxi-blocks'), value: 'email' },
		{ label: __('Link', 'maxi-blocks'), value: 'link' },
		{ label: __('Website', 'maxi-blocks'), value: 'url' },
	],
	categories: catTagOptions,
	tags: catTagOptions,
};

export const idOptionByField = {
	posts: 'title',
	pages: 'title',
	media: 'title',
	tags: 'name',
	users: 'name',
	author: 'name',
	categories: 'name',
};

// Fields that use id field
export const idFields = [
	'posts',
	'pages',
	'media',
	'users',
	'categories',
	'tags',
	'authors',
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
	// 'users', // TODO: Add support for users
];

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

export const postTypeDic = {
	post: 'posts',
	page: 'pages',
};

export const limitOptions = {
	disableReset: false,
	steps: 1,
	withInputField: false,
	min: 0,
	max: 9999,
	defaultValue: 150,
};
