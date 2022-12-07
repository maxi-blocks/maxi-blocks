/**
 * WordPress Dependencies
 */
import { __ } from '@wordpress/i18n';
import { useEffect, useState } from '@wordpress/element';

/**
 * Internal dependencies
 */
import AdvancedNumberControl from '../advanced-number-control';
import AxisControl from '../axis-control';
import AxisPositionControl from '../axis-position-control';
import BorderControl from '../border-control';
import ColorControl from '../color-control';
import GradientControl from '../gradient-control';
import Icon from '../icon';
import InfoBox from '../info-box';
import SettingTabsControl from '../setting-tabs-control';
import SvgStrokeWidthControl from '../svg-stroke-width-control';
import SvgWidthControl from '../svg-width-control';
import ToggleSwitch from '../toggle-switch';
import { withRTC } from '../../extensions/maxi-block';
import {
	getAttributeKey,
	getDefaultAttribute,
	getGroupAttributes,
	getLastBreakpointAttribute,
} from '../../extensions/styles';
import MaxiModal from '../../editor/library/modal';

/**
 * External dependencies
 */
import classnames from 'classnames';

/**
 * Styles and icons
 */
import './editor.scss';
import {
	backgroundColor,
	backgroundGradient,
	iconBorder,
	styleNone,
	iconStroke,
	iconFill,
} from '../../icons';

/**
 * Component
 */
const IconControl = props => {
	const {
		className,
		onChangeInline = null,
		onChange,
		clientId,
		svgType,
		breakpoint,
		blockStyle,
		isHover = false,
		isInteractionBuilder = false,
		disableBackground = false,
		disableBorder = false,
		disableIconInherit = false,
		disableIconOnly = false,
		disablePadding = false,
		disablePosition = false,
		disableSpacing = false,
		disableModal = false,
		getIconWithColor,
		type = 'button-icon',
		inlineTarget,
		prefix = '',
		[`${prefix}icon-only`]: iconOnly,
		[`${prefix}icon-inherit`]: iconInherit,
		[`${prefix}icon-content`]: iconContent,
	} = props;

	const classes = classnames('maxi-icon-control', className);

	const [iconStyle, setIconStyle] = useState('color');

	useEffect(() => {
		if (breakpoint !== 'general') {
			setIconStyle('border');
		}
	}, [breakpoint]);

	const getOptions = () => {
		const options = [];

		if (breakpoint === 'general') {
			if (svgType !== 'Shape')
				options.push({
					icon: <Icon icon={iconBorder} />,
					value: 'color',
				});
			else if (iconStyle === 'color') setIconStyle('fill');

			if (svgType !== 'Line')
				options.push({
					icon: <Icon icon={iconFill} />,
					value: 'fill',
				});
			else if (iconStyle === 'fill') setIconStyle('color');
		}

		if (!disableBorder) {
			options.push({
				icon: <Icon icon={iconStroke} />,
				value: 'border',
			});
		}

		return options;
	};

	const getBackgroundOptions = () => {
		const options = [];

		options.push({
			icon: <Icon icon={styleNone} />,
			value: 'none',
		});

		options.push({
			icon: <Icon icon={backgroundColor} />,
			value: 'color',
		});

		options.push({
			icon: <Icon icon={backgroundGradient} />,
			value: 'gradient',
		});

		return options;
	};

	const minMaxSettings = {
		px: {
			min: 0,
			max: 999,
		},
		em: {
			min: 0,
			max: 999,
		},
		vw: {
			min: 0,
			max: 999,
		},
		'%': {
			min: 0,
			max: 100,
		},
	};

	const iconBackgroundActiveMedia = getLastBreakpointAttribute({
		target: `${prefix}icon-background-active-media`,
		breakpoint,
		attributes: props,
		isHover,
	});

	const [iconBgActive, setIconBgActive] = useState(
		iconBackgroundActiveMedia || 'none'
	);

	return (
		<div className={classes}>
			{!isInteractionBuilder &&
				!disableModal &&
				!isHover &&
				breakpoint === 'general' && (
					<MaxiModal
						type={type}
						style={blockStyle}
						onSelect={obj => {
							const icon = getIconWithColor({
								rawIcon: obj[`${prefix}icon-content`],
							});

							onChange({
								...obj,
								[`${prefix}icon-content`]: icon,
							});
						}}
						onRemove={obj => onChange(obj)}
						icon={iconContent}
						prefix={prefix}
					/>
				)}
			{iconContent && (
				<>
					{!isInteractionBuilder &&
						!disableIconOnly &&
						!isHover &&
						breakpoint === 'general' && (
							<>
								<hr />
								<ToggleSwitch
									label={__(
										'Icon only (remove text)',
										'maxi-blocks'
									)}
									className='maxi-icon-control__icon-only'
									selected={iconOnly}
									onChange={val => {
										const icon = getIconWithColor({
											isIconOnly: val,
											isHover,
										});

										onChange({
											[`${prefix}icon-only`]: val,
											[`${prefix}icon-content`]: icon,
										});
									}}
								/>
							</>
						)}
					<SvgWidthControl
						{...getGroupAttributes(props, 'icon', isHover, prefix)}
						className='maxi-icon-control__width'
						onChange={onChange}
						prefix={`${prefix}icon-`}
						breakpoint={breakpoint}
						isHover={isHover}
					/>
					{svgType !== 'Shape' && (
						<SvgStrokeWidthControl
							{...getGroupAttributes(
								props,
								'icon',
								isHover,
								prefix
							)}
							{...(isHover && {
								...{
									...getGroupAttributes(
										props,
										'icon',
										isHover,
										prefix
									),
								},
							})}
							className='maxi-icon-control__stroke-width'
							onChange={obj => onChange(obj)}
							prefix={`${prefix}icon-`}
							breakpoint={breakpoint}
							isHover={isHover}
							content={props[`${prefix}icon-content`]}
						/>
					)}
					{!disableSpacing && !isHover && !iconOnly && (
						<>
							<AdvancedNumberControl
								label={__('Spacing', 'maxi-blocks')}
								className='maxi-icon-control__spacing'
								min={0}
								max={999}
								initial={1}
								step={1}
								breakpoint={breakpoint}
								value={
									props[`${prefix}icon-spacing-${breakpoint}`]
								}
								onChangeValue={val => {
									onChange({
										[`${prefix}icon-spacing-${breakpoint}`]:
											val !== undefined && val !== ''
												? val
												: '',
									});
								}}
								onReset={() =>
									onChange({
										[`${prefix}icon-spacing-${breakpoint}`]:
											getDefaultAttribute(
												`${prefix}icon-spacing-${breakpoint}`
											),
									})
								}
							/>
							{!disablePosition && (
								<AxisPositionControl
									label='Icon'
									className='maxi-icon-control__position'
									selected={props[`${prefix}icon-position`]}
									onChange={val => {
										onChange({
											[`${prefix}icon-position`]: val,
										});
									}}
									breakpoint={breakpoint}
								/>
							)}
						</>
					)}
					{!disableIconInherit &&
						!isHover &&
						breakpoint === 'general' && (
							<ToggleSwitch
								label={__(
									'Inherit colour/background from button',
									'maxi-block'
								)}
								className='maxi-icon-control__inherit'
								selected={iconInherit}
								onChange={val => {
									const icon = getIconWithColor({
										isInherit: val,
										isHover,
									});

									onChange({
										[`${prefix}icon-inherit`]: val,
										[`${prefix}icon-content`]: icon,
									});
								}}
							/>
						)}
					{getOptions().length > 1 && (
						<SettingTabsControl
							className='maxi-icon-styles-control'
							type='buttons'
							fullWidthMode
							selected={iconStyle}
							items={getOptions()}
							onChange={val => setIconStyle(val)}
						/>
					)}
					{iconStyle === 'color' &&
						(!iconInherit || iconOnly || disableIconInherit ? (
							svgType !== 'Shape' && (
								<ColorControl
									label={__('Icon stroke', 'maxi-blocks')}
									className='maxi-icon-styles-control--color'
									avoidBreakpointForDefault
									color={
										props[
											`${prefix}icon-stroke-color${
												isHover ? '-hover' : ''
											}`
										]
									}
									prefix={`${prefix}icon-stroke-`}
									paletteColor={
										props[
											`${prefix}icon-stroke-palette-color${
												isHover ? '-hover' : ''
											}`
										]
									}
									paletteOpacity={
										props[
											`${prefix}icon-stroke-palette-opacity${
												isHover ? '-hover' : ''
											}`
										]
									}
									paletteStatus={
										props[
											`${prefix}icon-stroke-palette-status${
												isHover ? '-hover' : ''
											}`
										]
									}
									onChangeInline={({ color }) =>
										onChangeInline &&
										onChangeInline(
											{ stroke: color },
											'[data-stroke]',
											true
										)
									}
									onChange={({
										color,
										paletteColor,
										paletteStatus,
										paletteOpacity,
									}) => {
										const icon = getIconWithColor({
											color,
											paletteColor,
											paletteStatus,
											paletteOpacity,
											isHover,
										});

										onChange({
											[`${prefix}icon-stroke-color${
												isHover ? '-hover' : ''
											}`]: color,
											[`${prefix}icon-stroke-palette-color${
												isHover ? '-hover' : ''
											}`]: paletteColor,
											[`${prefix}icon-stroke-palette-status${
												isHover ? '-hover' : ''
											}`]: paletteStatus,
											[`${prefix}icon-stroke-palette-opacity${
												isHover ? '-hover' : ''
											}`]: paletteOpacity,
											[`${prefix}icon-content`]: icon,
										});
									}}
									isHover={isHover}
									globalProps={{
										target: `${
											isHover ? 'hover-line' : 'line'
										}`,
										type: 'icon',
									}}
								/>
							)
						) : (
							<InfoBox
								key='maxi-warning-box__icon-color'
								message={__(
									'Icon colour is inheriting from button.',
									'maxi-blocks'
								)}
								links={[
									{
										title: __(
											'Button colour',
											'maxi-blocks'
										),
										panel: 'typography',
									},
								]}
							/>
						))}
					{iconStyle === 'border' && (
						<BorderControl
							{...getGroupAttributes(
								props,
								[
									`iconBorder${isHover ? 'Hover' : ''}`,
									`iconBorderWidth${isHover ? 'Hover' : ''}`,
									`iconBorderRadius${isHover ? 'Hover' : ''}`,
								],
								isHover,
								prefix
							)}
							prefix={`${prefix}icon-`}
							onChange={onChange}
							breakpoint={breakpoint}
							clientId={clientId}
							isHover={isHover}
							disableRTC
						/>
					)}
					{iconStyle === 'fill' && svgType !== 'Line' && (
						<ColorControl
							label={__('Icon fill', 'maxi-blocks')}
							color={
								props[
									`${prefix}icon-fill-color${
										isHover ? '-hover' : ''
									}`
								]
							}
							prefix={`${prefix}icon-fill`}
							paletteColor={
								props[
									`${prefix}icon-fill-palette-color${
										isHover ? '-hover' : ''
									}`
								]
							}
							paletteOpacity={
								props[
									`${prefix}icon-fill-palette-opacity${
										isHover ? '-hover' : ''
									}`
								]
							}
							paletteStatus={
								props[
									`${prefix}icon-fill-palette-status${
										isHover ? '-hover' : ''
									}`
								]
							}
							onChangeInline={({ color }) =>
								onChangeInline &&
								onChangeInline(
									{ fill: color },
									'[data-fill]',
									true
								)
							}
							onChange={({
								color,
								paletteColor,
								paletteStatus,
								paletteOpacity,
							}) => {
								const icon = getIconWithColor({
									color,
									paletteColor,
									paletteStatus,
									paletteOpacity,
									type: 'fill',
									isHover,
								});

								onChange({
									[`${prefix}icon-fill-color${
										isHover ? '-hover' : ''
									}`]: color,
									[`${prefix}icon-fill-palette-color${
										isHover ? '-hover' : ''
									}`]: paletteColor,
									[`${prefix}icon-fill-palette-status${
										isHover ? '-hover' : ''
									}`]: paletteStatus,
									[`${prefix}icon-fill-palette-opacity${
										isHover ? '-hover' : ''
									}`]: paletteOpacity,
									[`${prefix}icon-content`]: icon,
								});
							}}
							isHover={isHover}
							globalProps={{
								target: `${isHover ? 'hover-fill' : 'fill'}`,
								type: 'icon',
							}}
							avoidBreakpointForDefault
						/>
					)}
					{!disableBackground && (
						<>
							<SettingTabsControl
								type='buttons'
								fullWidthMode
								selected={iconBgActive}
								items={getBackgroundOptions()}
								onChange={val => {
									setIconBgActive(val);
									onChange({
										[getAttributeKey(
											'background-active-media',
											isHover,
											`${prefix}icon-`,
											breakpoint
										)]: val,
									});
								}}
							/>
							{iconBgActive === 'color' &&
								(!iconInherit || disableIconInherit ? (
									<ColorControl
										label={__(
											'Icon background',
											'maxi-blocks'
										)}
										paletteStatus={getLastBreakpointAttribute(
											{
												target: `${prefix}icon-background-palette-status`,
												breakpoint,
												attributes: props,
												isHover,
											}
										)}
										paletteColor={getLastBreakpointAttribute(
											{
												target: `${prefix}icon-background-palette-color`,
												breakpoint,
												attributes: props,
												isHover,
												prefix,
											}
										)}
										paletteOpacity={getLastBreakpointAttribute(
											{
												target: `${prefix}icon-background-palette-opacity`,
												breakpoint,
												attributes: props,
												isHover,
												prefix,
											}
										)}
										color={getLastBreakpointAttribute({
											target: `${prefix}icon-background-color`,
											breakpoint,
											attributes: props,
											isHover,
											prefix,
										})}
										prefix={`${prefix}icon-background-`}
										avoidBreakpointForDefault
										onChangeInline={({ color }) =>
											onChangeInline &&
											onChangeInline(
												{
													background: color,
												},
												inlineTarget
											)
										}
										onChange={({
											paletteStatus,
											paletteColor,
											paletteOpacity,
											color,
										}) => {
											onChange(
												{
													[getAttributeKey(
														'background-palette-status',
														isHover,
														`${prefix}icon-`,
														breakpoint
													)]: paletteStatus,
													[getAttributeKey(
														'background-palette-color',
														isHover,
														`${prefix}icon-`,
														breakpoint
													)]: paletteColor,
													[getAttributeKey(
														'background-palette-opacity',
														isHover,
														`${prefix}icon-`,
														breakpoint
													)]: paletteOpacity,
													[getAttributeKey(
														'background-color',
														isHover,
														`${prefix}icon-`,
														breakpoint
													)]: color,
												},
												inlineTarget
											);
										}}
										isHover={isHover}
									/>
								) : (
									<InfoBox
										key='maxi-warning-box__icon-background'
										message={__(
											'Icon background is inheriting from button.',
											'maxi-blocks'
										)}
										links={[
											{
												title: __(
													'Button Background colour',
													'maxi-blocks'
												),
												panel: 'button background',
											},
										]}
									/>
								))}
							{iconBgActive === 'gradient' && (
								<GradientControl
									label={__(
										'Icon Background gradient',
										'maxi-blocks'
									)}
									gradient={getLastBreakpointAttribute({
										target: `${prefix}icon-background-gradient`,
										breakpoint,
										attributes: props,
										isHover,
									})}
									gradientOpacity={getLastBreakpointAttribute(
										{
											target: `${prefix}icon-background-gradient-opacity`,
											breakpoint,
											attributes: props,
											isHover,
										}
									)}
									defaultGradient={getDefaultAttribute(
										getAttributeKey(
											'background-gradient',
											isHover,
											`${prefix}icon-`,
											breakpoint
										)
									)}
									onChange={val =>
										onChange({
											[getAttributeKey(
												'background-gradient',
												isHover,
												`${prefix}icon-`,
												breakpoint
											)]: val,
										})
									}
									onChangeOpacity={val =>
										onChange({
											[getAttributeKey(
												'background-gradient-opacity',
												isHover,
												`${prefix}icon-`,
												breakpoint
											)]: val,
										})
									}
									isHover={isHover}
								/>
							)}
						</>
					)}
					{!disablePadding && !isHover && (
						<AxisControl
							{...getGroupAttributes(
								props,
								'iconPadding',
								false,
								prefix
							)}
							prefix={prefix}
							label={__('Icon padding', 'maxi-blocks')}
							onChange={onChange}
							breakpoint={breakpoint}
							target='icon-padding'
							disableAuto
							optionType='string'
							minMaxSettings={minMaxSettings}
						/>
					)}
				</>
			)}
		</div>
	);
};

export default withRTC(IconControl);
