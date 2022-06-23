/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * External dependencies
 */
import { isEmpty } from 'lodash';

/**
 * Returns an array of CPT options for a SelectControl
 */
export const getCPTOptions = () => {
	return [{}];
};

/**
 * Returns an array of CT (Custom Taxonomies) options for a SelectControl
 */
export const getCTOptions = () => {
	return [{}];
};

export const typeOptions = [
	{ label: __('Post', 'maxi-blocks'), value: 'posts' },
	{ label: __('Page', 'maxi-blocks'), value: 'pages' },
	// ...getCPTOptions(),
	{ label: __('Site', 'maxi-blocks'), value: 'settings' },
	{ label: __('Media', 'maxi-blocks'), value: 'media' },
	{ label: __('Author', 'maxi-blocks'), value: 'users' },
	// { label: __('Comments', 'maxi-blocks'), value: 'comments' }, ??
	{ label: __('Categories', 'maxi-blocks'), value: 'categories' },
	{ label: __('Tags', 'maxi-blocks'), value: 'tags' },
	// ...getCTOptions(),
];

export const relationOptions = [
	{ label: __('Get by id', 'maxi-blocks'), value: 'by-id' },
	{ label: __('Get last published'), value: 'last-published' },
	{ label: __('Get last published by…'), value: 'last-published-by' },
	{ label: __('Get random'), value: 'random' },
];

export const getByOptions = [
	{ label: __('Date', 'maxi-blocks'), value: 'date' },
	{ label: __('Author', 'maxi-blocks'), value: 'author' },
	{ label: __('Modified', 'maxi-blocks'), value: 'modified' },
	{ label: __('Next', 'maxi-blocks'), value: 'next' },
	{ label: __('Previous', 'maxi-blocks'), value: 'previous' },
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
		// { label: __('Avatar', 'maxi-blocks'), value: 'avatar_urls' }, ??
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
	users: 'name',
	author: 'name',
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
export const relationTypes = ['posts', 'pages', 'media', 'categories', 'tags'];

// Random get-by types
export const randomOptions = [
	'author',
	'date',
	'id',
	'modified',
	'parent',
	'slug',
	'title',
];

// In case content is empty, show this text
export const sanitizeContent = content =>
	content && !isEmpty(content)
		? content
		: __('No content found', 'maxi-blocks');
