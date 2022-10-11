/* eslint-disable react-hooks/rules-of-hooks */
/**
 * WordPress dependencies
 */
import apiFetch from '@wordpress/api-fetch';
import { __ } from '@wordpress/i18n';
import { useEffect, useRef, useState } from '@wordpress/element';

/**
 * Internal dependencies
 */
import AdvancedNumberControl from '../../../advanced-number-control';
import DateFormatting from '../date-formatting';
import SelectControl from '../../../select-control';
import ToolbarPopover from '../toolbar-popover';

/**
 * External dependencies
 */
import { find, isArray, isEmpty, isFinite, isNil, random } from 'lodash';

/**
 * Styles & Icons
 */
import './editor.scss';
import { toolbarDynamicContent } from '../../../../icons';
import ToggleSwitch from '../../../toggle-switch';
import {
	descriptionOfErrors,
	fieldOptions,
	idFields,
	idOptionByField,
	LimitOptions,
	randomOptions,
	relationOptions,
	relationTypes,
	renderedFields,
	sanitizeContent,
	showOptions,
	typeOptions,
} from './utils';

/**
 * Dynamic Content
 */
const ALLOWED_BLOCKS = ['maxi-blocks/text-maxi'];

const DynamicContent = props => {
	const { blockName, onChange, ...dynamicContent } = props;

	if (!ALLOWED_BLOCKS.includes(blockName)) return null;

	const {
		'dc-author': author,
		// 'dc-content': content,
		'dc-date': date,
		'dc-day': day,
		'dc-era': era,
		'dc-error': error,
		'dc-field': field,
		'dc-format': format,
		'dc-hour': hour,
		'dc-hour12': hour12,
		'dc-id': id,
		'dc-limit': limit,
		'dc-minute': minute,
		'dc-month': month,
		'dc-relation': relation,
		'dc-second': second,
		'dc-show': show,
		'dc-status': status,
		'dc-timezone': timeZone,
		'dc-timezone-name': timeZoneName,
		'dc-type': type,
		'dc-weekday': weekday,
		'dc-year': year,
		'dc-zone': zone,
	} = dynamicContent;

	const alterIdRef = useRef(null);
	const authorRef = useRef(author);
	const errorRef = useRef(error);
	const fieldRef = useRef(field);
	const idRef = useRef(id);
	const limitRef = useRef(limit);
	const relationRef = useRef(relation);
	const showRef = useRef(show);
	const statusRef = useRef(status);
	const typeRef = useRef(type);

	const [isEmptyIdOptions, setIsEmptyIdOptions] = useState(true);
	const [postAuthorOptions, setPostAuthorOptions] = useState(null);
	const [postIdOptions, setPostIdOptions] = useState(null);

	useEffect(async () => {
		if (statusRef.current) {
			onChange({
				'dc-content': sanitizeContent(
					await getContent({ type, id, field })
				),
			});
		}
	}, [
		author,
		date,
		day,
		era,
		error,
		field,
		format,
		hour,
		hour12,
		id,
		limit,
		minute,
		month,
		relation,
		second,
		show,
		timeZone,
		timeZoneName,
		type,
		weekday,
		year,
		zone,
	]);

	const changeProps = params => {
		for (let key in params) {
			const value = params[key];
			switch (key) {
				case 'dc-author':
					authorRef.current = value;
					break;
				case 'dc-error':
					errorRef.current = value;
					break;
				case 'dc-field':
					fieldRef.current = value;
					break;
				case 'dc-id':
					idRef.current = value;
					break;
				case 'dc-limit':
					limitRef.current = value;
					break;
				case 'dc-relation':
					relationRef.current = value;
					break;
				case 'dc-show':
					showRef.current = value;
					break;
				case 'dc-status':
					statusRef.current = value;
					break;
				case 'dc-type':
					typeRef.current = value;
					break;
			}
		}
		onChange(params);
	};

	const validationsValues = variableValue => {
		const result = fieldOptions[variableValue].map(x => x.value);
		return result.includes(field) ? {} : { 'dc-field': result[0] };
	};

	const limitFormat = _value =>
		_value.length > limitRef.current && limitRef.current !== 0
			? _value.substr(0, limitRef.current)
			: _value;

	const handleDateCallback = childData => {
		onChange({
			'dc-date': childData.status,
			'dc-day': childData.options.day,
			'dc-era': childData.options.era,
			'dc-format': childData.format,
			'dc-hour': childData.options.hour,
			'dc-hour12': childData.options.hour12,
			'dc-minute': childData.options.minute,
			'dc-month': childData.options.month,
			'dc-second': childData.options.second,
			'dc-timezone': childData.options.timeZone,
			'dc-timezone-name': childData.options.timeZoneName,
			'dc-weekday': childData.options.weekday,
			'dc-year': childData.options.year,
			'dc-zone': childData.zone,
		});
	};

	const dateContent = _value => {
		const NewDate = new Date(_value);
		let options, content;
		if (!date) {
			content = moment(NewDate).format(format);
		} else {
			options = {
				day: day === 'undefined' ? undefined : day,
				era: era === 'undefined' ? undefined : era,
				hour: hour === 'undefined' ? undefined : hour,
				hour12:
					hour12 === 'false'
						? false
						: hour12 === 'true'
						? true
						: hour12,
				minute: minute === 'undefined' ? undefined : minute,
				month: month === 'undefined' ? undefined : month,
				second: second === 'undefined' ? undefined : second,
				timeZone: timeZone === 'undefined' ? undefined : timeZone,
				timeZoneName:
					timeZoneName === 'undefined' ? undefined : timeZoneName,
				weekday: weekday === 'undefined' ? undefined : weekday,
				year: year === 'undefined' ? undefined : year,
			};
			content = NewDate.toLocaleString(zone, options);
		}
		return content;
	};

	const disabledType = (valueType, _type = 'type') => {
		const hide = options =>
			Object.keys(options).forEach(key => {
				if (options[key]['value'] === valueType) {
					options[key].disabled = true;
				}
			});
		hide(_type == 'relation' ? relationOptions : typeOptions);
	};

	const setAuthorDefault = async () =>
		!authorRef.current &&
		(await apiFetch({
			path: '/wp/v2/users/me',
		})
			.catch(err => console.error(err))
			.then(res => changeProps({ 'dc-author': res.id })));

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
					isEmpty(newPostAuthorOptions)
						? setPostAuthorOptions({})
						: setPostAuthorOptions(newPostAuthorOptions);
				});
		}
	};

	const setIdList = (result, _default, _type) => {
		// Set default values in case they are not defined
		const defaultValues = _default ?? {};

		const relation = _default['dc-relation'] ?? relationRef.current;
		const type = _default['dc-type'] ?? typeRef.current;
		const id = _default['dc-id'] ?? idRef.current;

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
			if (relation === 'author') defaultValues['dc-error'] = relation;

			if (['tags', 'media'].includes(type)) {
				defaultValues['dc-error'] = type;
				disabledType(_type);
			}

			setIsEmptyIdOptions(true);
			if (!isEmpty(defaultValues)) changeProps(defaultValues);
		} else {
			if (relation === 'author') changeProps({ 'dc-error': '' });

			setIsEmptyIdOptions(false);
			setPostIdOptions(newPostIdOptions);

			// Ensures first post id is selected
			if (isEmpty(find(newPostIdOptions, { value: id }))) {
				defaultValues['dc-id'] = result[0].id;
				idFields.current = result[0].id;
			}

			// Ensures first field is selected
			if (!fieldRef.current)
				defaultValues['dc-field'] = fieldOptions[type][0].value;

			if (!isEmpty(defaultValues)) changeProps(defaultValues);
		}
		return newPostIdOptions;
	};

	const getAuthorByID = async _id =>
		await apiFetch({ path: '/wp/v2/users/' + _id }).then(
			author => author.name ?? 'No name'
		);

	const changeContent = async (_type, _show, _id, _default = {}) => {
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
						changeProps({ 'dc-error': '', ..._default });
						if (isFinite(res[_show].id)) {
							return res[_show].id;
						}
					} else {
						changeProps({ 'dc-error': _show, ..._default });
						return null;
					}
				});
		} else {
			if (!isEmpty(_default)) {
				changeProps(_default);
			}
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
						changeProps({ 'dc-error': showRef.current });
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
					if (content.id)
						changeProps({ 'dc-id': Number(content.id) });

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
						content_value = dateContent(content_value);
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
		if (typeRef.current === 'users') {
			dataRequest.id = authorRef.current ?? id;
		}

		return type === 'posts' &&
			error === 'next' &&
			showRef.current === 'next'
			? descriptionOfErrors.next
			: type === 'posts' &&
			  error === 'previous' &&
			  relationRef.current === 'previous'
			? descriptionOfErrors.previous
			: error === 'author' && relationRef.current === 'author'
			? descriptionOfErrors.author
			: type === 'media' && error === 'media'
			? descriptionOfErrors.media
			: type === 'tags' && error === 'tags'
			? descriptionOfErrors.tags
			: relationTypes.includes(typeRef.current) &&
			  relationRef.current === 'random'
			? apiFetch({
					path: `/wp/v2/${type}/?_fields=id&per_page=99&orderby=${
						randomOptions[typeRef.current][
							random(randomOptions[typeRef.current].length - 1)
						]
					}`,
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
					)
			: requestContent(dataRequest);
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
				{},
				_relation === 'author' ? authorRef.current : null
			),
		})
			.catch(err => console.error(err)) // TODO: need a good error handler
			.then(result => setIdList(result, _default, _type));
	};

	const getIdOptions = (
		_type = typeRef.current,
		_default = {},
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
				changeProps({ 'dc-status': _value });
				if (_value) getIdOptions();
				break;
			case 'type':
				const dcFieldActual = validationsValues(_value);
				const changeOptions = {
					'dc-type': _value,
					'dc-show': 'current',
					'dc-error': '',
					...dcFieldActual,
				};
				idFields.includes(_value)
					? getIdOptions(_value, changeOptions, null)
					: changeProps(changeOptions);
				break;
			case 'relation':
				getIdOptions(
					typeRef.current,
					{
						'dc-relation': _value,
						'dc-show': 'current',
						'dc-error': '',
					},
					_value
				);
				break;
			case 'author':
				getIdOptions(
					typeRef.current,
					{ 'dc-author': _value },
					relationRef.current
				);
				break;
			case 'id':
				changeProps({
					'dc-error': '',
					'dc-show': 'current',
					'dc-id': Number(_value),
				});
				break;
			case 'show':
				changeContent(typeRef.current, _value, idRef.current, {
					'dc-show': _value,
				});
				break;
			case 'field':
				changeProps({ 'dc-field': _value });
				break;
			case 'limit':
				changeProps({ 'dc-limit': _value });
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
						{!date && (
							<SelectControl
								label={__('Type', 'maxi-blocks')}
								value={typeRef.current}
								options={typeOptions}
								onChange={value =>
									switchOnChange('type', value)
								}
							/>
						)}
						{!postIdOptions ? (
							<p>This type is empty</p>
						) : (
							<>
								{!date &&
									relationTypes.includes(typeRef.current) && (
										<SelectControl
											label={__(
												'Relation',
												'maxi-blocks'
											)}
											value={relationRef.current}
											options={
												relationOptions[typeRef.current]
											}
											onChange={value =>
												switchOnChange(
													'relation',
													value
												)
											}
										/>
									)}
								{!date &&
									relationTypes.includes(typeRef.current) &&
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
								{!date &&
									relationTypes.includes(typeRef.current) &&
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
								{!date &&
									relationTypes.includes(typeRef.current) &&
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
								{!date &&
									(['settings'].includes(typeRef.current) ||
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
											options={
												fieldOptions[typeRef.current]
											}
											onChange={value =>
												switchOnChange('field', value)
											}
										/>
									)}
								{fieldRef.current == 'excerpt' && (
									<AdvancedNumberControl
										label={__(
											'Character limit',
											'maxi-blocks'
										)}
										defaultValues={limitRef.current}
										value={limitRef.current}
										onChangeValue={value =>
											switchOnChange('limit', value)
										}
										disableReset={LimitOptions.disableReset}
										step={LimitOptions.steps}
										withInputField={
											LimitOptions.withInputField
										}
										onReset={() =>
											switchOnChange('limit', 0)
										}
										min={LimitOptions.min}
										max={LimitOptions.max}
										initialPosition={limitRef.current || 0}
									/>
								)}

								{fieldRef.current == 'date' && (
									<DateFormatting
										content={false}
										day={day}
										era={era}
										format={format}
										hour12={hour12}
										hour={hour}
										minute={minute}
										month={month}
										parentCallback={handleDateCallback}
										second={second}
										status={date}
										timeZone={timeZone}
										timeZoneName={timeZoneName}
										weekday={weekday}
										year={year}
										zone={zone}
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
