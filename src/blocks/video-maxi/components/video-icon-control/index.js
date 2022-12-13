/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import {
	AdvancedNumberControl,
	SelectControl,
	SettingTabsControl,
	ColorControl,
	ToggleSwitch,
	ResponsiveTabsControl,
} from '../../../../components';
import MaxiModal from '../../../../editor/library/modal';
import {
	getAttributeKey,
	getColorRGBAString,
	getDefaultAttribute,
	getLastBreakpointAttribute,
} from '../../../../extensions/styles';
import { setSVGContent, setSVGContentHover } from '../../../../extensions/svg';
import { handleOnReset } from '../../../../extensions/attributes';

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
						color={
							props[
								getAttributeKey(
									'icon-fill-color',
									isHover,
									prefix
								)
							]
						}
						defaultColor={getDefaultAttribute(
							`${prefix}icon-fill-color`
						)}
						paletteStatus={
							props[
								getAttributeKey(
									'icon-fill-palette-status',
									isHover,
									prefix
								)
							]
						}
						paletteColor={
							props[
								getAttributeKey(
									'icon-fill-palette-color',
									isHover,
									prefix
								)
							]
						}
						paletteOpacity={
							props[
								getAttributeKey(
									'icon-fill-palette-opacity',
									isHover,
									prefix
								)
							]
						}
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
							paletteOpacity,
							color,
						}) => {
							const fillColorStr = getColorRGBAString({
								firstVar: 'icon-fill',
								secondVar: `color-${paletteColor}`,
								opacity: paletteOpacity,
								blockStyle,
							});
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
							label={__('Icon position', 'maxi-blocks')}
							className='maxi-video-icon-control__icon-position'
							value={props[`${prefix}icon-position`]}
							onReset={() =>
								onChange(
									handleOnReset({
										[`${prefix}icon-position`]:
											getDefaultAttribute(
												`${prefix}icon-position`
											),
									})
								)
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
								onChangeValue={val =>
									onChange({
										[getAttributeKey(
											'icon-height',
											isHover,
											prefix,
											breakpoint
										)]: val,
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
									onChange(
										handleOnReset({
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
										})
									)
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
									onChangeValue={val =>
										onChange({
											[`${prefix}icon-spacing-${breakpoint}`]:
												val,
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
										onChange(
											handleOnReset({
												[`${prefix}icon-spacing-${breakpoint}`]:
													getDefaultAttribute(
														`${prefix}icon-spacing-${breakpoint}`
													),
												[`${prefix}icon-spacing-unit-${breakpoint}`]:
													getDefaultAttribute(
														`${prefix}icon-spacing-unit-${breakpoint}`
													),
											})
										);
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
	const { blockStyle, onChange, prefix, label, type } = props;

	return (
		<>
			<MaxiModal
				type={type}
				prefix={prefix}
				style={blockStyle}
				onSelect={obj => onChange(obj)}
				onRemove={obj => onChange(obj)}
				icon={props[`${prefix}icon-content`]}
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
				/>
			)}
		</>
	);
};

export default VideoIconControl;
