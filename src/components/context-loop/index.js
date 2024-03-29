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
import { resolveSelect, select, useSelect } from '@wordpress/data';

/**
 * Internal dependencies
 */
import AdvancedNumberControl from '../advanced-number-control';
import SelectControl from '../select-control';
import ToggleSwitch from '../toggle-switch';
import TextControl from '../text-control';
import TypographyControl from '../typography-control';
import ColorControl from '../color-control';
import ResponsiveTabsControl from '../responsive-tabs-control';
import FlexSettingsControl from '../flex-settings-control';
import {
	getDefaultAttribute,
	getGroupAttributes,
} from '../../extensions/styles';
import {
	orderByRelations,
	orderByOptions,
	orderOptions,
	orderRelations,
	relationOptions,
	sourceOptions,
} from '../../extensions/DC/constants';
import {
	getCLAttributes,
	getDCOptions,
	LoopContext,
} from '../../extensions/DC';
import {
	getRelationOptions,
	validationsValues,
} from '../../extensions/DC/utils';
import {
	ALLOWED_ACCUMULATOR_PARENT_CHILD_MAP,
	ALLOWED_ACCUMULATOR_GRANDPARENT_GRANDCHILD_MAP,
} from '../../extensions/DC/withMaxiContextLoop';
import getTypes from '../../extensions/DC/getTypes';
import ACFSettingsControl from '../dynamic-content/acf-settings-control';

/**
 * External dependencies
 */
import { capitalize, isEmpty, isEqual, isNil } from 'lodash';
import classnames from 'classnames';

const ContextLoop = props => {
	const {
		clientId,
		className,
		onChange,
		blockStyle,
		breakpoint,
		name,
		isToolbar = false,
		contentType = 'group',
		'dc-link-target': linkTarget,
	} = props;

	const { contextLoop } = useContext(LoopContext);

	const [postAuthorOptions, setPostAuthorOptions] = useState(null);
	const [postIdOptions, setPostIdOptions] = useState(null);
	const [postTypesOptions, setPostTypesOptions] = useState(null);

	const classes = classnames('maxi-context-loop', className);

	const {
		'cl-status': status,
		'cl-source': source,
		'cl-type': type,
		'cl-relation': relation,
		'cl-id': id,
		'cl-field': field,
		'cl-author': author,
		'cl-order-by': orderBy,
		'cl-order': order,
		'cl-accumulator': accumulator,
		'cl-grandchild-accumulator': grandchildAccumulator = false,
		'cl-acf-group': acfGroup,
		'cl-pagination': pagination,
		'cl-pagination-per-page': paginationPerPage,
		'cl-pagination-total': paginationTotal,
		'cl-pagination-total-all': paginationTotalAll,
		'cl-pagination-show-page-list': paginationShowPageList,
		'cl-pagination-previous-text': paginationPreviousText,
		'cl-pagination-next-text': paginationNextText,
		'cl-pagination-link-hover-color': paginationLinkHoverColor,
		'cl-pagination-link-hover-palette-status':
			paginationLinkHoverPaletteStatus,
		'cl-pagination-link-hover-palette-sc-status':
			paginationLinkHoverPaletteSCStatus,
		'cl-pagination-link-hover-palette-color':
			paginationLinkHoverPaletteColor,
		'cl-pagination-link-hover-palette-opacity':
			paginationLinkHoverPaletteOpacity,
		'cl-pagination-link-current-color': paginationLinkCurrentColor,
		'cl-pagination-link-current-palette-status':
			paginationLinkCurrentPaletteStatus,
		'cl-pagination-link-current-palette-sc-status':
			paginationLinkCurrentPaletteSCStatus,
		'cl-pagination-link-current-palette-color':
			paginationLinkCurrentPaletteColor,
		'cl-pagination-link-current-palette-opacity':
			paginationLinkCurrentPaletteOpacity,
	} = getCLAttributes(contextLoop);

	const clPaginationPrefix = 'cl-pagination-';

	const { relationTypes, orderTypes } = useSelect(select => {
		const { getRelationTypes, getOrderTypes } = select(
			'maxiBlocks/dynamic-content'
		);
		return {
			relationTypes: getRelationTypes(),
			orderTypes: getOrderTypes(),
		};
	}, []);

	const currentRelationOptions = useMemo(
		() => getRelationOptions(type, contentType),
		[contentType, type]
	);

	const isTypeHasRelations =
		relationTypes.includes(type) && !!currentRelationOptions;

	const isOrderSettings =
		orderTypes.includes(type) && orderRelations.includes(relation);

	const changeProps = (params, alwaysSaveCLStatus = false) => {
		const hasChangesToSave = Object.entries(contextLoop).some(
			([key, val]) => {
				if (alwaysSaveCLStatus && key === 'cl-status') return true;

				if (!(key in params)) return false;

				return params[key] !== val;
			}
		);

		if (hasChangesToSave) onChange(params);
	};

	const fetchDcData = useCallback(async () => {
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

				changeProps({ 'cl-author': id });
			}
		}

		// Sets new content
		if (status && isTypeHasRelations) {
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
				true
			);

			if (postIDSettings) {
				const { newValues, newPostIdOptions } = postIDSettings;

				changeProps(newValues);

				if (
					!isNil(newPostIdOptions) &&
					!isEqual(postIdOptions, newPostIdOptions)
				)
					setPostIdOptions(newPostIdOptions);
			}
		}
	});

	useEffect(() => {
		const postTypes = getTypes(source === 'wp' ? contentType : source);
		setPostTypesOptions(postTypes);
	}, [contentType, source]);

	useEffect(() => {
		if (source === 'acf' && typeof acf === 'undefined') {
			const validatedAttributes = validationsValues(
				type,
				field,
				relation,
				contentType
			);

			changeProps({
				'cl-source': 'wp',
				...validatedAttributes,
			});
		}
	}, []);

	useEffect(() => {
		fetchDcData().catch(console.error);
	}, [fetchDcData]);

	return (
		<div className={classes}>
			<ToggleSwitch
				label={__('Use context loop', 'maxi-blocks')}
				selected={status}
				onChange={value => changeProps({ 'cl-status': value })}
			/>
			{status && (
				<>
					{isOrderSettings &&
						Object.keys(
							ALLOWED_ACCUMULATOR_PARENT_CHILD_MAP
						).includes(
							select('core/block-editor').getBlockName(clientId)
						) &&
						!isEmpty(
							select(
								'core/block-editor'
							).getBlockParentsByBlockName(
								clientId,
								Object.keys(
									ALLOWED_ACCUMULATOR_PARENT_CHILD_MAP
								)
							)
						) &&
						contextLoop.prevContextLoopStatus && (
							<ToggleSwitch
								label={__(
									'Stop accumulator inheritance',
									'maxi-blocks'
								)}
								selected={props['cl-status']}
								onChange={value =>
									changeProps(
										{
											'cl-status': value || undefined,
										},
										true
									)
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
									true
								);

								changeProps({
									'cl-source': value,
									...validatedAttributes,
								});
							}}
						/>
					)}
					{source === 'acf' && (
						<ACFSettingsControl
							onChange={onChange}
							contentType={contentType}
							group={acfGroup}
							isCL
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
								'wp',
								linkTarget,
								true
							);

							changeProps({
								'cl-type': value,
								...validatedAttributes,
							});
						}}
						onReset={() =>
							changeProps({
								'cl-type': getDefaultAttribute('cl-type'),
							})
						}
					/>
					{isEmpty(postIdOptions) &&
					type !== 'settings' &&
					relationOptions?.[contentType] !== null ? (
						<p>{__('This type is empty', 'maxi-blocks')}</p>
					) : (
						<>
							{isTypeHasRelations && (
								<SelectControl
									label={__('Relation', 'maxi-blocks')}
									value={relation}
									options={currentRelationOptions}
									onChange={value =>
										changeProps({
											'cl-relation': value,
										})
									}
									onReset={() =>
										changeProps({
											'cl-relation':
												getDefaultAttribute(
													'cl-relation'
												),
										})
									}
								/>
							)}
							{contentType !== 'container' &&
								relationTypes.includes(type) &&
								type === 'users' &&
								relation === 'by-id' && (
									<SelectControl
										label={__('Author id', 'maxi-blocks')}
										value={author}
										options={postAuthorOptions}
										onChange={value =>
											changeProps({
												'cl-author': Number(value),
											})
										}
										onReset={() =>
											changeProps({
												'cl-author':
													getDefaultAttribute(
														'cl-author'
													),
											})
										}
									/>
								)}
							{relation !== 'current-archive' &&
								relationTypes.includes(type) &&
								type !== 'users' &&
								(orderByRelations.includes(relation) ||
									relation === 'by-id') && (
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
													: type
											)} id`,
											'maxi-blocks'
										)}
										value={id}
										options={postIdOptions}
										onChange={value =>
											changeProps({
												'cl-id': Number(value),
											})
										}
										onReset={() =>
											changeProps({
												'cl-id': postIdOptions[0].value,
											})
										}
									/>
								)}
							{isOrderSettings && (
								<>
									{orderByRelations.includes(relation) && (
										<SelectControl
											label={__(
												'Order by',
												'maxi-blocks'
											)}
											value={orderBy}
											options={orderByOptions}
											onChange={value =>
												changeProps({
													'cl-order-by': value,
												})
											}
											onReset={() =>
												changeProps({
													'cl-order-by':
														getDefaultAttribute(
															'cl-order-by'
														),
												})
											}
										/>
									)}
									<SelectControl
										label={__('Order', 'maxi-blocks')}
										value={order}
										options={
											orderOptions[
												orderByRelations.includes(
													relation
												)
													? orderBy
													: relation
											]
										}
										onChange={value =>
											changeProps({
												'cl-order': value,
											})
										}
										onReset={() =>
											changeProps({
												'cl-order':
													getDefaultAttribute(
														'cl-order'
													),
											})
										}
									/>
									<AdvancedNumberControl
										label={__('Accumulator', 'maxi-blocks')}
										value={accumulator}
										onChangeValue={value =>
											changeProps({
												'cl-accumulator': value,
											})
										}
										onReset={() =>
											changeProps({
												'cl-accumulator':
													getDefaultAttribute(
														'cl-accumulator'
													),
											})
										}
										disableRange
									/>
									{Object.keys(
										ALLOWED_ACCUMULATOR_GRANDPARENT_GRANDCHILD_MAP
									).includes(
										select(
											'core/block-editor'
										).getBlockName(clientId)
									) && (
										<ToggleSwitch
											label={__(
												'Enable for grandchildren blocks',
												'maxi-blocks'
											)}
											selected={grandchildAccumulator}
											onChange={value =>
												changeProps({
													'cl-grandchild-accumulator':
														value,
												})
											}
										/>
									)}
									{!isToolbar && (
										<ToggleSwitch
											label={__(
												'Pagination',
												'maxi-blocks'
											)}
											selected={pagination}
											onChange={value =>
												changeProps({
													'cl-pagination': value,
												})
											}
										/>
									)}
									{!isToolbar && pagination && (
										<>
											<AdvancedNumberControl
												label={__(
													'Items per page',
													'maxi-blocks'
												)}
												value={paginationPerPage}
												onChangeValue={value =>
													changeProps({
														'cl-pagination-per-page':
															value,
													})
												}
												onReset={() =>
													changeProps({
														'cl-pagination-per-page':
															getDefaultAttribute(
																'cl-pagination-per-page'
															),
													})
												}
												disableRange
											/>
											<ToggleSwitch
												label={__(
													'Items total: show all',
													'maxi-blocks'
												)}
												selected={paginationTotalAll}
												onChange={value =>
													changeProps({
														'cl-pagination-total-all':
															value,
													})
												}
											/>
											{!paginationTotalAll && (
												<AdvancedNumberControl
													label={__(
														'Items total',
														'maxi-blocks'
													)}
													step={paginationPerPage}
													min={paginationPerPage * 2}
													value={
														paginationTotal ||
														paginationPerPage * 2
													}
													onChangeValue={value =>
														changeProps({
															'cl-pagination-total':
																value,
														})
													}
													onReset={() =>
														changeProps({
															'cl-pagination-total':
																getDefaultAttribute(
																	'cl-pagination-total'
																),
														})
													}
													disableRange
												/>
											)}
											<TextControl
												isFullwidth
												label={__(
													'Text for previous link',
													'maxi-blocks'
												)}
												value={paginationPreviousText}
												onChange={value =>
													changeProps({
														'cl-pagination-previous-text':
															value,
													})
												}
											/>
											<TextControl
												isFullwidth
												label={__(
													'Text for next link',
													'maxi-blocks'
												)}
												value={paginationNextText}
												onChange={value =>
													changeProps({
														'cl-pagination-next-text':
															value,
													})
												}
											/>
											<ToggleSwitch
												label={__(
													'Show page list (1, 2, 3, …)',
													'maxi-blocks'
												)}
												selected={
													paginationShowPageList
												}
												onChange={value =>
													changeProps({
														'cl-pagination-show-page-list':
															value,
													})
												}
											/>
											<TypographyControl
												{...getGroupAttributes(
													contextLoop,
													'typography',
													false,
													clPaginationPrefix
												)}
												textLevel='p'
												blockStyle={blockStyle}
												clientId={clientId}
												breakpoint={breakpoint}
												disableCustomFormats
												hideAlignment
												styleCardPrefix=''
												prefix={clPaginationPrefix}
												onChange={obj => onChange(obj)}
											/>
											<ColorControl
												label={__(
													'Pagination hover',
													'maxi-blocks'
												)}
												className='maxi-pagination-link-hover-color'
												color={paginationLinkHoverColor}
												prefix={`${clPaginationPrefix}link-hover-`}
												paletteStatus={
													paginationLinkHoverPaletteStatus
												}
												paletteSCStatus={
													paginationLinkHoverPaletteSCStatus
												}
												paletteColor={
													paginationLinkHoverPaletteColor
												}
												paletteOpacity={
													paginationLinkHoverPaletteOpacity
												}
												// onChangeInline={({ color }) =>
												// 	onChangeInline(
												// 		{ color },
												// 		'a:hover'
												// 	)
												// }
												onChange={({
													paletteColor,
													paletteStatus,
													paletteSCStatus,
													paletteOpacity,
													color,
												}) =>
													changeProps({
														[`${clPaginationPrefix}link-hover-palette-status`]:
															paletteStatus,
														[`${clPaginationPrefix}link-hover-palette-sc-status`]:
															paletteSCStatus,
														[`${clPaginationPrefix}link-hover-palette-color`]:
															paletteColor,
														[`${clPaginationPrefix}link-hover-palette-opacity`]:
															paletteOpacity,
														[`${clPaginationPrefix}link-hover-color`]:
															color,
													})
												}
												textLevel='p'
												deviceType={breakpoint}
												clientId={clientId}
												disableGradient
											/>
											<ColorControl
												label={__(
													'Pagination current',
													'maxi-blocks'
												)}
												className='maxi-pagination-link-current-color'
												color={
													paginationLinkCurrentColor
												}
												prefix={`${clPaginationPrefix}link-current-`}
												paletteStatus={
													paginationLinkCurrentPaletteStatus
												}
												paletteSCStatus={
													paginationLinkCurrentPaletteSCStatus
												}
												paletteColor={
													paginationLinkCurrentPaletteColor
												}
												paletteOpacity={
													paginationLinkCurrentPaletteOpacity
												}
												onChange={({
													paletteColor,
													paletteStatus,
													paletteSCStatus,
													paletteOpacity,
													color,
												}) =>
													changeProps({
														[`${clPaginationPrefix}link-current-palette-status`]:
															paletteStatus,
														[`${clPaginationPrefix}link-current-palette-sc-status`]:
															paletteSCStatus,
														[`${clPaginationPrefix}link-current-palette-color`]:
															paletteColor,
														[`${clPaginationPrefix}link-current-palette-opacity`]:
															paletteOpacity,
														[`${clPaginationPrefix}link-current-color`]:
															color,
													})
												}
												textLevel='p'
												deviceType={breakpoint}
												clientId={clientId}
												disableGradient
											/>
											<ResponsiveTabsControl
												breakpoint={breakpoint}
											>
												<FlexSettingsControl
													{...getGroupAttributes(
														contextLoop,
														'flex',
														false,
														clPaginationPrefix
													)}
													onChange={obj => {
														onChange(obj);
													}}
													breakpoint={breakpoint}
													clientId={clientId}
													name='pagination'
													parentBlockName={name}
													prefix={clPaginationPrefix}
												/>
											</ResponsiveTabsControl>
										</>
									)}
								</>
							)}
						</>
					)}
				</>
			)}
		</div>
	);
};

export default ContextLoop;
