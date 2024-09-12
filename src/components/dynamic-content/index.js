/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import {
	useCallback,
	useContext,
	useEffect,
	useMemo,
	useState,
} from '@wordpress/element';
import { resolveSelect, useSelect, select } from '@wordpress/data';
import { Popover } from '@wordpress/components';

/**
 * External dependencies
 */
import { isEmpty, isFinite, isNil, capitalize, isEqual } from 'lodash';
import classnames from 'classnames';
import loadable from '@loadable/component';

/**
 * Internal dependencies
 */
const AdvancedNumberControl = loadable(() =>
	import('../advanced-number-control')
);
const SelectControl = loadable(() => import('../select-control'));
const ToggleSwitch = loadable(() => import('../toggle-switch'));
const TextControl = loadable(() => import('../text-control'));

import {
	getFields,
	validationsValues,
	getRelationOptions,
	getCurrentTemplateSlug,
} from '../../extensions/DC/utils';
import {
	fieldOptions,
	limitOptions,
	limitFields,
	orderOptions,
	orderByOptions,
	orderByRelations,
	orderRelations,
	sourceOptions,
	ignoreEmptyFields,
} from '../../extensions/DC/constants';
import getDCOptions from '../../extensions/DC/getDCOptions';
import DateFormatting from './custom-date-formatting';
import { getDefaultAttribute } from '../../extensions/styles';
import { getUpdatedImgSVG } from '../../extensions/svg';
import ACFSettingsControl from './acf-settings-control';
import { getDCValues, LoopContext } from '../../extensions/DC';
import getTypes from '../../extensions/DC/getTypes';
import showStaticOption from '../../extensions/DC/showStaticOption';

/**
 * Styles
 */
import './editor.scss';

/**
 * Dynamic Content
 */
const UnlimitedCharacterPopover = ({ message }) => (
	<Popover className='maxi-info-helper-popover maxi-popover-button'>
		<p>{message}</p>
	</Popover>
);
const DynamicContent = props => {
	const {
		className,
		contentType = 'text',
		blockName,
		uniqueID,
		SVGData,
		SVGElement,
		mediaID,
		mediaURL,
		onChange,
		disableHideOnFrontend = false,
		...dynamicContent
	} = props;

	const contextLoop = useContext(LoopContext)?.contextLoop;
	const CLStatus = contextLoop ? contextLoop['cl-status'] === true : false;

	const [postAuthorOptions, setPostAuthorOptions] = useState(null);
	const [postIdOptions, setPostIdOptions] = useState(null);
	const [postTypesOptions, setPostTypesOptions] = useState(null);
	const [isCustomTaxonomyField, setIsCustomTaxonomyField] = useState(false);

	const { relationTypes, orderTypes, limitTypes } = useSelect(select => {
		const { getRelationTypes, getOrderTypes, getLimitTypes } = select(
			'maxiBlocks/dynamic-content'
		);
		return {
			relationTypes: getRelationTypes(),
			orderTypes: getOrderTypes(),
			limitTypes: getLimitTypes(),
		};
	}, []);

	const classes = classnames('maxi-dynamic-content', className);

	const dcValues = getDCValues(dynamicContent, contextLoop);

	const {
		status,
		hide,
		source,
		type,
		relation,
		id,
		field,
		author,
		limit,
		delimiterContent,
		customDelimiterStatus,
		error,
		order,
		orderBy,
		accumulator,
		imageAccumulator,
		acfFieldType,
		linkTarget,
		customDate,
		day,
		era,
		format,
		hour,
		hour12,
		minute,
		month,
		second,
		locale,
		timezone,
		timezoneName,
		weekday,
		year,
		customFormat,
		acfGroup,
		mediaSize,
	} = dcValues;

	const dcValuesForDate = {
		'dc-custom-date': customDate,
		'dc-day': day,
		'dc-era': era,
		'dc-format': format,
		'dc-hour': hour,
		'dc-hour12': hour12,
		'dc-minute': minute,
		'dc-month': month,
		'dc-second': second,
		'dc-locale': locale,
		'dc-timezone': timezone,
		'dc-timezone-name': timezoneName,
		'dc-weekday': weekday,
		'dc-year': year,
		'dc-custom-format': customFormat,
	};

	const delimiterOptions = [
		{ label: __('None', 'maxi-blocks'), value: '' },
		{ label: __('Comma', 'maxi-blocks'), value: ',' },
		{ label: __('Semicolon', 'maxi-blocks'), value: ';' },
		{ label: __('Custom', 'maxi-blocks'), value: 'custom' },
	];

	const currentFieldOptions = useMemo(
		() => getFields(contentType, type),
		[contentType, type]
	);

	const changeProps = params => {
		let hasChangesToSave = false;

		for (const [key, val] of Object.entries(params)) {
			if (key in dynamicContent && dynamicContent[key] !== val) {
				hasChangesToSave = true;
				break;
			}
		}

		if (hasChangesToSave) {
			const filteredObj = Object.fromEntries(
				Object.entries(params).filter(
					([key, value]) => value !== undefined
				)
			);
			onChange(filteredObj);
		}
	};

	const fetchDcData = useCallback(async () => {
		try {
			// On init, get post author options and set current user as default
			if (!postAuthorOptions) {
				const authors = await resolveSelect('core').getUsers({
					who: 'authors',
				});

				if (authors) {
					const authorOptions = authors.map(({ id, name }) => ({
						label: `${id} - ${name}`,
						value: id,
					}));
					setPostAuthorOptions(authorOptions);

					if (contentType !== 'image' && !author) {
						const { id } = await resolveSelect(
							'core'
						).getCurrentUser();
						changeProps({ 'dc-author': id });
					}
				}
			}

			// Sets new content if the status and type match the relation types
			if (status && relationTypes.includes(type)) {
				const dataRequest = {
					type,
					id,
					field,
					postIdOptions,
					relation,
					author,
				};

				const postIDSettings = await getDCOptions(
					dataRequest,
					postIdOptions,
					contentType,
					false,
					contextLoop
				);

				if (postIDSettings) {
					const { newValues, newPostIdOptions } = postIDSettings;

					changeProps(newValues);

					if (
						!isNil(newPostIdOptions) &&
						!isEqual(postIdOptions, newPostIdOptions)
					) {
						setPostIdOptions(newPostIdOptions);
					}
				}
			}
		} catch (error) {
			console.error('Error fetching DC data:', error);
		}
	}, [
		author,
		contentType,
		contextLoop,
		field,
		id,
		postAuthorOptions,
		postIdOptions,
		relation,
		relationTypes,
		status,
		type,
	]);

	const currentTemplateType = getCurrentTemplateSlug();

	const currentRelationOptions = useMemo(
		() => getRelationOptions(type, contentType, currentTemplateType),
		[contentType, type, currentTemplateType]
	);

	useEffect(() => {
		const postTypes =
			getTypes(
				source === 'wp' ? contentType : source,
				true,
				currentTemplateType
			) || [];

		setPostTypesOptions(postTypes);
	}, [contentType, source, currentTemplateType]);

	useEffect(() => {
		if (source === 'acf' && typeof acf === 'undefined') {
			const validatedAttributes = validationsValues(
				type,
				field,
				relation,
				contentType,
				undefined,
				linkTarget
			);

			changeProps({
				'dc-source': 'wp',
				'dc-show': 'current',
				'dc-error': '',
				...validatedAttributes,
			});
		}
	}, []);

	const customTaxonomies = select(
		'maxiBlocks/dynamic-content'
	).getCustomTaxonomies();

	useEffect(() => {
		setIsCustomTaxonomyField(customTaxonomies.includes(field));
	}, [field, type]);

	useEffect(() => {
		fetchDcData().catch(console.error);
	}, [fetchDcData]);

	return (
		<div className={classes}>
			<ToggleSwitch
				label={__('Use dynamic content', 'maxi-blocks')}
				selected={status}
				onChange={value =>
					changeProps({
						'dc-status': value,
						...(blockName === 'maxi-blocks/image-maxi' &&
							!value &&
							SVGElement &&
							getUpdatedImgSVG(uniqueID, SVGData, SVGElement, {
								id: mediaID,
								url: mediaURL,
							})),
					})
				}
			/>
			{status && (
				<>
					{!disableHideOnFrontend &&
						!ignoreEmptyFields.includes(field) &&
						!CLStatus && (
							<ToggleSwitch
								label={__(
									'Hide if no content found on frontend',
									'maxi-blocks'
								)}
								selected={hide}
								onChange={value =>
									changeProps({ 'dc-hide': value })
								}
							/>
						)}
					{sourceOptions.length > 1 && (
						<SelectControl
							label={__('Source', 'maxi-blocks')}
							value={source}
							options={sourceOptions}
							newStyle
							onChange={value => {
								const validatedAttributes = validationsValues(
									type,
									field,
									relation,
									contentType,
									value,
									linkTarget,
									false,
									acfGroup
								);

								changeProps({
									'dc-source': value,
									'dc-show': 'current',
									'dc-error': '',
									...validatedAttributes,
								});
							}}
						/>
					)}
					{source === 'acf' && (
						<ACFSettingsControl
							onChange={changeProps}
							contentType={contentType}
							group={acfGroup}
							field={field}
							showStaticOption={showStaticOption(blockName)}
						/>
					)}
					<SelectControl
						label={__('Type', 'maxi-blocks')}
						value={type}
						options={postTypesOptions}
						newStyle
						onChange={value => {
							const validatedAttributes = validationsValues(
								value,
								field,
								relation,
								contentType,
								source,
								linkTarget,
								false,
								acfGroup
							);

							changeProps({
								'dc-type': value,
								'dc-show': 'current',
								'dc-error': '',
								...validatedAttributes,
							});
						}}
						onReset={() =>
							changeProps({
								'dc-type': getDefaultAttribute('dc-type'),
							})
						}
					/>
					{isEmpty(postIdOptions) &&
					!['settings', 'cart'].includes(type) &&
					type !== 'archive' ? (
						<p>{__('This type is empty', 'maxi-blocks')}</p>
					) : (
						<>
							{(relationTypes.includes(type) ||
								type === 'archive' ||
								relation.includes('custom-taxonomy')) && (
								<SelectControl
									label={__('Relation', 'maxi-blocks')}
									value={relation}
									options={currentRelationOptions}
									newStyle
									onChange={value =>
										changeProps({
											'dc-relation': value,
											'dc-show': 'current',
											'dc-error': '',
											...([
												'by-date',
												'alphabetical',
											].includes(value) && {
												'dc-order':
													orderOptions[value][0]
														.value,
											}),
										})
									}
									onReset={() =>
										changeProps({
											'dc-relation':
												getDefaultAttribute(
													'dc-relation'
												),
										})
									}
								/>
							)}
							{type === 'users' && relation === 'by-id' && (
								<SelectControl
									label={__('Author id', 'maxi-blocks')}
									value={author}
									options={postAuthorOptions}
									newStyle
									onChange={value =>
										changeProps({
											'dc-author': Number(value),
										})
									}
									onReset={() =>
										changeProps({
											'dc-author':
												getDefaultAttribute(
													'dc-author'
												),
										})
									}
								/>
							)}
							{relation !== 'current-archive' &&
								relationTypes.includes(type) &&
								type !== 'users' &&
								(orderByRelations.includes(relation) ||
									relation === 'by-id' ||
									relation.includes('custom-taxonomy')) && (
									<SelectControl
										label={__(
											`${capitalize(
												orderByRelations.includes(
													relation
												)
													? relation.replace(
															'by-',
															''
													  )
													: type.replace('_', ' ')
											)} id`,
											'maxi-blocks'
										)}
										value={id}
										options={postIdOptions}
										newStyle
										onChange={value =>
											changeProps({
												'dc-error': '',
												'dc-show': 'current',
												'dc-id': Number(value),
											})
										}
										onReset={() =>
											changeProps({
												'dc-id': CLStatus
													? null
													: postIdOptions[0].value,
											})
										}
									/>
								)}
							{((orderTypes.includes(type) &&
								orderRelations.includes(relation)) ||
								relation.includes('custom-taxonomy')) && (
								<>
									{orderByRelations.includes(relation) ||
										(relation.includes(
											'custom-taxonomy'
										) && (
											<SelectControl
												label={__(
													'Order by',
													'maxi-blocks'
												)}
												value={orderBy}
												options={orderByOptions}
												newStyle
												onChange={value =>
													changeProps({
														'dc-order-by': value,
													})
												}
												onReset={() =>
													changeProps({
														'dc-order-by':
															getDefaultAttribute(
																'dc-order-by'
															),
													})
												}
											/>
										))}
									<SelectControl
										label={__('Order', 'maxi-blocks')}
										value={order}
										options={
											orderOptions[
												orderByRelations.includes(
													relation
												) ||
												relation.includes(
													'custom-taxonomy'
												)
													? orderBy
													: relation
											]
										}
										newStyle
										onChange={value =>
											changeProps({
												'dc-order': value,
											})
										}
										onReset={() =>
											changeProps({
												'dc-order':
													getDefaultAttribute(
														'dc-order'
													),
											})
										}
									/>
									<AdvancedNumberControl
										label={__('Accumulator', 'maxi-blocks')}
										value={accumulator}
										onChangeValue={value =>
											changeProps({
												'dc-accumulator': value,
											})
										}
										onReset={() =>
											changeProps({
												'dc-accumulator':
													getDefaultAttribute(
														'dc-accumulator'
													),
											})
										}
										disableRange
									/>
								</>
							)}
							{source === 'wp' &&
								(['settings'].includes(type) ||
									(relation === 'by-id' && isFinite(id)) ||
									(relation === 'by-author' &&
										!isEmpty(postIdOptions)) ||
									[
										'date',
										'modified',
										'random',
										'current',
										...orderRelations,
									].includes(relation)) && (
									<SelectControl
										label={__('Field', 'maxi-blocks')}
										value={field}
										options={currentFieldOptions}
										newStyle
										onChange={value =>
											changeProps({
												'dc-field': value,
											})
										}
										onReset={() =>
											changeProps({
												'dc-field':
													fieldOptions[contentType][
														type
													][0]?.value,
											})
										}
									/>
								)}
							{limitTypes.includes(type) &&
								limitFields.includes(field) &&
								!error && (
									<div className='maxi-info'>
										<AdvancedNumberControl
											label={__(
												'Character limit',
												'maxi-blocks'
											)}
											value={limit}
											showHelp
											helpContent={
												<UnlimitedCharacterPopover message='Type 0 for unlimited' />
											}
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
													'dc-limit':
														getDefaultAttribute(
															'dc-limit'
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
									</div>
								)}
							{field === 'date' && !error && (
								<DateFormatting
									onChange={obj => changeProps(obj)}
									{...dcValuesForDate}
								/>
							)}
							{(['tags', 'categories'].includes(field) ||
								(source === 'acf' &&
									acfFieldType === 'checkbox') ||
								isCustomTaxonomyField) &&
								!error && (
									<>
										<SelectControl
											label={__(
												'Delimiter',
												'maxi-blocks'
											)}
											value={
												customDelimiterStatus
													? 'custom'
													: delimiterContent
											}
											options={delimiterOptions}
											newStyle
											onChange={value => {
												changeProps(
													value === 'custom'
														? {
																'dc-custom-delimiter-status': true,
														  }
														: {
																'dc-custom-delimiter-status': false,
																'dc-delimiter-content':
																	value,
														  }
												);
											}}
										/>
										{customDelimiterStatus && (
											<TextControl
												className='maxi-dynamic-content__custom-delimiter'
												label={__(
													'Custom delimiter',
													'maxi-blocks'
												)}
												value={delimiterContent}
												onChange={value =>
													changeProps({
														'dc-delimiter-content':
															value,
													})
												}
											/>
										)}
									</>
								)}
							{field === 'gallery' && (
								<AdvancedNumberControl
									label={__(
										'Image accumulator',
										'maxi-blocks'
									)}
									value={imageAccumulator}
									onChangeValue={value =>
										changeProps({
											'dc-image-accumulator': value,
										})
									}
									onReset={() =>
										changeProps({
											'dc-image-accumulator':
												getDefaultAttribute(
													'dc-image-accumulator'
												),
										})
									}
									disableRange
								/>
							)}
							{(field === 'avatar' ||
								field === 'author_avatar') &&
								!error && (
									<AdvancedNumberControl
										label={__('Size (px)', 'maxi-blocks')}
										value={mediaSize}
										min={1}
										max={2048}
										initialPosition={getDefaultAttribute(
											'dc-media-size'
										)}
										defaultValue={getDefaultAttribute(
											'dc-media-size'
										)}
										placeholder={mediaSize}
										onChangeValue={value =>
											changeProps({
												'dc-media-size': Number(value),
											})
										}
										onReset={() =>
											changeProps({
												'dc-media-size':
													getDefaultAttribute(
														'dc-media-size'
													),
											})
										}
									/>
								)}
						</>
					)}
				</>
			)}
		</div>
	);
};

export default DynamicContent;
