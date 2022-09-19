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
	showOptions,
	postTypeDic,
	descriptionOfErrors,
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
		'dc-author': author,
		'dc-id': id,
		'dc-show': show,
		'dc-field': field,
		// 'dc-content': content,
	} = dynamicContent;

	const [newId, setNewId] = useState('');
	const [postIdOptions, setPostIdOptions] = useState([]);
	const [isEmptyIdOptions, setIsEmptyIdOptions] = useState(true);
	const [postAuthorOptions, setPostAuthorOptions] = useState([]);
	const [isEmptyAuthorOptions, setIsEmptyAuthorOptions] = useState(true);

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

	const setAuthorList = (result, _relation = relation) => {
		if (_relation === 'author') {
			const newPostAuthorOptions = result.map(item => {
				return {
					label: `${item.id} - ${
						item[idOptionByField[_relation]]?.rendered ??
						item[idOptionByField[_relation]]
					}`,
					value: +item.id,
				};
			});
			if (isEmpty(newPostAuthorOptions)) {
				setIsEmptyAuthorOptions(true);
			} else {
				setIsEmptyAuthorOptions(false);
				setPostAuthorOptions(newPostAuthorOptions);
			}
			console.log('newPostAuthorOptions', newPostAuthorOptions);
		}
	};

	const setIdList = (result, newType) => {
		const newPostIdOptions = result.map(item => {
			return {
				label: `${item.id} - ${
					item[idOptionByField[newType]]?.rendered ??
					item[idOptionByField[newType]]
				}`,
				value: +item.id,
			};
		});
		if (isEmpty(newPostIdOptions)) {
			setIsEmptyIdOptions(true);
		} else {
			setIsEmptyIdOptions(false);
			setPostIdOptions(newPostIdOptions);
		}
		return newPostIdOptions;
	};

	const getAuthorByID = async idAuthor => {
		return await apiFetch({ path: '/wp/v2/users/' + idAuthor }).then(
			author => {
				const authorName = author.name ? author.name : 'No name';
				return authorName;
			}
		);
	};

	const changeContent = async (_show = show, _id = id) => {
		if (
			relationTypes.includes(type) &&
			['previous', 'next'].includes(_show)
		) {
			const { /*id: postId,*/ type: postType } =
				select('core/editor').getCurrentPost();

			const prevNextPath = `/wp/v2/${postTypeDic[postType]}/${_id}?_fields=${_show}`;

			return await apiFetch({
				path: prevNextPath,
			})
				.catch(rej => console.error(rej))
				.then(res => {
					if (
						// res[_show] !== null &&
						typeof res[_show] === 'object' &&
						'id' in res[_show]
					) {
						if (isFinite(res[_show].id)) {
							//setNewId(res[_show].id);
							console.log('setNewId', _id, res[_show].id);
							return res[_show].id;
						}
					} else {
						console.log('setNewId_', _id, null);
						return null;
						//setNewId('');
						//return descriptionOfErrors[_show];
					}
				});
		}
	};

	const getContentPath = (type, id, field) => {
		const getForShow = async () => {
			console.log('getForShow', show, id);
			switch (show) {
				case 'next':
				case 'previous':
					return await changeContent(show, id);
				case 'current':
				default:
					return id;
			}
		};
		const getForRelation = () => {
			const test = getForShow();
			console.log('test', test);
			//const id = newId ?? id;
			switch (relation) {
				case 'author':
					return `/wp/v2/${type}?author=${id}&per_page=1&_fields=${field}`;
				case 'last-published':
					return `/wp/v2/${type}&per_page=1`;
				case 'date':
				case 'modified':
					return `/wp/v2/${type}?orderby=${getBy}&per_page=1&_fields=${field}`;
				case 'random':
					return `/wp/v2/${type}/?_fields=id&per_page=99&orderby=${
						randomOptions[random(randomOptions.length - 1)]
					}`;
				case 'by-id':
				default:
					return `/wp/v2/${type}/${id}?_fields=${field}`;
			}
		};
		const getForType = () => {
			switch (type) {
				case relationTypes.includes(type) ? type : false:
					return getForRelation();
				case 'settings':
				case 'users':
				default:
					return `/wp/v2/${type}?_fields=${field}`;
			}
		};
		return getForType();
	};

	const requestContent = async dataRequest => {
		const { type: _type, id: _id, field: _field } = dataRequest;

		return await apiFetch({
			path: getContentPath(_type, _id, _field),
		})
			.catch(err => console.error(err)) // TODO: need a good error handler
			.then(result => {
				const content = isArray(result) ? result[0] : result;

				if (content) {
					if (
						renderedFields.includes(_field) &&
						!isNil(content[_field]?.rendered)
					) {
						return content[_field].rendered;
					}

					// Author conditional !!!
					if (_field === 'author') {
						const authorId = getAuthorByID(content[_field]);
						return authorId.then(value => value);
					}

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
						throw new Error(descriptionOfErrors.object);
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

		const _id = await changeContent();
		console.log('_id', _id);
		/*if (
			relationTypes.includes(type) &&
			['previous', 'next'].includes(getBy)
		) {
			const { id: postId, type: postType } =
				select('core/editor').getCurrentPost();

			const prevNextPath = `/wp/v2/${postTypeDic[postType]}/${postId}?_fields=${getBy}`;

			return apiFetch({
				path: prevNextPath,
			})
				.catch(rej => console.error(rej))
				.then(res => {
					if (typeof res[getBy] === 'object' && 'id' in res[getBy]) {
						isFinite(res[getBy].id)
							? requestContent({
									...dataRequest,
									type: postTypeDic[postType],
									id: res[getBy].id,
							  })
							: '';
					} else {
						return descriptionOfErrors[getBy];
					}
				});
		}*/

		return requestContent(dataRequest);
	};

	const getIdOptionsPath = (_type, _relation) => {
		if (_relation === 'author')
			return '/wp/v2/users?per_page=99&_fields=id, name';

		return `/wp/v2/${_type}?_fields=id, ${idOptionByField[_type]}`;
	};

	const getIdOptions = async (
		newType = type,
		additionalParameters = null,
		_relation = relation
	) =>
		idFields.includes(newType) &&
		apiFetch({
			path: getIdOptionsPath(newType, _relation),
		})
			.catch(err => console.error(err)) // TODO: need a good error handler
			.then(async result => {
				// author
				setAuthorList(result, _relation);
				const newPostIdOptions = setIdList(result, newType);
				if (isEmpty(newPostIdOptions)) {
					disabledType(newType);
					additionalParameters && onChange(additionalParameters);
				} else {
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
							type: newType,
							id: defaultValues['dc-id'] ?? id,
							field: defaultValues['dc-field'] ?? field,
						});

						defaultValues['dc-content'] =
							sanitizeContent(newContent);
					}

					if (!isEmpty(defaultValues)) onChange(defaultValues);
				}
			});

	const switchOnChange = async (_type, _value) => {
		switch (_type) {
			case 'status':
				onChange({ 'dc-status': _value });
				if (!status) {
					getIdOptions();
				}
				break;
			case 'type':
				const dcFieldActual = validationsValues(_value);
				if (idFields.includes(_value)) {
					getIdOptions(_value, {
						'dc-type': _value,
						...dcFieldActual,
					});
				} else {
					onChange({
						'dc-type': _value,
						...dcFieldActual,
					});
				}
				break;
			case 'relation':
				onChange({ 'dc-relation': _value });
				getIdOptions(type, null, _value);
				break;
			case 'author':
				onChange({ 'dc-author': _value });
				break;
			case 'id':
				onChange({ 'dc-id': _value });
				break;
			case 'show':
				await onChange({ 'dc-show': _value });
				console.log('show', await changeContent(_value));
				break;
			case 'field':
				onChange({ 'dc-field': _value });
				break;
		}
	};

	//console.log('set', status, type, isEmpty(postIdOptions), isEmptyIdOptions);
	if (status && type && isEmpty(postIdOptions) && isEmptyIdOptions) {
		getIdOptions();
	}

	useEffect(async () => {
		if (status)
			onChange({
				'dc-content': sanitizeContent(
					await getContent({ type, id, field })
				),
			});
	}, [type, id, field, relation, getBy, show, author]);

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
					onChange={() => switchOnChange('status', !status)}
				/>
				{status && (
					<>
						<SelectControl
							label={__('Type', 'maxi-blocks')}
							value={type}
							options={typeOptions}
							onChange={value => switchOnChange('type', value)}
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
											switchOnChange('relation', value)
										}
									/>
								)}
								{(type === 'users' ||
									relation === 'author') && (
									<SelectControl
										label={__('Author id', 'maxi-blocks')}
										value={author}
										options={postAuthorOptions}
										onChange={value =>
											switchOnChange('author', value)
										}
									/>
								)}
								{relationTypes.includes(type) &&
									(relation === 'by-id' ||
										relation === 'author') && (
										<SelectControl
											label={__('Post id', 'maxi-blocks')}
											value={id}
											options={postIdOptions}
											onChange={value =>
												switchOnChange('id', value)
											}
										/>
									)}
								{relationTypes.includes(type) && (
									<SelectControl
										label={__('Show', 'maxi-blocks')}
										value={show}
										options={showOptions}
										onChange={value =>
											switchOnChange('show', value)
										}
									/>
								)}
								{(['settings'].includes(type) ||
									(relation === 'by-id' && isFinite(id)) ||
									relation === 'last-published' ||
									relation === 'author' ||
									relation === 'random') && (
									<SelectControl
										label={__('Field', 'maxi-blocks')}
										value={field}
										options={fieldOptions[type]}
										onChange={value =>
											switchOnChange('field', value)
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
