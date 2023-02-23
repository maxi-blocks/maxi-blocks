/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { useEffect, useState } from '@wordpress/element';
import { resolveSelect } from '@wordpress/data';

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
	getErrors,
	getCustomFormat,
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
		'dc-timezone': zone, // TODO: repeated!
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

	const [postAuthorOptions, setPostAuthorOptions] = useState(null);
	const [postIdOptions, setPostIdOptions] = useState(null);

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

		const newProps = {
			'dc-status': status,
			'dc-type': type,
			'dc-relation': relation,
			'dc-id': id,
			'dc-field': field,
			'dc-author': author,
			'dc-show': show,
			'dc-limit': limit,
			'dc-error': error,
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
			...params,
		};

		const hasChangesToSave = Object.entries(newProps).some(
			([key, val]) => dynamicContent[key] !== val
		);

		if (hasChangesToSave) onChange(newProps);
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

	const getIDOptions = async () => {
		const data = await getIdOptions(type, relation, author);

		if (!data) return null;

		const newValues = {};

		const newPostIdOptions = data.map(item => {
			if (['tags', 'categories'].includes(type)) {
				return {
					label: item.name,
					value: +item.id,
				};
			}

			return {
				label: `${item.id} - ${
					item[idOptionByField[type]]?.rendered ??
					item[idOptionByField[type]]
				}`,
				value: +item.id,
			};
		});

		if (!isEqual(newPostIdOptions, postIdOptions)) {
			if (isEmpty(newPostIdOptions)) {
				if (relation === 'author') newValues['dc-error'] = relation;

				if (['tags', 'media'].includes(type)) {
					newValues['dc-error'] = type;
					disabledType(type);
				}

				return { newValues, newPostIdOptions: [] };
			}
			if (relation === 'author') newValues['dc-error'] = '';

			// Ensures first post id is selected
			if (isEmpty(find(newPostIdOptions, { value: id }))) {
				newValues['dc-id'] = Number(data[0].id);
				idFields.current = data[0].id;
			}

			// Ensures first field is selected
			if (!field) newValues['dc-field'] = fieldOptions[type][0].value;

			return { newValues, newPostIdOptions };
		}

		return null;
	};

	const getContentValue = async (dataRequest, data) => {
		let contentValue;

		if (
			renderedFields.includes(dataRequest.field) &&
			!isNil(data[dataRequest.field]?.rendered) &&
			!['tags', 'categories'].includes(dataRequest.type)
		) {
			contentValue = data[dataRequest.field].rendered;
		} else {
			contentValue = data[dataRequest.field];
		}

		if (field === 'date') {
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

		return null;
	};

	const getContent = async dataRequest => {
		const { type, id } = dataRequest;

		const contentError = getErrors(type, error, show, relation);

		if (contentError) return contentError;

		if (type === 'users') {
			dataRequest.id = author ?? id;
		}

		const kindDictionary = {
			posts: 'postType',
			pages: 'postType',
			media: 'postType',
			settings: 'root',
			categories: 'taxonomy',
			tags: 'taxonomy',
		};
		const nameDictionary = {
			posts: 'post',
			pages: 'page',
			media: 'attachment',
			settings: '__unstableBase',
			categories: 'category',
			tags: 'post_tag',
		};

		if (type === 'users') {
			const { getUsers } = resolveSelect('core');

			const user = await getUsers({ p: author });

			return getContentValue(dataRequest, user[0]);
		}
		if (relationTypes.includes(type) && relation === 'random') {
			const randomEntity = await resolveSelect('core').getEntityRecords(
				kindDictionary[type],
				nameDictionary[type],
				{
					per_page: 100,
					hide_empty: false,
				}
			);

			return getContentValue(
				dataRequest,
				randomEntity[Math.floor(Math.random() * randomEntity.length)]
			);
		}
		if (type === 'settings') {
			const canEdit = await resolveSelect('core').canUser(
				'update',
				'settings'
			);
			const settings = canEdit
				? await resolveSelect('core').getEditedEntityRecord(
						kindDictionary[type],
						'site'
				  )
				: {};
			const readOnlySettings = await resolveSelect(
				'core'
			).getEntityRecord(kindDictionary[type], '__unstableBase');

			const siteEntity = canEdit ? settings : readOnlySettings;

			return getContentValue(dataRequest, siteEntity);
		}
		if (['tags', 'categories'].includes(type)) {
			const termsEntity = await resolveSelect('core').getEntityRecords(
				kindDictionary[type],
				nameDictionary[type],
				{
					per_page: 1,
					hide_empty: false,
					include: id,
				}
			);

			return getContentValue(dataRequest, termsEntity[0]);
		}

		// Get selected entity
		const entity = await resolveSelect('core').getEntityRecord(
			kindDictionary[type],
			nameDictionary[type] ?? type,
			id,
			{
				per_page: 1,
			}
		);

		if (entity) return getContentValue(dataRequest, entity);

		return null;
	};

	useEffect(async () => {
		// TODO: check if this code is necessary
		// On init, get post author options and set current user as default
		if (!postAuthorOptions) {
			const authors = await resolveSelect('core').getUsers({
				who: 'authors',
			});

			if (authors) {
				setPostAuthorOptions(
					authors.map(({ id, name }) => ({
						label: `${id} - ${name}`,
						value: id,
					}))
				);

				const { id } = await resolveSelect('core').getCurrentUser();

				updateState({ 'dc-author': id });
			}
		}

		let newDataRequest;
		let newPostIdOptions;

		// Sets new content
		if (status && relationTypes.includes(type)) {
			const postIDSettings = await getIDOptions();

			if (postIDSettings) {
				const { newValues, newPostIdOptions: rawNewPostIdOptions } =
					postIDSettings;

				newDataRequest = newValues;
				newPostIdOptions = rawNewPostIdOptions;
			}
		}

		const dataRequest = { type, id, field };

		if (newDataRequest) {
			if ('dc-id' in newDataRequest)
				dataRequest.id = newDataRequest['dc-id'];
			if ('dc-field' in newDataRequest)
				dataRequest.field = newDataRequest['dc-field'];
		}

		// Sets new content
		if (
			status &&
			!isNil(dataRequest.type) &&
			!isNil(dataRequest.field) &&
			(!isNil(dataRequest.id) || type === 'settings') // id is not necessary for site settings
		) {
			const newContent = sanitizeContent(await getContent(dataRequest));

			if (newContent !== content)
				return changeProps({
					'dc-content': newContent,
					...(dataRequest.field === 'date' && {
						'dc-custom-format': getCustomFormat(newContent),
					}),
					...newDataRequest,
				});
		} else if (!isEmpty(newDataRequest)) return changeProps(newDataRequest);

		if (
			!isNil(newPostIdOptions) &&
			!isEqual(postIdOptions, newPostIdOptions)
		)
			setPostIdOptions(newPostIdOptions);

		return null;
	});

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
					onChange={value => updateState({ 'dc-status': value })}
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

									updateState({
										'dc-type': value,
										'dc-show': 'current',
										'dc-error': '',
										...dcFieldActual,
									});
								}}
							/>
						)}
						{isEmpty(postIdOptions) && type !== 'settings' ? (
							<p>{__('This type is empty', 'maxi-blocks')}</p>
						) : (
							<>
								{!isCustomDate && relationTypes.includes(type) && (
									<SelectControl
										label={__('Relation', 'maxi-blocks')}
										value={relation}
										options={relationOptions[type]}
										onChange={value =>
											updateState({
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
												updateState({
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
											options={postIdOptions}
											onChange={value =>
												updateState({
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
											!isEmpty(postIdOptions)) ||
										['date', 'modified', 'random'].includes(
											relation
										)) && (
										<SelectControl
											label={__('Field', 'maxi-blocks')}
											value={field}
											options={fieldOptions[type]}
											onChange={value =>
												updateState({
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
												updateState({
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
												updateState({
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
