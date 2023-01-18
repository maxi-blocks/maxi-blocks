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
import { formatDateOptions } from '../date-formatting/utils';
import SelectControl from '../../../select-control';
import ToolbarPopover from '../toolbar-popover';
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
	limitFormat,
	cutTags,
	processDate,
	getParametersFirstSeparator,
} from './utils';

/**
 * External dependencies
 */
import {
	find,
	isArray,
	isEmpty,
	isFinite,
	isNil,
	random,
	capitalize,
} from 'lodash';

/**
 * Styles & Icons
 */
import './editor.scss';
import { toolbarDynamicContent } from '../../../../icons';

/**
 * Dynamic Content
 */

const DynamicContent = props => {
	const { blockName, onChange, ...dynamicContent } = props;

	const {
		'dc-author': author,
		'dc-content': content,
		'dc-custom-date': isCustomDate,
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
		'dc-locale': locale,
		'dc-timezone': timeZone,
		'dc-timezone-name': timeZoneName,
		'dc-type': type,
		'dc-weekday': weekday,
		'dc-year': year,
		'dc-timezone': zone,
	} = dynamicContent;

	const alterIdRef = useRef(null);
	const authorRef = useRef(author);
	const fieldRef = useRef(field);
	const idRef = useRef(id);
	const limitRef = useRef(limit);
	const relationRef = useRef(relation);
	const showRef = useRef(show);
	const statusRef = useRef(status);
	const typeRef = useRef(type);
	// eslint-disable-next-line no-unused-vars
	const errorRef = useRef(error);

	const [isEmptyIdOptions, setIsEmptyIdOptions] = useState(true);
	const [postAuthorOptions, setPostAuthorOptions] = useState(null);
	const [postIdOptions, setPostIdOptions] = useState(null);
	const [firstSeparator, setFirstSeparator] = useState('?');

	const changeProps = params => {
		Object.keys(params).forEach(key => {
			const value = params[key];
			// eslint-disable-next-line no-eval
			eval(`${key.replace('dc-', '')}Ref`).current = value;
		});
		onChange(params);
	};

	const validationsValues = variableValue => {
		const result = fieldOptions[variableValue].map(x => x.value);
		return result.includes(field) ? {} : { 'dc-field': result[0] };
	};

	const handleDateCallback = childData => {
		onChange({
			'dc-custom-date': childData.status,
			'dc-locale': childData.locale,
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
		});
	};

	const options = formatDateOptions({
		day,
		era,
		hour,
		hour12,
		minute,
		month,
		second,
		timeZone,
		timeZoneName,
		weekday,
		year,
	});

	const disabledType = (valueType, thisType = 'type') => {
		const hide = options =>
			Object.keys(options).forEach(key => {
				if (options[key].value === valueType) {
					options[key].disabled = true;
				}
			});
		hide(thisType === 'relation' ? relationOptions : typeOptions);
	};

	const setAuthorDefault = async () => {
		if (author) return false;
		return apiFetch({
			path: '/wp/v2/users/me',
		})
			.catch(err => console.error(err))
			.then(res => changeProps({ 'dc-author': Number(res.id) }));
	};

	const getFirstSeparator = async () => {
		let separator = '';
		await apiFetch({
			path: 'maxi-blocks/v1.0/rest-url',
		})
			.catch(err => console.error(err))
			.then(url => {
				separator = getParametersFirstSeparator(url);
				setFirstSeparator(separator);
			});
		return separator;
	};

	const setAuthorList = async firstSeparator => {
		if (!postAuthorOptions) {
			apiFetch({
				path: `/wp/v2/users${firstSeparator}per_page=99&thisFields=id, name`,
			})
				.catch(err => console.error(err))
				.then(result => {
					const newPostAuthorOptions = result.map(item => {
						return {
							label: `${item.id} - ${
								item[idOptionByField.author]?.rendered ??
								item[idOptionByField.author]
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

	const setIdList = (result, defaultValues = {}, thisType) => {
		// Set default values in case they are not defined

		const relation = defaultValues['dc-relation'] ?? relationRef.current;
		const type = defaultValues['dc-type'] ?? typeRef.current;
		const id = defaultValues['dc-id'] ?? idRef.current;

		const newPostIdOptions = result.map(item => {
			return {
				label: `${item.id} - ${
					item[idOptionByField[thisType]]?.rendered ??
					item[idOptionByField[thisType]]
				}`,
				value: +item.id,
			};
		});

		if (isEmpty(newPostIdOptions)) {
			if (relation === 'author') defaultValues['dc-error'] = relation;

			if (['tags', 'media'].includes(type)) {
				defaultValues['dc-error'] = type;
				disabledType(thisType);
			}

			setIsEmptyIdOptions(true);
			if (!isEmpty(defaultValues)) changeProps(defaultValues);
		} else {
			if (relation === 'author') changeProps({ 'dc-error': '' });

			setIsEmptyIdOptions(false);
			setPostIdOptions(newPostIdOptions);

			// Ensures first post id is selected
			if (isEmpty(find(newPostIdOptions, { value: id }))) {
				defaultValues['dc-id'] = Number(result[0].id);
				idFields.current = result[0].id;
			}

			// Ensures first field is selected
			if (!fieldRef.current)
				defaultValues['dc-field'] = fieldOptions[type][0].value;

			if (!isEmpty(defaultValues)) changeProps(defaultValues);
		}
		return newPostIdOptions;
	};

	const getAuthorByID = async thisId =>
		apiFetch({ path: `/wp/v2/users/${thisId}` }).then(
			author => author.name ?? 'No name'
		);

	const changeContent = async (
		thisType,
		thisShow,
		thisId,
		thisDefault = {}
	) => {
		if (
			relationTypes.includes(typeRef.current) &&
			['previous', 'next'].includes(thisShow)
		) {
			const prevNextPath = `/wp/v2/${thisType}/${thisId}${firstSeparator}thisFields=${thisShow}`;
			return apiFetch({
				path: prevNextPath,
			})
				.catch(rej => console.error(rej))
				.then(res => {
					if (
						typeof res[thisShow] === 'object' &&
						res[thisShow] !== null &&
						'id' in res[thisShow]
					) {
						changeProps({ 'dc-error': '', ...thisDefault });
						if (isFinite(res[thisShow].id)) {
							return res[thisShow].id;
						}
					} else {
						changeProps({ 'dc-error': thisShow, ...thisDefault });
					}
					return null;
				});
		}
		if (!isEmpty(thisDefault)) {
			changeProps(thisDefault);
		}
		return false;
	};

	const getContentPath = (thisType, thisId, thisField) => {
		const getForShow = async () => {
			let result;
			switch (showRef.current) {
				case 'next':
				case 'previous':
					result = await changeContent(
						thisType,
						showRef.current,
						thisId
					).then(res => res);
					return result;
				case 'current':
				default:
					return thisId;
			}
		};

		const getForRelation = async () => {
			const res = await getForShow(thisType, thisId, thisField);
			if (typeof res === 'number') {
				alterIdRef.current = res;
			} else {
				changeProps({ 'dc-error': showRef.current });
				alterIdRef.current = null;
			}
			switch (relationRef.current) {
				case 'author':
					return `/wp/v2/${thisType}/${
						alterIdRef.current ? alterIdRef.current : thisId
					}${firstSeparator}thisFields=${thisField}`;
				case 'date':
				case 'modified':
					if (
						!['previous', 'next'].includes(showRef.current) ||
						!alterIdRef.current
					) {
						return `/wp/v2/${thisType}${firstSeparator}orderby=${relationRef.current}&per_page=1&thisFields=${thisField},id`;
					}
					return `/wp/v2/${thisType}/${
						alterIdRef.current ? alterIdRef.current : thisId
					}${firstSeparator}thisFields=${thisField}`;

				case 'random':
					return `/wp/v2/${thisType}/${firstSeparator}thisFields=${thisField}&per_page=99&orderby=${
						randomOptions[thisType][
							random(randomOptions[typeRef.current].length - 1)
						]
					}`;
				case 'by-id':
				default:
					return `/wp/v2/${thisType}/${
						alterIdRef.current ? alterIdRef.current : thisId
					}${firstSeparator}thisFields=${thisField}`;
			}
		};

		const getForType = async () => {
			let resultRelation;
			switch (thisType) {
				case relationTypes.includes(thisType) ? thisType : false:
					resultRelation = await getForRelation();
					return resultRelation;
				case 'users':
					return `/wp/v2/${thisType}/${
						authorRef.current ? authorRef.current : thisId
					}/${firstSeparator}thisFields=${thisField}`;
				case 'settings':
				default:
					return `/wp/v2/${thisType}${firstSeparator}thisFields=${thisField}`;
			}
		};

		return getForType();
	};

	const requestContent = async dataRequest => {
		const { type: thisType, id: thisId, field: thisField } = dataRequest;
		return apiFetch({
			path: await getContentPath(thisType, thisId, thisField),
		})
			.catch(err => console.error(err))
			.then(result => {
				const content = isArray(result) ? result[0] : result;
				if (content) {
					let contentValue;
					if (content.id)
						changeProps({ 'dc-id': Number(content.id) });

					if (
						renderedFields.includes(thisField) &&
						!isNil(content[thisField]?.rendered)
					) {
						contentValue = content[thisField].rendered;
					} else if (thisField === 'author') {
						const authorId = getAuthorByID(content[thisField]);
						contentValue = authorId.then(value => value);
					} else {
						contentValue = content[thisField];
					}

					if (fieldRef.current === 'date') {
						contentValue = processDate(
							contentValue,
							isCustomDate,
							format,
							locale,
							options
						);
					} else if (fieldRef.current === 'excerpt') {
						contentValue = limitFormat(
							contentValue,
							limitRef.current
						);
					}
					return contentValue;
				}
				return null; // TODO: needs to handle empty posts(type)
			});
	};

	const getContent = async dataRequest => {
		const { type, id } = dataRequest;
		if (typeRef.current === 'users') {
			dataRequest.id = authorRef.current ?? id;
		}

		if (
			type === 'posts' &&
			error === 'next' &&
			showRef.current === 'next'
		) {
			return descriptionOfErrors.next;
		}

		if (
			type === 'posts' &&
			error === 'previous' &&
			relationRef.current === 'previous'
		) {
			return descriptionOfErrors.previous;
		}

		if (error === 'author' && relationRef.current === 'author') {
			return descriptionOfErrors.author;
		}

		if (type === 'media' && error === 'media') {
			return descriptionOfErrors.media;
		}

		if (type === 'tags' && error === 'tags') {
			return descriptionOfErrors.tags;
		}

		if (
			relationTypes.includes(typeRef.current) &&
			relationRef.current === 'random'
		) {
			return apiFetch({
				path: `/wp/v2/${type}/${firstSeparator}thisFields=id&per_page=99&orderby=${
					randomOptions[typeRef.current][
						random(randomOptions[typeRef.current].length - 1)
					]
				}`,
			})
				.then(res => {
					if (typeof res[0] === 'object' && 'id' in res[0]) {
						return res;
					}
					throw new Error(descriptionOfErrors.object);
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
		return requestContent(dataRequest);
	};

	const getIdOptionsPath = (thisType, thisUsers = null) => {
		const path =
			thisType === 'users'
				? `/wp/v2/users${firstSeparator}per_page=99&thisFields=id, name`
				: thisUsers
				? `/wp/v2/${thisType}/${firstSeparator}author=${thisUsers}&thisFields=id, ${idOptionByField[thisType]}`
				: `/wp/v2/${thisType}${firstSeparator}thisFields=id, ${idOptionByField[thisType]}`;
		return path;
	};

	const setIdOptions = async (thisType, thisDefault, thisRelation) => {
		if (thisRelation === 'author' && !authorRef.current) return false;
		return apiFetch({
			path: getIdOptionsPath(
				thisType,
				thisDefault.author
					? thisDefault['dc-author']
					: thisRelation === 'author'
					? authorRef.current
					: null
			),
		})
			.catch(err => console.error(err)) // TODO: need a good error handler
			.then(result => setIdList(result, thisDefault, thisType));
	};

	const getIdOptions = async (
		thisType = typeRef.current,
		thisDefault = {},
		thisRelation = relationRef.current
	) => {
		if (idFields.includes(thisType)) {
			return setIdOptions(thisType, thisDefault, thisRelation)
				.catch(rej => console.error(rej))
				.then(res => res);
		}
		return [];
	};
	const switchOnChange = (thisType, thisValue) => {
		let dcFieldActual;
		let changeOptions;

		switch (thisType) {
			case 'status':
				changeProps({ 'dc-status': thisValue });
				if (thisValue) getIdOptions();
				break;
			case 'type':
				dcFieldActual = validationsValues(thisValue);
				changeOptions = {
					'dc-type': thisValue,
					'dc-show': 'current',
					'dc-error': '',
					...dcFieldActual,
				};
				idFields.includes(thisValue)
					? getIdOptions(
							thisValue,
							changeOptions,
							relationRef.current
					  )
					: changeProps(changeOptions);
				break;
			case 'relation':
				getIdOptions(
					typeRef.current,
					{
						'dc-relation': thisValue,
						'dc-show': 'current',
						'dc-error': '',
					},
					thisValue
				);
				break;
			case 'author':
				getIdOptions(
					typeRef.current,
					{ 'dc-author': Number(thisValue) },
					relationRef.current
				);
				break;
			case 'id':
				changeProps({
					'dc-error': '',
					'dc-show': 'current',
					'dc-id': Number(thisValue),
				});
				break;
			case 'show':
				changeContent(typeRef.current, thisValue, idRef.current, {
					'dc-show': thisValue,
				});
				break;
			case 'field':
				changeProps({ 'dc-field': thisValue });
				break;
			case 'limit':
				changeProps({ 'dc-limit': Number(thisValue) });
				break;
			default:
				break;
		}
	};

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
		isCustomDate,
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
		locale,
		timeZone,
		timeZoneName,
		type,
		weekday,
		year,
	]);

	if (blockName !== 'maxi-blocks/text-maxi') return null;

	const initDynamicContent = async () => {
		await getFirstSeparator().then(separator => {
			setAuthorList(separator);
			setAuthorDefault();
			if (typeRef.current && isEmpty(postIdOptions) && isEmptyIdOptions) {
				getIdOptions(typeRef.current, {}, relationRef.current)
					?.catch(rej => console.error(rej))
					?.then(res => res);
			}
		});
	};

	statusRef.current && initDynamicContent();

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
						{!isCustomDate && (
							<SelectControl
								label={__('Type', 'maxi-blocks')}
								value={typeRef.current}
								options={typeOptions}
								onChange={value =>
									switchOnChange('type', value)
								}
							/>
						)}
						{!postIdOptions && type !== 'settings' ? (
							<p>{__('This type is empty', 'maxi-blocks')}</p>
						) : (
							<>
								{!isCustomDate &&
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
								{!isCustomDate &&
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
								{!isCustomDate &&
									relationTypes.includes(typeRef.current) &&
									typeRef.current !== 'users' &&
									['author', 'by-id'].includes(
										relationRef.current
									) && (
										<SelectControl
											label={__(
												`${capitalize(
													typeRef.current
												)} id`,
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
								{!isCustomDate &&
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
								{!isCustomDate &&
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
								{fieldRef.current === 'excerpt' && !error && (
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
										max={cutTags(content).trim().length}
										initialPosition={limitRef.current || 0}
									/>
								)}

								{fieldRef.current === 'date' && !error && (
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
										status={isCustomDate}
										locale={locale}
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
