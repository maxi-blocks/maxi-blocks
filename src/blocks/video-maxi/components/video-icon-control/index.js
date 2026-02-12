/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import AdvancedNumberControl from '@components/advanced-number-control';
import SelectControl from '@components/select-control';
import SettingTabsControl from '@components/setting-tabs-control';
import ColorControl from '@components/color-control';
import ToggleSwitch from '@components/toggle-switch';
import ResponsiveTabsControl from '@components/responsive-tabs-control';
import MaxiModal from '@editor/library/modal';
import {
	getAttributeKey,
	getAttributeValue,
	getColorRGBAString,
	getDefaultAttribute,
	getLastBreakpointAttribute,
} from '@extensions/styles';
import {
	setSVGAriaLabel,
	setSVGContent,
	setSVGContentHover,
} from '@extensions/svg';
import { svgAttributesReplacer } from '@editor/library/util';

/**
 * External dependencies
 */
import { isEmpty } from 'lodash';

const IconSettings = props => {
	const {
		isHover = false,
		prefix,
		onChangeInline,
		onChange,
		blockStyle,
		label,
		breakpoint,
		clientId,
		[`${prefix}icon-status-hover`]: iconHoverStatus,
	} = props;

	const minMaxSettings = {
		px: {
			min: 0,
			max: 999,
		},
		em: {
			min: 0,
			max: 100,
		},
		vw: {
			min: 0,
			max: 100,
		},
		'%': {
			min: 0,
			max: 100,
		},
	};

	const showSettings = !isHover || iconHoverStatus;

	return (
		<>
			{isHover && (
				<ToggleSwitch
					className='maxi-video-icon-control__hover-status'
					label={__('Enable icon hover', 'maxi-blocks')}
					selected={iconHoverStatus}
					onChange={val =>
						onChange({ [`${prefix}icon-status-hover`]: val })
					}
				/>
			)}
			{showSettings && (
				<>
					<ColorControl
						className='maxi-video-icon-control__icon-colour'
						label={label}
						color={getAttributeValue({
							target: 'icon-fill-color',
							isHover,
							prefix,
							props,
						})}
						defaultColor={getDefaultAttribute(
							getAttributeKey('icon-fill-color', isHover, prefix)
						)}
						paletteStatus={getAttributeValue({
							target: 'icon-fill-palette-status',
							isHover,
							prefix,
							props,
						})}
						paletteSCStatus={getAttributeValue({
							target: 'icon-fill-palette-sc-status',
							isHover,
							prefix,
							props,
						})}
						paletteColor={getAttributeValue({
							target: 'icon-fill-palette-color',
							isHover,
							prefix,
							props,
						})}
						paletteOpacity={getAttributeValue({
							target: 'icon-fill-palette-opacity',
							isHover,
							prefix,
							props,
						})}
						onChangeInline={({ color }) => {
							onChangeInline &&
								!isHover &&
								onChangeInline({
									fill: color,
								});
						}}
						onChange={({
							paletteColor,
							paletteStatus,
							paletteSCStatus,
							paletteOpacity,
							color,
						}) => {
							const fillColorStr = getColorRGBAString(
								paletteSCStatus
									? {
											firstVar: `color-${paletteColor}`,
											opacity: paletteOpacity,
											blockStyle,
									  }
									: {
											firstVar: 'icon-fill',
											secondVar: `color-${paletteColor}`,
											opacity: paletteOpacity,
											blockStyle,
									  }
							);
							const icon = isHover
								? setSVGContentHover(
										props[`${prefix}icon-content`],
										paletteStatus ? fillColorStr : color,
										'fill'
								  )
								: setSVGContent(
										props[`${prefix}icon-content`],
										paletteStatus ? fillColorStr : color,
										'fill'
								  );

							onChange({
								[getAttributeKey(
									'icon-fill-palette-status',
									isHover,
									prefix
								)]: paletteStatus,
								[getAttributeKey(
									'icon-fill-palette-sc-status',
									isHover,
									prefix
								)]: paletteSCStatus,
								[getAttributeKey(
									'icon-fill-palette-color',
									isHover,
									prefix
								)]: paletteColor,
								[getAttributeKey(
									'icon-fill-palette-opacity',
									isHover,
									prefix
								)]: paletteOpacity,
								[getAttributeKey(
									'icon-fill-color',
									isHover,
									prefix
								)]: color,
								...(!isHover && {
									[`${prefix}icon-content`]: icon,
								}),
							});
						}}
						disableImage
						disableVideo
						disableGradient
						isHover={isHover}
						deviceType={breakpoint}
						clientId={clientId}
						prefix={`${prefix}icon-`}
					/>
					{prefix === 'close-' && (
						<SelectControl
							__nextHasNoMarginBottom
							label={__('Position', 'maxi-blocks')}
							className='maxi-video-icon-control__icon-position'
							value={props[`${prefix}icon-position`]}
							defaultValue={getDefaultAttribute(
								`${prefix}icon-position`
							)}
							onReset={() =>
								onChange({
									[`${prefix}icon-position`]:
										getDefaultAttribute(
											`${prefix}icon-position`
										),
									isReset: true,
								})
							}
							options={[
								{
									label: __(
										'Top screen right',
										'maxi-blocks'
									),
									value: 'top-screen-right',
								},
								{
									label: __(
										'Top right above video',
										'maxi-blocks'
									),
									value: 'top-right-above-video',
								},
							]}
							onChange={val =>
								onChange({
									[`${prefix}icon-position`]: val,
								})
							}
						/>
					)}
					<ResponsiveTabsControl breakpoint={breakpoint}>
						<>
							<AdvancedNumberControl
								label='Icon height'
								className='maxi-video-icon-control__icon-height'
								optionType='string'
								value={getLastBreakpointAttribute({
									target: `${prefix}icon-height`,
									breakpoint,
									isHover,
									attributes: props,
								})}
								onChangeValue={(val, meta) =>
									onChange({
										[getAttributeKey(
											'icon-height',
											isHover,
											prefix,
											breakpoint
										)]: val,
										meta,
									})
								}
								defaultValue={getDefaultAttribute(
									`${prefix}icon-height-${breakpoint}`
								)}
								enableUnit
								unit={getLastBreakpointAttribute({
									target: getAttributeKey(
										'icon-height-unit',
										isHover,
										prefix
									),
									breakpoint,
									attributes: props,
								})}
								defaultUnit={getDefaultAttribute(
									`${prefix}icon-height-unit-${breakpoint}`
								)}
								onChangeUnit={val =>
									onChange({
										[getAttributeKey(
											'icon-height-unit',
											isHover,
											prefix,
											breakpoint
										)]: val,
									})
								}
								onReset={() =>
									onChange({
										[getAttributeKey(
											'icon-height',
											isHover,
											prefix,
											breakpoint
										)]: getDefaultAttribute(
											`${prefix}icon-height`
										),
										[getAttributeKey(
											'icon-height-unit',
											isHover,
											prefix,
											breakpoint
										)]: getDefaultAttribute(
											`${prefix}icon-height-unit`
										),
										isReset: true,
									})
								}
								minMaxSettings={minMaxSettings}
								allowedUnits={['px', 'em', 'vw', '%']}
							/>
							{prefix === 'close-' && (
								<AdvancedNumberControl
									label={__('Icon spacing', 'maxi-blocks')}
									className='maxi-video-icon-control__icon-spacing'
									placeholder={0}
									value={getLastBreakpointAttribute({
										target: `${prefix}icon-spacing`,
										breakpoint,
										attributes: props,
									})}
									onChangeValue={(val, meta) =>
										onChange({
											[`${prefix}icon-spacing-${breakpoint}`]:
												val,
											meta,
										})
									}
									enableUnit
									unit={getLastBreakpointAttribute({
										target: `${prefix}icon-spacing-unit`,
										breakpoint,
										attributes: props,
									})}
									minMaxSettings={{
										px: {
											min: -999,
											max: 999,
										},
										em: {
											min: -99,
											max: 99,
										},
										vw: {
											min: -99,
											max: 99,
										},
										'%': {
											min: -100,
											max: 100,
										},
									}}
									onChangeUnit={val =>
										onChange({
											[`${prefix}icon-spacing-unit-${breakpoint}`]:
												val,
										})
									}
									onReset={() => {
										onChange({
											[`${prefix}icon-spacing-${breakpoint}`]:
												getDefaultAttribute(
													`${prefix}icon-spacing-${breakpoint}`
												),
											[`${prefix}icon-spacing-unit-${breakpoint}`]:
												getDefaultAttribute(
													`${prefix}icon-spacing-unit-${breakpoint}`
												),
											isReset: true,
										});
									}}
								/>
							)}
						</>
					</ResponsiveTabsControl>
				</>
			)}
		</>
	);
};

const VideoIconControl = props => {
	const { blockStyle, onChange, prefix, label, type, ariaLabels } = props;

	const iconContent = props[`${prefix}icon-content`];

	// Process icon with current colors for preview
	const processedIcon = iconContent
		? svgAttributesReplacer(iconContent, 'icon', type)
		: iconContent;

	return (
		<>
			<MaxiModal
				type={type}
				prefix={prefix}
				style={blockStyle}
				onSelect={obj => {
					if (
						obj[`${prefix}icon-content`] &&
						((ariaLabels?.['close icon'] &&
							type === 'video-icon-close') ||
							(ariaLabels?.['play icon'] &&
								type === 'video-icon-play'))
					) {
						obj[`${prefix}icon-content`] = setSVGAriaLabel(
							ariaLabels[
								type === 'video-icon-close'
									? 'close icon'
									: 'play icon'
							],
							() => obj[`${prefix}icon-content`]
						);
					}

					onChange(obj);
				}}
				onRemove={obj => onChange(obj)}
				icon={processedIcon}
				label={label}
			/>
			{!isEmpty(props[`${prefix}icon-content`]) && (
				<SettingTabsControl
					items={[
						{
							label: __('Normal state', 'maxi-blocks'),
							content: <IconSettings {...props} />,
						},
						{
							label: __('Hover state', 'maxi-blocks'),
							content: <IconSettings {...props} isHover />,
						},
					]}
					depth={2}
					disablePadding
				/>
			)}
		</>
	);
};

export default VideoIconControl;
