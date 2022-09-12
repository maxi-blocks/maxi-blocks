/* eslint-disable react-hooks/rules-of-hooks */
/**
 * WordPress dependencies
 */
import apiFetch from '@wordpress/api-fetch';
import { __ } from '@wordpress/i18n';
import { useState, useEffect } from '@wordpress/element';
import { select } from '@wordpress/data';

/**
 * Internal dependencies
 */
import ToolbarPopover from '../toolbar-popover';
import SelectControl from '../../../select-control';

/**
 * External dependencies
 */
import { find, isEmpty, isFinite, isNil, random, isArray } from 'lodash';

/**
 * Styles & Icons
 */
import './editor.scss';
import { toolbarDynamicContent } from '../../../../icons';
import {
	renderedFields,
	fieldOptions,
	sanitizeContent,
	typeOptions,
	relationTypes,
	getByOptions,
	relationOptions,
	idFields,
	idOptionByField,
	randomOptions,
} from './utils';
import ToggleSwitch from '../../../toggle-switch';

/**
 * Dynamic Content
 */
const ALLOWED_BLOCKS = ['maxi-blocks/text-maxi'];

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
	const [isEmptyIdOptions, setIsEmptyIdOptions] = useState(true);

	const validationsValues = variableValue => {
		const result = fieldOptions[variableValue].map(x => x.value);
		if (result.includes(field)) {
			return {};
		} else {
			return { 'dc-field': result[0] };
		}
	};

	const disabledType = valueType => {
		Object.keys(typeOptions).forEach(key => {
			if (typeOptions[key]['value'] === valueType) {
				typeOptions[key].disabled = true;
			}
		});
	};

	const getContentPath = (type, id, field) => {
		if (relationTypes.includes(type) && relation === 'last-published')
			return `/wp/v2/${type}&per_page=1`;
		if (
			relationTypes.includes(type) &&
			relation === 'last-published-by' &&
			getBy === 'author'
		)
			return `/wp/v2/${type}?author=${id}&per_page=1&_fields=${field}`;
		if (
			relationTypes.includes(type) &&
			relation === 'last-published-by' &&
			['previous', 'next'].includes(getBy)
		)
			return `/wp/v2/${type}/${id}&_fields=${field}`;

		if (relationTypes.includes(type) && relation === 'last-published-by')
			return `/wp/v2/${type}?orderby=${getBy}&per_page=1&_fields=${field}`;

		return `/wp/v2/${type}${
			idFields.includes(type) ? `/${id}` : ''
		}?_fields=${field}`;
	};

	const requestContent = async dataRequest => {
		const { type: _type, id: _id, field: _field } = dataRequest;

		return apiFetch({
			path: getContentPath(_type, _id, _field),
		})
			.catch(err => console.error(err)) // TODO: need a good error handler
			.then(result => {
				const content = isArray(result) ? result[0] : result;

				if (content) {
					if (
						renderedFields.includes(_field) &&
						!isNil(content[_field]?.rendered)
					)
						return content[_field].rendered;

					// Author conditional !!!

					return content[_field];
				}

				return null; // TODO: needs to handle empty posts(type)
			});
	};

	const getContent = async dataRequest => {
		if (relationTypes.includes(type) && relation === 'random') {
			const { type } = dataRequest;

			const randomPath = `/wp/v2/${type}/?_fields=id&per_page=99&orderby=${
				randomOptions[random(randomOptions.length - 1)]
			}`;

			return apiFetch({
				path: randomPath,
			})
				.then(res => {
					if (typeof res[0] === 'object' && 'id' in res[0]) {
						return res;
					} else {
						throw new Error('Value is not an object');
					}
				})
				.then(
					res =>
						requestContent({
							...dataRequest,
							id: res[random(res.length - 1)].id,
						}),
					error => {
						console.error(error);
					}
				);
		}

		if (
			relationTypes.includes(type) &&
			relation === 'last-published-by' &&
			['previous', 'next'].includes(getBy)
		) {
			const { id: postId, type: postType } =
				select('core/editor').getCurrentPost();

			const postTypeDic = {
				post: 'posts',
				page: 'pages',
			};

			const prevNextPath = `/wp/v2/${postTypeDic[postType]}/${postId}?_fields=${getBy}`;

			return apiFetch({
				path: prevNextPath,
			})
				.then(res => {
					if (typeof res[getBy] === 'object' && 'id' in res[getBy]) {
						return res;
					} else {
						throw new Error('Value is not an object');
					}
				})
				.then(
					res =>
						isFinite(res[getBy].id)
							? requestContent({
									...dataRequest,
									type: postTypeDic[postType],
									id: res[getBy].id,
							  })
							: '',
					error => {
						console.error(error);
					}
				);
		}

		return requestContent(dataRequest);
	};

	const getIdOptionsPath = type => {
		if (relation === 'last-published-by' && getBy === 'author')
			return '/wp/v2/users?per_page=99&_fields=id, name';

		return `/wp/v2/${type}?_fields=id, ${idOptionByField[type]}`;
	};

	const getIdOptions = async (newType, additionalParameters = null) =>
		idFields.includes(newType ?? type) &&
		apiFetch({
			path: getIdOptionsPath(newType ?? type),
		})
			.catch(err => console.error(err)) // TODO: need a good error handler
			.then(async result => {
				const isGetByAuthor =
					relation === 'last-published-by' && getBy === 'author';
				const _type = isGetByAuthor ? 'author' : newType ?? type;

				const newPostIdOptions = result.map(item => {
					return {
						label: `${item.id} - ${
							item[idOptionByField[_type]]?.rendered ??
							item[idOptionByField[_type]]
						}`,
						value: +item.id,
					};
				});

				if (isEmpty(newPostIdOptions)) {
					setIsEmptyIdOptions(true);
					disabledType(newType ?? type);
					additionalParameters && onChange(additionalParameters);
				} else {
					setIsEmptyIdOptions(false);

					setPostIdOptions(newPostIdOptions);

					// Set default values in case they are not defined
					const defaultValues = additionalParameters
						? additionalParameters
						: {};

					// Ensures first post id is selected
					if (isEmpty(find(newPostIdOptions, { value: id })))
						defaultValues['dc-id'] = result[0].id;

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

						defaultValues['dc-content'] =
							sanitizeContent(newContent);
					}

					if (!isEmpty(defaultValues)) onChange(defaultValues);
				}
			});

	if (status && type && isEmpty(postIdOptions) && isEmptyIdOptions)
		getIdOptions();

	useEffect(async () => {
		if (status)
			onChange({
				'dc-content': sanitizeContent(
					await getContent({ type, id, field })
				),
			});
	}, [type, id, field, relation, getBy]);

	return (
		<ToolbarPopover
			className='toolbar-item__dynamic-content'
			tooltip={__('Dynamic Content', 'maxi-blocks')}
			icon={toolbarDynamicContent}
		>
			<div className='toolbar-item__dynamic-content__popover toolbar-item__dynamic-content__popover'>
				<ToggleSwitch
					label={__('Use dynamic content', 'maxi-blocks')}
					selected={status}
					onChange={() => {
						onChange({ 'dc-status': !status });

						if (!status) getIdOptions();
					}}
				/>
				{status && (
					<>
						<SelectControl
							label={__('Type', 'maxi-blocks')}
							value={type}
							options={typeOptions}
							onChange={value => {
								const dcFieldActual = validationsValues(value);

								if (idFields.includes(value)) {
									getIdOptions(value, {
										'dc-type': value,
										...dcFieldActual,
									});
								} else {
									onChange({
										'dc-type': value,
										...dcFieldActual,
									});
								}
							}}
						/>
						{isEmptyIdOptions ? (
							<p>This type is empty</p>
						) : (
							<>
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
										onChange={value =>
											onChange({ 'dc-id': value })
										}
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
											onChange={value => {
												onChange({
													'dc-get-by': value,
												});

												getIdOptions();
											}}
										/>
									)}
								{relationTypes.includes(type) &&
									relation === 'last-published-by' &&
									getBy === 'author' && (
										<SelectControl
											label={__('Post id', 'maxi-blocks')}
											value={id}
											options={postIdOptions}
											onChange={value =>
												onChange({ 'dc-id': value })
											}
										/>
									)}
								{(['settings'].includes(type) ||
									(relation === 'by-id' && isFinite(id)) ||
									relation === 'last-published' ||
									(relation === 'last-published-by' &&
										getBy) ||
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
					</>
				)}
			</div>
		</ToolbarPopover>
	);
};

export default DynamicContent;
