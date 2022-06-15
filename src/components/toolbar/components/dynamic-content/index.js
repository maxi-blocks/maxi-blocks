/* eslint-disable react-hooks/rules-of-hooks */
/**
 * WordPress dependencies
 */
import apiFetch from '@wordpress/api-fetch';
import { __ } from '@wordpress/i18n';
import { useState, useEffect } from '@wordpress/element';

/**
 * Internal dependencies
 */
import ToolbarPopover from '../toolbar-popover';
import SelectControl from '../../../select-control';

/**
 * External dependencies
 */
import { find, isEmpty, isFinite } from 'lodash';

/**
 * Icons
 */
import { toolbarTextMargin } from '../../../../icons';
import { getCPTOptions, getCTOptions } from './utils';
import ToggleSwitch from '../../../toggle-switch';

/**
 * Dynamic Content
 */
const ALLOWED_BLOCKS = ['maxi-blocks/text-maxi'];

const typeOptions = [
	{ label: __('Post', 'maxi-blocks'), value: 'posts' },
	{ label: __('Page', 'maxi-blocks'), value: 'pages' },
	...getCPTOptions(),
	{ label: __('Site', 'maxi-blocks'), value: 'site' },
	{ label: __('Media', 'maxi-blocks'), value: 'media' },
	{ label: __('Author', 'maxi-blocks'), value: 'author' },
	// { label: __('Comments', 'maxi-blocks'), value: 'comments' }, ??
	{ label: __('Categories', 'maxi-blocks'), value: 'categories' },
	{ label: __('Tags', 'maxi-blocks'), value: 'tags' },
	...getCTOptions(),
];

const relationOptions = [
	{ label: __('Get by id', 'maxi-blocks'), value: 'by-id' },
	{ label: __('Get last published'), value: 'last-published' },
	{ label: __('Get last published by…'), value: 'last-published-by' },
	{ label: __('Get random'), value: 'random' },
];

const getByOptions = [
	{ label: __('Date', 'maxi-blocks'), value: 'date' },
	{ label: __('Author', 'maxi-blocks'), value: 'author' },
	{ label: __('Modified', 'maxi-blocks'), value: 'modified' },
	{ label: __('Next', 'maxi-blocks'), value: 'next' },
	{ label: __('Previous', 'maxi-blocks'), value: 'previous' },
];

const postsPagesOptions = [
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

const catTagOptions = [
	{ label: __('Name', 'maxi-blocks'), value: 'name' },
	{ label: __('Description', 'maxi-blocks'), value: 'description' },
	{ label: __('Slug', 'maxi-blocks'), value: 'slug' },
	{ label: __('Parent', 'maxi-blocks'), value: 'parent' },
	{ label: __('Count', 'maxi-blocks'), value: 'count' },
];

const fieldOptions = {
	posts: postsPagesOptions,
	pages: postsPagesOptions,
	site: [
		{ label: __('Title', 'maxi-blocks'), value: 'title' },
		{ label: __('Tagline', 'maxi-blocks'), value: 'tagline' },
		{ label: __('Description', 'maxi-blocks'), value: 'description' },
		{ label: __('Site URL', 'maxi-blocks'), value: 'url' },
		{ label: __('Admin email', 'maxi-blocks'), value: 'admin_email' },
		{ label: __('Language', 'maxi-blocks'), value: 'language' },
	],
	author: [
		{ label: __('Name', 'maxi-blocks'), value: 'name' },
		{ label: __('Nickname', 'maxi-blocks'), value: 'nickname' },
		{ label: __('Description', 'maxi-blocks'), value: 'description' },
		{ label: __('Avatar', 'maxi-blocks'), value: 'avatar' },
		{ label: __('Email', 'maxi-blocks'), value: 'email' },
		{ label: __('Website', 'maxi-blocks'), value: 'website' },
		{ label: __('Bio', 'maxi-blocks'), value: 'bio' },
	],
	categories: catTagOptions,
	tags: catTagOptions,
};

// Fields that have rendered and raw content
const renderedFields = ['title', 'content', 'excerpt'];

// Types that accept relations
const relationTypes = ['posts', 'pages', 'categories', 'tags'];

// In case content is empty, show this text
const sanitizeContent = content =>
	content && !isEmpty(content)
		? content
		: __('No content found', 'maxi-blocks');

const DynamicContent = props => {
	const { blockName, onChange, ...dynamicContent } = props;

	if (!ALLOWED_BLOCKS.includes(blockName)) return null;

	const {
		'dc-status': status,
		'dc-type': type,
		'dc-relation': relation,
		'dc-get-by': getBy,
		'dc-id': id,
		'dc-field': field,
		// 'dc-content': content,
	} = dynamicContent;

	const [postIdOptions, setPostIdOptions] = useState([]);

	const getContent = async dataRequest => {
		const { type: _type, id: _id, field: _field } = dataRequest;

		switch (_type) {
			case 'posts':
			case 'pages': {
				return apiFetch({
					path: `/wp/v2/${_type}/${_id}?_fields=${_field}`,
				})
					.catch(err => console.error(err)) // TODO: need a good error handler
					.then(content => {
						if (content) {
							if (renderedFields.includes(_field))
								return content[_field].rendered;

							return content[_field];
						}

						return null; // TODO: needs to handle empty posts(type)
					});
			}
			default:
				return null;
		}
	};

	const getPostIds = async newType =>
		apiFetch({
			path: `/wp/v2/${newType ?? type}?_fields=id, title`,
		})
			.catch(err => console.error(err)) // TODO: need a good error handler
			.then(async posts => {
				const newPostIdOptions = posts.map(post => {
					return {
						label: `${post.id} - ${post.title.rendered}`,
						value: post.id,
					};
				});

				setPostIdOptions(newPostIdOptions);

				// Set default values in case they are not defined
				const defaultValues = {};

				// Ensures first post id is selected
				if (isEmpty(find(newPostIdOptions, { value: id })))
					defaultValues['dc-id'] = posts[0].id;

				// Ensures first field is selected
				if (!field)
					defaultValues['dc-field'] = fieldOptions[type][0].value;

				// Ensures content is selected
				if (!isEmpty(defaultValues)) {
					const newContent = await getContent({
						type: newType ?? type,
						id: defaultValues['dc-id'] ?? id,
						field: defaultValues['dc-field'] ?? field,
					});

					defaultValues['dc-content'] = sanitizeContent(newContent);
				}

				if (!isEmpty(defaultValues)) onChange(defaultValues);
			});

	if (status && isEmpty(postIdOptions)) getPostIds();

	useEffect(async () => {
		if (status)
			onChange({
				'dc-content': sanitizeContent(
					await getContent({ type, id, field })
				),
			});
	}, [id, field]);

	return (
		<ToolbarPopover
			className='toolbar-item__text-margin'
			tooltip={__('Margin', 'maxi-blocks')}
			icon={toolbarTextMargin}
			advancedOptions='margin padding'
		>
			<div className='toolbar-item__text-margin__popover toolbar-item__padding-margin__popover'>
				<ToggleSwitch
					label={__('Use dynamic content', 'maxi-blocks')}
					selected={status}
					onChange={() => {
						onChange({ 'dc-status': !status });

						if (!status && isEmpty(postIdOptions)) getPostIds();
					}}
				/>
				{status && (
					<>
						<SelectControl
							label={__('Type', 'maxi-blocks')}
							value={type}
							options={typeOptions}
							onChange={value => {
								onChange({ 'dc-type': value });

								getPostIds(value);
							}}
						/>
						{relationTypes.includes(type) && (
							<SelectControl
								label={__('Relation', 'maxi-blocks')}
								value={relation}
								options={relationOptions}
								onChange={value =>
									onChange({ 'dc-relation': value })
								}
							/>
						)}
						{relation === 'by-id' && (
							<SelectControl
								label={__('Post id', 'maxi-blocks')}
								value={id}
								options={postIdOptions}
								onChange={value => onChange({ 'dc-id': value })}
							/>
						)}
						{relationTypes.includes(type) &&
							relation === 'last-published-by' && (
								<SelectControl
									label={__(
										'Last published by…',
										'maxi-blocks'
									)}
									value={getBy}
									options={getByOptions}
									onChange={value =>
										onChange({ 'dc-get-by': value })
									}
								/>
							)}
						{((relation === 'by-id' && isFinite(id)) ||
							relation === 'last-published' ||
							(relation === 'last-published-by' && getBy) ||
							relation === 'random') && (
							<SelectControl
								label={__('Field', 'maxi-blocks')}
								value={field}
								options={fieldOptions[type]}
								onChange={value =>
									onChange({ 'dc-field': value })
								}
							/>
						)}
					</>
				)}
			</div>
		</ToolbarPopover>
	);
};

export default DynamicContent;
