/* eslint-disable react-hooks/rules-of-hooks */
/**
 * WordPress dependencies
 */
import apiFetch from '@wordpress/api-fetch';
import { __ } from '@wordpress/i18n';
import { useState, useEffect, useRef } from '@wordpress/element';

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
	relationOptions,
	idFields,
	idOptionByField,
	randomOptions,
	showOptions,
	descriptionOfErrors,
	DateOptions,
	LimitOptions,
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
		'dc-error': error,
		'dc-status': status,
		'dc-type': type,
		'dc-relation': relation,
		'dc-author': author,
		'dc-id': id,
		'dc-show': show,
		'dc-field': field,
		'dc-date': date,
		'dc-limit': limit,
		// 'dc-content': content,
	} = dynamicContent;

	const errorRef = useRef(error);
	const statusRef = useRef(status);
	const typeRef = useRef(type);
	const relationRef = useRef(relation);
	const authorRef = useRef(author);
	const idRef = useRef(id);
	const showRef = useRef(show);
	const fieldRef = useRef(field);
	const dateRef = useRef(date);
	const limitRef = useRef(limit);
	const alterIdRef = useRef(null);

	const [postIdOptions, setPostIdOptions] = useState(null);
	const [postAuthorOptions, setPostAuthorOptions] = useState(null);
	const [isEmptyIdOptions, setIsEmptyIdOptions] = useState(true);

	useEffect(async () => {
		if (statusRef.current) {
			//const res = [typeRef.current ? typeRef.current : type, id, field];
			onChange({
				'dc-content': sanitizeContent(
					await getContent({ type, id, field })
				),
			});
		}
	}, [type, id, field, relation, show, author, error, date, limit]);

	const validationsValues = variableValue => {
		const result = fieldOptions[variableValue].map(x => x.value);
		if (result.includes(fieldRef.current)) {
			return {};
		} else {
			fieldRef.current = result[0];
			return { 'dc-field': result[0] };
		}
	};
	const limitFormat = _value => {
		if (_value.length > limitRef.current && limitRef.current !== 0) {
			return _value.substr(0, limitRef.current);
		} else {
			return _value;
		}
	};
	const dateFormat = _value => {
		let NewDate = new Date(_value);
		switch (dateRef.current) {
			case 'toLocaleDateString':
				return NewDate.toLocaleDateString();
			case 'toLocaleDateString("en-ZA")':
				return NewDate.toLocaleDateString('en-ZA');
			case 'toLocaleDateString("en-CA")':
				return NewDate.toLocaleDateString('en-CA');
			case 'toISOString':
				return NewDate.toISOString();
			case 'toUTCString':
				return NewDate.toUTCString();
		}
	};

	const disabledType = (valueType, _type = 'type') => {
		if (_type === 'type') {
			Object.keys(typeOptions).forEach(key => {
				if (typeOptions[key]['value'] === valueType) {
					typeOptions[key].disabled = true;
				}
			});
		} else if (_type === 'relation') {
			Object.keys(relationOptions).forEach(key => {
				if (relationOptions[key]['value'] === valueType) {
					relationOptions[key].disabled = true;
				}
			});
		}
	};

	const setAuthorDefault = async () => {
		if (!authorRef.current) {
			await apiFetch({
				path: '/wp/v2/users/me',
			})
				.catch(err => console.error(err))
				.then(res => {
					onChange({ 'dc-author': res.id });
					authorRef.current = res.id;
				});
		}
	};

	const setAuthorList = async () => {
		if (!postAuthorOptions) {
			await apiFetch({
				path: '/wp/v2/users?per_page=99&_fields=id, name',
			})
				.catch(err => console.error(err))
				.then(result => {
					const newPostAuthorOptions = result.map(item => {
						return {
							label: `${item.id} - ${
								item[idOptionByField['author']]?.rendered ??
								item[idOptionByField['author']]
							}`,
							value: +item.id,
						};
					});
					if (isEmpty(newPostAuthorOptions)) {
						setPostAuthorOptions({});
					} else {
						setPostAuthorOptions(newPostAuthorOptions);
					}
				});
		}
	};

	const setIdList = (result, _default, _type) => {
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
			const defaultValues = _default ? _default : {};
			if (relationRef.current === 'author') {
				defaultValues['dc-error'] = relationRef.current;
				errorRef.current = relationRef.current;
			}
			if (typeRef.current === 'media') {
				defaultValues['dc-error'] = typeRef.current;
				//defaultValues['dc-id'] = null;
				errorRef.current = typeRef.current;
				disabledType(_type);
			}
			if (typeRef.current === 'tags') {
				defaultValues['dc-error'] = typeRef.current;
				//defaultValues['dc-id'] = null;
				errorRef.current = typeRef.current;
				disabledType(_type);
			}
			setIsEmptyIdOptions(true);
			if (!isEmpty(defaultValues)) onChange(defaultValues);
			//disabledType(_type);
		} else {
			if (relationRef.current === 'author') {
				onChange({ 'dc-error': '' });
				errorRef.current = '';
			}
			setIsEmptyIdOptions(false);
			setPostIdOptions(newPostIdOptions);
			// Set default values in case they are not defined
			const defaultValues = _default ? _default : {};

			// Ensures first post id is selected
			if (isEmpty(find(newPostIdOptions, { value: idRef.current }))) {
				defaultValues['dc-id'] = result[0].id;
				idRef.current = result[0].id;
				idFields.current = result[0].id;
			}

			// Ensures first field is selected
			if (!fieldRef.current) {
				defaultValues['dc-field'] = fieldOptions[type][0].value;
				fieldRef.current = fieldOptions[type][0].value;
			}

			// Ensures content is selected
			if (!isEmpty(defaultValues)) {
				// const newContent = getContent({
				// 	type: _type,
				// 	id: defaultValues['dc-id'] ?? idRef.current,
				// 	field: defaultValues['dc-field'] ?? fieldRef.current,
				// });
				//defaultValues['dc-content'] = sanitizeContent(newContent);
			}

			if (!isEmpty(defaultValues)) onChange(defaultValues);
		}
		return newPostIdOptions;
	};

	const getAuthorByID = async _id => {
		return await apiFetch({ path: '/wp/v2/users/' + _id }).then(author => {
			const authorName = author.name ? author.name : 'No name';
			return authorName;
		});
	};

	const changeContent = async (_type, _show, _id) => {
		if (
			relationTypes.includes(typeRef.current) &&
			['previous', 'next'].includes(_show)
		) {
			const prevNextPath = `/wp/v2/${_type}/${_id}?_fields=${_show}`;
			return await apiFetch({
				path: prevNextPath,
			})
				.catch(rej => console.error(rej))
				.then(res => {
					if (
						typeof res[_show] === 'object' &&
						res[_show] !== null &&
						'id' in res[_show]
					) {
						onChange({ 'dc-error': '' });
						errorRef.current = '';
						if (isFinite(res[_show].id)) {
							return res[_show].id;
						}
					} else {
						onChange({ 'dc-error': _show });
						errorRef.current = _show;
						return null;
					}
				});
		}
	};

	const getContentPath = (_type, _id, _field) => {
		const getForShow = async () => {
			switch (showRef.current) {
				case 'next':
				case 'previous':
					return await changeContent(
						_type,
						showRef.current,
						_id
					).then(res => res);
				case 'current':
				default:
					return _id;
			}
		};
		const getForRelation = () => {
			return getForShow(_type, _id, _field)
				.then(res => {
					if (typeof res === 'number') {
						alterIdRef.current = res;
					} else {
						onChange({ 'dc-error': showRef.current });
						errorRef.current = showRef.current;
						alterIdRef.current = null;
					}
				})
				.then(res => {
					switch (relationRef.current) {
						case 'author':
							return `/wp/v2/${_type}/${
								alterIdRef.current ? alterIdRef.current : _id
							}?_fields=${_field}`;
						case 'date':
						case 'modified':
							if (
								!['previous', 'next'].includes(
									showRef.current
								) ||
								!alterIdRef.current
							) {
								return `/wp/v2/${_type}?orderby=${relationRef.current}&per_page=1&_fields=${_field},id`;
							} else {
								return `/wp/v2/${_type}/${
									alterIdRef.current
										? alterIdRef.current
										: _id
								}?_fields=${_field}`;
							}

						case 'random':
							return `/wp/v2/${_type}/?_fields=${_field}&per_page=99&orderby=${
								randomOptions[_type][
									random(
										randomOptions[typeRef.current].length -
											1
									)
								]
							}`;
						case 'by-id':
						default:
							return `/wp/v2/${_type}/${
								alterIdRef.current ? alterIdRef.current : _id
							}?_fields=${_field}`;
					}
				});

			//const id = newId ?? id;
		};
		const getForType = async () => {
			switch (_type) {
				case relationTypes.includes(_type) ? _type : false:
					return await getForRelation();
				case 'users':
					return `/wp/v2/${_type}/${
						authorRef.current ? authorRef.current : _id
					}/?_fields=${_field}`;
				case 'settings':
				default:
					return `/wp/v2/${_type}?_fields=${_field}`;
			}
		};
		return getForType();
	};

	const requestContent = async dataRequest => {
		const { type: _type, id: _id, field: _field } = dataRequest;

		return await apiFetch({
			path: await getContentPath(_type, _id, _field),
		})
			.catch(err => console.error(err)) // TODO: need a good error handler
			.then(result => {
				const content = isArray(result) ? result[0] : result;

				if (content) {
					let content_value;
					if (content.id) {
						idRef.current = Number(content.id);
						onChange({ 'dc-id': Number(content.id) });
					}
					if (
						renderedFields.includes(_field) &&
						!isNil(content[_field]?.rendered)
					) {
						content_value = content[_field].rendered;
					} else if (_field === 'author') {
						const authorId = getAuthorByID(content[_field]);
						content_value = authorId.then(value => value);
					} else {
						content_value = content[_field];
					}

					if (fieldRef.current === 'date') {
						content_value = dateFormat(content_value);
					} else if (fieldRef.current === 'excerpt') {
						content_value = limitFormat(content_value);
					}
					return content_value;
				}

				return null; // TODO: needs to handle empty posts(type)
			});
	};

	const getContent = async dataRequest => {
		const { type, id } = dataRequest;
		if (
			type === 'posts' &&
			error === 'next' &&
			showRef.current === 'next'
		) {
			return descriptionOfErrors.next;
		} else if (
			type === 'posts' &&
			error === 'previous' &&
			relationRef.current === 'previous'
		) {
			return descriptionOfErrors.previous;
		} else if (error === 'author' && relationRef.current === 'author') {
			return descriptionOfErrors.author;
		} else if (type === 'media' && error === 'media') {
			return descriptionOfErrors.media;
		} else if (type === 'tags' && error === 'tags') {
			return descriptionOfErrors.tags;
		}
		if (
			relationTypes.includes(typeRef.current) &&
			relationRef.current === 'random'
		) {
			const randomPath = `/wp/v2/${type}/?_fields=id&per_page=99&orderby=${
				randomOptions[typeRef.current][
					random(randomOptions[typeRef.current].length - 1)
				]
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
					error => console.error(error)
				);
		}
		if (typeRef.current === 'users') {
			dataRequest.id = authorRef.current ? authorRef.current : id;
		}
		return requestContent(dataRequest);
	};

	const getIdOptionsPath = (_type, _relation = null, _users = null) => {
		const path =
			_type === 'users'
				? '/wp/v2/users?per_page=99&_fields=id, name'
				: _users
				? `/wp/v2/${_type}/?author=${_users}&_fields=id, ${idOptionByField[_type]}`
				: `/wp/v2/${_type}?_fields=id, ${idOptionByField[_type]}`;
		return path;
	};

	const setIdOptions = async (_type, _default, _relation) => {
		return await apiFetch({
			path: getIdOptionsPath(
				_type,
				null,
				_relation === 'author' ? authorRef.current : null
			),
		})
			.catch(err => console.error(err)) // TODO: need a good error handler
			.then(result => setIdList(result, _default, _type));
	};

	const getIdOptions = (
		_type = typeRef.current,
		_default = null,
		_relation = relationRef.current
	) => {
		if (idFields.includes(_type)) {
			return setIdOptions(_type, _default, _relation)
				.catch(rej => console.error(rej))
				.then(res => res);
		}
	};
	const switchOnChange = (_type, _value) => {
		switch (_type) {
			case 'status':
				statusRef.current = _value;
				onChange({ 'dc-status': _value });
				if (_value) {
					getIdOptions();
				}
				break;
			case 'type':
				typeRef.current = _value;
				showRef.current = 'current';
				const dcFieldActual = validationsValues(_value);
				if (idFields.includes(_value)) {
					getIdOptions(
						_value,
						{
							'dc-type': _value,
							'dc-show': 'current',
							...dcFieldActual,
						},
						null
					);
				} else {
					onChange({
						'dc-type': _value,
						'dc-show': 'current',
						...dcFieldActual,
					});
				}
				break;
			case 'relation':
				relationRef.current = _value;
				showRef.current = 'current';
				//onChange({ 'dc-relation': _value, 'dc-show': 'current' });
				getIdOptions(
					typeRef.current,
					{ 'dc-relation': _value, 'dc-show': 'current' },
					_value
				);
				break;
			case 'author':
				authorRef.current = _value;
				//onChange({ 'dc-author': _value });
				getIdOptions(
					typeRef.current,
					{ 'dc-author': _value },
					relationRef.current
				);
				break;
			case 'id':
				idRef.current = Number(_value);
				onChange({ 'dc-id': Number(_value) });
				break;
			case 'show':
				showRef.current = _value;
				onChange({ 'dc-show': _value });
				changeContent(typeRef.current, _value, idRef.current);
				break;
			case 'field':
				fieldRef.current = _value;
				onChange({ 'dc-field': _value });
				break;
			case 'limit':
				limitRef.current = _value;
				onChange({ 'dc-limit': _value });
				break;
			case 'date':
				dateRef.current = _value;
				onChange({ 'dc-date': _value });
				break;
		}
	};

	setAuthorList();
	setAuthorDefault();
	if (
		statusRef.current &&
		typeRef.current &&
		isEmpty(postIdOptions) &&
		isEmptyIdOptions
	) {
		getIdOptions()
			.catch(rej => console.error(rej))
			.then(res => res);
	}

	return (
		<ToolbarPopover
			className='toolbar-item__dynamic-content'
			tooltip={__('Dynamic Content', 'maxi-blocks')}
			icon={toolbarDynamicContent}
		>
			<div className='toolbar-item__dynamic-content__popover toolbar-item__dynamic-content__popover'>
				<ToggleSwitch
					label={__('Use dynamic content', 'maxi-blocks')}
					selected={statusRef.current}
					onChange={() =>
						switchOnChange('status', !statusRef.current)
					}
				/>
				{statusRef.current && (
					<>
						<SelectControl
							label={__('Type', 'maxi-blocks')}
							value={typeRef.current}
							options={typeOptions}
							onChange={value => switchOnChange('type', value)}
						/>
						{!postIdOptions ? (
							<p>This type is empty</p>
						) : (
							<>
								{relationTypes.includes(typeRef.current) && (
									<SelectControl
										label={__('Relation', 'maxi-blocks')}
										value={relationRef.current}
										options={
											relationOptions[typeRef.current]
										}
										onChange={value =>
											switchOnChange('relation', value)
										}
									/>
								)}
								{relationTypes.includes(typeRef.current) &&
									(typeRef.current === 'users' ||
										relationRef.current === 'author') && (
										<SelectControl
											label={__(
												'Author id',
												'maxi-blocks'
											)}
											value={authorRef.current}
											options={postAuthorOptions}
											onChange={value =>
												switchOnChange('author', value)
											}
										/>
									)}
								{relationTypes.includes(typeRef.current) &&
									typeRef.current !== 'users' &&
									['author', 'by-id'].includes(
										relationRef.current
									) && (
										<SelectControl
											label={__(
												typeRef.current + ' id',
												'maxi-blocks'
											)}
											value={idRef.current}
											options={
												!isEmptyIdOptions
													? postIdOptions
													: {}
											}
											onChange={value =>
												switchOnChange('id', value)
											}
										/>
									)}
								{relationTypes.includes(typeRef.current) &&
									typeRef.current === 'posts' &&
									!['author', 'random'].includes(
										relationRef.current
									) &&
									!isEmptyIdOptions && (
										<SelectControl
											label={__('Show', 'maxi-blocks')}
											value={showRef.current}
											options={showOptions}
											onChange={value =>
												switchOnChange('show', value)
											}
										/>
									)}
								{(['settings'].includes(typeRef.current) ||
									(relationRef.current === 'by-id' &&
										isFinite(idRef.current)) ||
									(relationRef.current === 'author' &&
										!isEmptyIdOptions) ||
									['date', 'modified', 'random'].includes(
										relationRef.current
									)) && (
									<SelectControl
										label={__('Field', 'maxi-blocks')}
										value={fieldRef.current}
										options={fieldOptions[typeRef.current]}
										onChange={value =>
											switchOnChange('field', value)
										}
									/>
								)}
								{fieldRef.current == 'excerpt' && (
									<SelectControl
										label={__(
											'Character limit',
											'maxi-blocks'
										)}
										value={limitRef.current}
										options={LimitOptions}
										onChange={value =>
											switchOnChange('limit', value)
										}
									/>
								)}
								{fieldRef.current == 'date' && (
									<SelectControl
										label={__('Date format', 'maxi-blocks')}
										value={dateRef.current}
										options={DateOptions}
										onChange={value =>
											switchOnChange('date', value)
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
