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
	//'include',
	'modified',
	'parent',
	//'relevance',
	'slug',
	'include_slugs',
	'title',
];
export const pagesRandomOptions = [
	'author',
	'date',
	'id',
	//'include',
	'modified',
	'parent',
	//'relevance',
	'slug',
	'include_slugs',
	'title',
	//'menu_order',
];
export const mediaRandomOptions = [
	'author',
	'date',
	'id',
	//'include',
	'modified',
	'parent',
	//'relevance',
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
	content && !isEmpty(content)
		? content
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

/*export const dateZone = [
	{
		label: __('af-ZA', 'maxi-blocks'),
		value: 'af-ZA',
	},
	{
		label: __('am-ET', 'maxi-blocks'),
		value: 'am-ET',
	},
	{
		label: __('ar-AE', 'maxi-blocks'),
		value: 'ar-AE',
	},
	{
		label: __('ar-BH', 'maxi-blocks'),
		value: 'ar-BH',
	},
	{
		label: __('ar-DZ', 'maxi-blocks'),
		value: 'ar-DZ',
	},
	{
		label: __('ar-EG', 'maxi-blocks'),
		value: 'ar-EG',
	},
	{
		label: __('ar-IQ', 'maxi-blocks'),
		value: 'ar-IQ',
	},
	{
		label: __('ar-JO', 'maxi-blocks'),
		value: 'ar-JO',
	},
	{
		label: __('ar-KW', 'maxi-blocks'),
		value: 'ar-KW',
	},
	{
		label: __('ar-LB', 'maxi-blocks'),
		value: 'ar-LB',
	},
	{
		label: __('ar-LY', 'maxi-blocks'),
		value: 'ar-LY',
	},
	{
		label: __('ar-MA', 'maxi-blocks'),
		value: 'ar-MA',
	},
];
*/
/*
arn-CL
ar-OM
ar-QA
ar-SA
ar-SD
ar-SY
ar-TN
ar-YE
as-IN
az-az
az-Cyrl-AZ
az-Latn-AZ
ba-RU
be-BY
bg-BG
bn-BD
bn-IN
bo-CN
br-FR
bs-Cyrl-BA
bs-Latn-BA
ca-ES
co-FR
cs-CZ
cy-GB
da-DK
de-AT
de-CH
de-DE
de-LI
de-LU
dsb-DE
dv-MV
el-CY
el-GR
en-029
en-AU
en-BZ
en-CA
en-cb
en-GB
en-IE
en-IN
en-JM
en-MT
en-MY
en-NZ
en-PH
en-SG
en-TT
en-US
en-ZA
en-ZW
es-AR
es-BO
es-CL
es-CO
es-CR
es-DO
es-EC
es-ES
es-GT
es-HN
es-MX
es-NI
es-PA
es-PE
es-PR
es-PY
es-SV
es-US
es-UY
es-VE
et-EE
eu-ES
fa-IR
fi-FI
fil-PH
fo-FO
fr-BE
fr-CA
fr-CH
fr-FR
fr-LU
fr-MC
fy-NL
ga-IE
gd-GB
gd-ie
gl-ES
gsw-FR
gu-IN
ha-Latn-NG
he-IL
hi-IN
hr-BA
hr-HR
hsb-DE
hu-HU
hy-AM
id-ID
ig-NG
ii-CN
in-ID
is-IS
it-CH
it-IT
iu-Cans-CA
iu-Latn-CA
iw-IL
ja-JP
ka-GE
kk-KZ
kl-GL
km-KH
kn-IN
kok-IN
ko-KR
ky-KG
lb-LU
lo-LA
lt-LT
lv-LV
mi-NZ
mk-MK
ml-IN
mn-MN
mn-Mong-CN
moh-CA
mr-IN
ms-BN
ms-MY
mt-MT
nb-NO
ne-NP
nl-BE
nl-NL
nn-NO
no-no
nso-ZA
oc-FR
or-IN
pa-IN
pl-PL
prs-AF
ps-AF
pt-BR
pt-PT
qut-GT
quz-BO
quz-EC
quz-PE
rm-CH
ro-mo
ro-RO
ru-mo
ru-RU
rw-RW
sah-RU
sa-IN
se-FI
se-NO
se-SE
si-LK
sk-SK
sl-SI
sma-NO
sma-SE
smj-NO
smj-SE
smn-FI
sms-FI
sq-AL
sr-BA
sr-CS
sr-Cyrl-BA
sr-Cyrl-CS
sr-Cyrl-ME
sr-Cyrl-RS
sr-Latn-BA
sr-Latn-CS
sr-Latn-ME
sr-Latn-RS
sr-ME
sr-RS
sr-sp
sv-FI
sv-SE
sw-KE
syr-SY
ta-IN
te-IN
tg-Cyrl-TJ
th-TH
tk-TM
tlh-QS
tn-ZA
tr-TR
tt-RU
tzm-Latn-DZ
ug-CN
uk-UA
ur-PK
uz-Cyrl-UZ
uz-Latn-UZ
uz-uz
vi-VN
wo-SN
xh-ZA
yo-NG
zh-CN
zh-HK
zh-MO
zh-SG
zh-TW
zu-ZA
*/
/*
export const DateOptions = {
	weekday: dateTypeWeekday,
	year: dateTypeDefault,
	month: dateTypeMonth,
	day: dateTypeDefault,
	hour: dateTypeDefault,
	minute: dateTypeDefault,
	second: dateTypeDefault,
	timeZoneName: dateTimeZoneName,
	timeZone: dateTypeTimeZone,
	zone: dateZone,
	params: [
		{
			label: __('toLocaleDateString', 'maxi-blocks'),
			value: 'toLocaleDateString',
		},
		{
			label: __('toLocaleDateString("en-ZA")', 'maxi-blocks'),
			value: 'toLocaleDateString("en-ZA")',
		},
		{
			label: __('toLocaleDateString("en-CA")', 'maxi-blocks'),
			value: 'toLocaleDateString("en-CA")',
		},
		{
			label: __('toISOString', 'maxi-blocks'),
			value: 'toISOString',
		},
		{
			label: __('toUTCString', 'maxi-blocks'),
			value: 'toUTCString',
		},
	],
};*/
