/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * External dependencies
 */
import { isEmpty } from 'lodash';
import moment from 'moment';

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

// if case if the REST API is on /index.php?rest_route=
// we need to use & for the parameters
export const getParametersFirstSeparator = url => {
	if (url.includes('?')) return '&';
	return '?';
};

export const processDate = (
	dateValue,
	isCustomDate,
	format,
	locale,
	options
) => {
	const NewDate = new Date(dateValue);
	let content;
	let newFormat;
	if (!isCustomDate) {
		newFormat = format
			.replace(/DV/g, 'x')
			.replace(/DS/g, 'z')
			.replace(/MS/g, 'c');
		const map = {
			z: 'ddd',
			x: 'dd',
			c: 'MMM',
			d: 'D',
			D: 'dddd',
			m: 'MM',
			M: 'MMMM',
			y: 'YY',
			Y: 'YYYY',
			t: 'HH:MM:SS',
		};
		newFormat = newFormat.replace(/[xzcdDmMyYt]/g, m => map[m]);
		content = moment(NewDate).format(newFormat);
	} else {
		content = NewDate.toLocaleString(locale, options);
	}
	return content;
};

export const cutTags = str => {
	const regex = /( |<([^>]+)>)/gi;
	const result = str.replace(regex, ' ');

	return result;
};

export const limitFormat = (value, limit) => {
	const str = cutTags(value).trim();
	return str.length > limit && limit !== 0
		? `${str.substr(0, limit).trim()}...`
		: limit !== 0
		? str
		: value;
};

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
	{ label: __('Get by author', 'maxi-blocks'), value: 'author' },
	{ label: __('Get random'), value: 'random' },
	{ label: __('Date', 'maxi-blocks'), value: 'date' },
	{ label: __('Modified', 'maxi-blocks'), value: 'modified' },
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

export const showOptions = [
	{ label: __('Current', 'maxi-blocks'), value: 'current' },
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
	'users',
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

// In case content is empty, show this text
export const sanitizeContent = content =>
	!isEmpty(content) || typeof content === 'number'
		? __(content, 'maxi-blocks')
		: __('No content found', 'maxi-blocks');

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

export const LimitOptions = {
	disableReset: false,
	steps: 1,
	withInputField: false,
	min: 0,
	max: 999,
};
