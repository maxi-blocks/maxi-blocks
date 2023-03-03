/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Type constants
 */
export const generalTypeOptions = [
	{ label: __('Post', 'maxi-blocks'), value: 'posts' },
	{ label: __('Page', 'maxi-blocks'), value: 'pages' },
	{ label: __('Site', 'maxi-blocks'), value: 'settings' },
	{ label: __('Media', 'maxi-blocks'), value: 'media' },
	{ label: __('Author', 'maxi-blocks'), value: 'users' }, // TODO: add author support
	{ label: __('Categories', 'maxi-blocks'), value: 'categories' },
	{ label: __('Tags', 'maxi-blocks'), value: 'tags' },
];

export const typeOptions = {
	text: generalTypeOptions,
	button: generalTypeOptions,
	image: generalTypeOptions.filter(
		option => !['categories', 'tags'].includes(option.value)
	),
};

/**
 * Relation constants
 */
const generalRelationOptionsPosts = [
	{ label: __('Get by id', 'maxi-blocks'), value: 'by-id' },
	// { label: __('Get by author', 'maxi-blocks'), value: 'author' }, // TODO: add author support
	{ label: __('Get random'), value: 'random' },
	// { label: __('Date', 'maxi-blocks'), value: 'date' },	// TODO: add date support
	// { label: __('Modified', 'maxi-blocks'), value: 'modified' },	// TODO: add modified support
];

const generalRelationOptionsPages = [
	{ label: __('Get by id', 'maxi-blocks'), value: 'by-id' },
	// { label: __('Get by author', 'maxi-blocks'), value: 'author' }, // TODO: add author support
	{ label: __('Get random'), value: 'random' },
];

const generalRelationOptionsCategories = [
	{ label: __('Get by id', 'maxi-blocks'), value: 'by-id' },
	{ label: __('Get random'), value: 'random' },
];

const generalRelationOptionsTags = [
	{ label: __('Get by id', 'maxi-blocks'), value: 'by-id' },
	{ label: __('Get random'), value: 'random' },
];

const generalRelationOptions = {
	posts: generalRelationOptionsPosts,
	pages: generalRelationOptionsPages,
	settings: generalRelationOptionsPosts,
	media: generalRelationOptionsPosts,
	categories: generalRelationOptionsCategories,
	tags: generalRelationOptionsTags,
};

export const relationOptions = {
	text: generalRelationOptions,
	button: generalRelationOptions,
	image: generalRelationOptions,
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
	// TODO: add URL
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
	{ label: __('Description', 'maxi-blocks'), value: 'description' },
	{ label: __('Email', 'maxi-blocks'), value: 'email' },
	{ label: __('Link', 'maxi-blocks'), value: 'link' },
	{ label: __('Website', 'maxi-blocks'), value: 'url' },
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

const buttonPostsPagesFields = generalPostsPagesFields.filter(option =>
	['title', 'author'].includes(option.value)
);

const buttonSettingsFields = generalSettingsFields.filter(option =>
	['title', 'tagline', 'email'].includes(option.value)
);

const buttonMediaFields = generalMediaFields.filter(option =>
	['title', 'author'].includes(option.value)
);

const buttonAuthorFields = generalUsersFields.filter(option =>
	['name', 'email', 'url'].includes(option.value)
);

const buttonCategoryFields = generalCategoryFields.filter(option =>
	['name', 'slug', 'parent'].includes(option.value)
);

const buttonTagFields = generalTagFields.filter(option =>
	['name', 'slug'].includes(option.value)
);

const mediaPostsPagesFields = [
	{ label: __('Featured media', 'maxi-blocks'), value: 'featured_media' },
];

const mediaSettingsFields = [
	{ label: __('Logo', 'maxi-blocks'), value: 'site_logo' },
];

const mediaMediaFields = [{ label: __('Image', 'maxi-blocks'), value: 'id' }];

const mediaAuthorFields = [
	{ label: __('Avatar', 'maxi-blocks'), value: 'avatar' },
];

export const fieldOptions = {
	text: {
		posts: generalPostsPagesFields,
		pages: generalPostsPagesFields,
		settings: generalSettingsFields,
		media: generalMediaFields,
		users: generalUsersFields,
		categories: generalCategoryFields,
		tags: generalTagFields,
	},
	button: {
		posts: buttonPostsPagesFields,
		pages: buttonPostsPagesFields,
		settings: buttonSettingsFields,
		media: buttonMediaFields,
		users: buttonAuthorFields,
		categories: buttonCategoryFields,
		tags: buttonTagFields,
	},
	image: {
		posts: mediaPostsPagesFields,
		pages: mediaPostsPagesFields,
		settings: mediaSettingsFields,
		media: mediaMediaFields,
		users: mediaAuthorFields,
	},
};

export const mediaFieldOptions = Object.values(fieldOptions.image).map(
	type => type.map(option => option.value)[0]
);

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
	'users', // TODO: Add support for users
];

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

export const limitTypes = ['posts', 'pages', 'tags', 'categories'];

export const limitFields = ['excerpt', 'content', 'description'];

export const limitOptions = {
	disableReset: false,
	steps: 1,
	withInputField: false,
	min: 0,
	max: 9999,
};
