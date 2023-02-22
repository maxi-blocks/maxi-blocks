/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import {
	useEffect,
	useLayoutEffect,
	useRef,
	useState,
} from '@wordpress/element';
import { select } from '@wordpress/data';

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
	sanitizeContent,
	limitFormat,
	processDate,
	getSimpleText,
	getIdOptions,
	validationsValues,
	getAuthorByID,
} from './utils';
import {
	renderedFields,
	typeOptions,
	fieldOptions,
	idFields,
	idOptionByField,
	relationOptions,
	relationTypes,
	limitOptions,
	descriptionOfErrors,
} from './constants';

/**
 * External dependencies
 */
import { find, isEmpty, isFinite, isNil, capitalize, isEqual } from 'lodash';

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
		'dc-content': content,
		'dc-custom-date': isCustomDate,
		'dc-day': day,
		'dc-era': era,
		'dc-format': format,
		'dc-hour': hour,
		'dc-hour12': hour12,
		'dc-minute': minute,
		'dc-month': month,
		'dc-second': second,
		'dc-locale': locale,
		'dc-timezone': timeZone,
		'dc-timezone-name': timeZoneName,
		'dc-weekday': weekday,
		'dc-year': year,
		'dc-timezone': zone,
	} = dynamicContent;

	const [status, setStatus] = useState(dynamicContent['dc-status']);
	const [type, setType] = useState(dynamicContent['dc-type']);
	const [relation, setRelation] = useState(dynamicContent['dc-relation']);
	const [id, setId] = useState(dynamicContent['dc-id']);
	const [field, setField] = useState(dynamicContent['dc-field']);
	const [author, setAuthor] = useState(dynamicContent['dc-author']);
	const [show, setShow] = useState(dynamicContent['dc-show']);
	const [limit, setLimit] = useState(dynamicContent['dc-limit']);
	const [error, setError] = useState(dynamicContent['dc-error']);

	const [isEmptyIdOptions, setIsEmptyIdOptions] = useState(true);
	const [postAuthorOptions, setPostAuthorOptions] = useState(null);
	const [postIdOptions, setPostIdOptions] = useState(null);
	const [possibleContent, setPossibleContent] = useState(null);

	const isLoading = useRef(false);

	const updateState = params => {
		const paramFn = {
			'dc-status': setStatus,
			'dc-type': setType,
			'dc-relation': setRelation,
			'dc-id': setId,
			'dc-field': setField,
			'dc-author': setAuthor,
			'dc-show': setShow,
			'dc-limit': setLimit,
			'dc-error': setError,
		};
		const paramValues = {
			'dc-status': status,
			'dc-type': type,
			'dc-relation': relation,
			'dc-id': id,
			'dc-field': field,
			'dc-author': author,
			'dc-show': show,
			'dc-limit': limit,
			'dc-error': error,
		};

		Object.entries(params).forEach(([key, val]) => {
			if (paramFn[key] && paramValues[key] !== val) paramFn[key](val);
		});
	};

	const changeProps = (params, updateStates = true) => {
		if (updateStates) updateState(params);

		onChange(params);
	};

	const disabledType = (valueType, thisType = 'type') => {
		const hide = options =>
			Object.keys(options).forEach(key => {
				if (options[key].value === valueType) {
					options[key].disabled = true;
				}
			});

		hide(thisType === 'relation' ? relationOptions : typeOptions);
	};

	const setIdOptions = (
		thisType = type,
		defaultValues = {},
		thisRelation = relation
	) => {
		isLoading.current = true;

		const data = getIdOptions(
			thisType,
			defaultValues,
			thisRelation,
			author
		).then(data => {
			if (!data) return null;

			// Set default values in case they are not defined
			// const relation = defaultValues['dc-relation'] ?? relation;
			const {
				'dc-relation': optRelation = relation,
				'dc-type': optType = type,
				'dc-id': optId = id,
			} = defaultValues;

			const newPostIdOptions = data.map(item => {
				return {
					label: `${item.id} - ${
						item[idOptionByField[thisType]]?.rendered ??
						item[idOptionByField[thisType]]
					}`,
					value: +item.id,
				};
			});

			if (isEmpty(newPostIdOptions)) {
				if (optRelation === 'author')
					defaultValues['dc-error'] = optRelation;

				if (['tags', 'media'].includes(optType)) {
					defaultValues['dc-error'] = optType;
					disabledType(thisType);
				}

				setIsEmptyIdOptions(true);
				if (!isEmpty(defaultValues)) changeProps(defaultValues);
			} else {
				if (optRelation === 'author') changeProps({ 'dc-error': '' });

				setIsEmptyIdOptions(false);
				setPostIdOptions(newPostIdOptions);

				// Ensures first post id is selected
				if (isEmpty(find(newPostIdOptions, { value: optId }))) {
					defaultValues['dc-id'] = Number(data[0].id);
					idFields.current = data[0].id;
				}

				// Ensures first field is selected
				if (!field)
					defaultValues['dc-field'] = fieldOptions[optType][0].value;

				if (!isEmpty(defaultValues)) updateState(defaultValues);
			}

			isLoading.current = false;

			return newPostIdOptions;
		});

		return data;
	};

	const getContent = (dataRequest, data) => {
		const { type, id } = dataRequest;
		if (type === 'users') {
			dataRequest.id = author ?? id;
		}

		if (type === 'posts' && error === 'next' && show === 'next') {
			return descriptionOfErrors.next;
		}

		if (
			type === 'posts' &&
			error === 'previous' &&
			relation === 'previous'
		) {
			return descriptionOfErrors.previous;
		}

		if (error === 'author' && relation === 'author') {
			return descriptionOfErrors.author;
		}

		if (type === 'media' && error === 'media') {
			return descriptionOfErrors.media;
		}

		if (type === 'tags' && error === 'tags') {
			return descriptionOfErrors.tags;
		}

		if (relationTypes.includes(type) && relation === 'random') {
			// TODO: get random entity
			// return apiFetch({
			// 	path: `/wp/v2/${type}/${firstSeparator}thisFields=id&per_page=99&orderby=${
			// 		randomOptions[type][
			// 			random(randomOptions[type].length - 1)
			// 		]
			// 	}`,
			// })
			// 	.then(res => {
			// 		if (typeof res[0] === 'object' && 'id' in res[0]) {
			// 			return res;
			// 		}
			// 		throw new Error(descriptionOfErrors.object);
			// 	})
			// 	.then(
			// 		res =>
			// 			requestContent({
			// 				...dataRequest,
			// 				id: res[random(res.length - 1)].id,
			// 			}),
			// 		error => console.error(error)
			// 	);
		}

		if (data) {
			let contentValue;
			if (data.id) updateState({ 'dc-id': Number(data.id) });

			if (
				renderedFields.includes(dataRequest.field) &&
				!isNil(data[dataRequest.field]?.rendered)
			) {
				contentValue = data[dataRequest.field].rendered;
			} else if (dataRequest.field === 'author') {
				const authorId = getAuthorByID(data[dataRequest.field]);
				contentValue = authorId.then(value => value);
			} else {
				contentValue = data[dataRequest.field];
			}

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

			if (field === 'date') {
				contentValue = processDate(
					contentValue,
					isCustomDate,
					format,
					locale,
					options
				);
			} else if (field === 'excerpt') {
				contentValue = limitFormat(contentValue, limit);
			} else if (field === 'content') {
				contentValue = limitFormat(getSimpleText(contentValue), limit);
			}

			if (contentValue) {
				return contentValue;
			}
		}

		return null;
	};

	useEffect(() => {
		const { getUsers, getCurrentUser } = select('core');

		// On init, get post author options and set current user as default
		if (!postAuthorOptions) {
			const authors = getUsers({ who: 'authors' });

			if (authors) {
				setPostAuthorOptions(
					authors.map(({ id, name }) => ({
						label: `${id} - ${name}`,
						value: id,
					}))
				);

				const { id } = getCurrentUser();

				updateState({ 'dc-author': id });
			}
		}
	});

	useEffect(() => {
		const dictionary = {
			posts: 'post',
			pages: 'page',
			media: 'attachment',
			settings: '__unstableBase',
		};

		const kind = type !== 'settings' ? 'postType' : 'root';
		const name = dictionary[type] ?? type;
		let key = type === 'settings' ? null : id;

		// Ensures first post id is selected
		if (postIdOptions && isEmpty(find(postIdOptions, { value: id })))
			key = Number(postIdOptions[0].id);

		if (isLoading.current) return;

		const { getEntityRecord } = select('core');

		const entity = getEntityRecord(kind, name, key, {
			per_page: 1,
		});

		if (entity) {
			if (!isEqual(entity, possibleContent)) setPossibleContent(entity);

			// Sets new content
			if (status && !!id && !!type && !!field && !isLoading.current) {
				const newContent = sanitizeContent(
					getContent({ type, id, field }, entity)
				);

				if (newContent !== content)
					onChange({
						'dc-content': newContent,
					});
			}
		}
	});

	useLayoutEffect(() => {
		if (relation === 'by-id') setIdOptions(type, {}, relation);
	}, [status, type, relation, author]);

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

	if (blockName !== 'maxi-blocks/text-maxi') return null;

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
					onChange={value => changeProps({ 'dc-status': value })}
				/>
				{status && (
					<>
						{!isCustomDate && (
							<SelectControl
								label={__('Type', 'maxi-blocks')}
								value={type}
								options={typeOptions}
								onChange={value => {
									const dcFieldActual = validationsValues(
										value,
										field
									);

									changeProps({
										'dc-type': value,
										'dc-show': 'current',
										'dc-error': '',
										...dcFieldActual,
									});
								}}
							/>
						)}
						{!postIdOptions && type !== 'settings' ? (
							<p>{__('This type is empty', 'maxi-blocks')}</p>
						) : (
							<>
								{!isCustomDate && relationTypes.includes(type) && (
									<SelectControl
										label={__('Relation', 'maxi-blocks')}
										value={relation}
										options={relationOptions[type]}
										onChange={value =>
											changeProps({
												'dc-relation': value,
												'dc-show': 'current',
												'dc-error': '',
											})
										}
									/>
								)}
								{!isCustomDate &&
									relationTypes.includes(type) &&
									type === 'users' && (
										<SelectControl
											label={__(
												'Author id',
												'maxi-blocks'
											)}
											value={author}
											options={postAuthorOptions}
											onChange={value =>
												changeProps({
													'dc-author': Number(value),
												})
											}
										/>
									)}
								{!isCustomDate &&
									relationTypes.includes(type) &&
									type !== 'users' &&
									['author', 'by-id'].includes(relation) && (
										<SelectControl
											label={__(
												`${capitalize(type)} id`,
												'maxi-blocks'
											)}
											value={id}
											options={
												!isEmptyIdOptions
													? postIdOptions
													: {}
											}
											onChange={value =>
												changeProps({
													'dc-error': '',
													'dc-show': 'current',
													'dc-id': Number(value),
												})
											}
										/>
									)}
								{!isCustomDate &&
									(['settings'].includes(type) ||
										(relation === 'by-id' &&
											isFinite(id)) ||
										(relation === 'author' &&
											!isEmptyIdOptions) ||
										['date', 'modified', 'random'].includes(
											relation
										)) && (
										<SelectControl
											label={__('Field', 'maxi-blocks')}
											value={field}
											options={fieldOptions[type]}
											onChange={value =>
												changeProps({
													'dc-field': value,
												})
											}
										/>
									)}
								{['excerpt', 'content'].includes(field) &&
									!error && (
										<AdvancedNumberControl
											label={__(
												'Character limit',
												'maxi-blocks'
											)}
											value={limit}
											onChangeValue={value =>
												changeProps({
													'dc-limit': Number(value),
												})
											}
											disableReset={
												limitOptions.disableReset
											}
											step={limitOptions.steps}
											withInputField={
												limitOptions.withInputField
											}
											onReset={() =>
												changeProps({
													'dc-limit': Number(
														limitOptions.defaultValue ||
															'150'
													),
												})
											}
											min={limitOptions.min}
											max={limitOptions.max}
											initialPosition={
												limit ||
												limitOptions.defaultValue
											}
										/>
									)}

								{field === 'date' && !error && (
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
