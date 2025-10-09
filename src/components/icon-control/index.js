/**
 * WordPress Dependencies
 */
import { __ } from '@wordpress/i18n';
import { useEffect, useState } from '@wordpress/element';

/**
 * External dependencies
 */
import classnames from 'classnames';

/**
 * Internal dependencies
 */
import AdvancedNumberControl from '@components/advanced-number-control';
import AxisControl from '@components/axis-control';
import AxisPositionControl from '@components/axis-position-control';
import BorderControl from '@components/border-control';
import ColorControl from '@components/color-control';
import GradientControl from '@components/gradient-control';
import Icon from '@components/icon';
import InfoBox from '@components/info-box';
import SettingTabsControl from '@components/setting-tabs-control';
import SvgStrokeWidthControl from '@components/svg-stroke-width-control';
import SvgWidthControl from '@components/svg-width-control';
import ToggleSwitch from '@components/toggle-switch';
import MaxiModal from '@editor/library/modal';
import withRTC from '@extensions/maxi-block/withRTC';
import {
	getAttributeKey,
	getAttributeValue,
	getDefaultAttribute,
	getGroupAttributes,
	getLastBreakpointAttribute,
} from '@extensions/styles';
import {
	setSVGAriaLabel,
	shouldSetPreserveAspectRatio,
	togglePreserveAspectRatio,
} from '@extensions/svg';

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
} from '@maxi-icons';

const IconControlResponsiveSettings = withRTC(props => {
	const {
		onChangeInline = null,
		onChange,
		clientId,
		svgType,
		breakpoint,
		isHover = false,
		isIB = false,
		disableBackground = false,
		disableBorder = false,
		disableIconInherit = false,
		disableIconOnly = false,
		disablePadding = false,
		disablePosition = false,
		disableSpacing = false,
		disableHeightFitContent = false,
		disablePositionY = false,
		getIconWithColor,
		inlineTarget,
		prefix = '',
		[`${prefix}icon-only`]: iconOnly,
		[`${prefix}icon-inherit`]: iconInherit,
	} = props;

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
		<>
			{!isIB && !disableIconOnly && !isHover && breakpoint === 'general' && (
				<>
					<hr />
					<ToggleSwitch
						label={__('Icon only (remove text)', 'maxi-blocks')}
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
				disableHeightFitContent={disableHeightFitContent}
				isIB={isIB}
			/>
			{svgType !== 'Shape' && (
				<SvgStrokeWidthControl
					{...getGroupAttributes(props, 'icon', isHover, prefix)}
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
			{!isHover && !iconOnly && (
				<>
					{!disableSpacing && (
						<AdvancedNumberControl
							label={__('Spacing', 'maxi-blocks')}
							className='maxi-icon-control__spacing'
							min={0}
							max={999}
							initial={1}
							step={1}
							breakpoint={breakpoint}
							value={props[`${prefix}icon-spacing-${breakpoint}`]}
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
									isReset: true,
								})
							}
						/>
					)}
					{!isIB && !disablePosition && (
						<AxisPositionControl
							label='Icon'
							className='maxi-icon-control__position'
							selected={props[`${prefix}icon-position`]}
							onChange={val => {
								onChange({
									[`${prefix}icon-position`]: val,
								});
							}}
							disableY={disablePositionY}
							breakpoint={breakpoint}
						/>
					)}
				</>
			)}
			{!disableIconInherit && !isHover && breakpoint === 'general' && (
				<ToggleSwitch
					label={__(
						'Inherit stroke colour/background from button',
						'maxi-blocks'
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
							color={getAttributeValue({
								target: 'icon-stroke-color',
								props,
								isHover,
								prefix,
							})}
							prefix={`${prefix}icon-stroke-`}
							paletteColor={getAttributeValue({
								target: 'icon-stroke-palette-color',
								props,
								isHover,
								prefix,
							})}
							paletteOpacity={getAttributeValue({
								target: 'icon-stroke-palette-opacity',
								props,
								isHover,
								prefix,
							})}
							paletteStatus={getAttributeValue({
								target: 'icon-stroke-palette-status',
								props,
								isHover,
								prefix,
							})}
							paletteSCStatus={getAttributeValue({
								target: 'icon-stroke-palette-sc-status',
								props,
								isHover,
								prefix,
							})}
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
								paletteSCStatus,
								paletteOpacity,
							}) => {
								const icon = getIconWithColor({
									color,
									paletteColor,
									paletteStatus,
									paletteSCStatus,
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
									[`${prefix}icon-stroke-palette-sc-status${
										isHover ? '-hover' : ''
									}`]: paletteSCStatus,
									[`${prefix}icon-stroke-palette-opacity${
										isHover ? '-hover' : ''
									}`]: paletteOpacity,
									[`${prefix}icon-content`]: icon,
								});
							}}
							isHover={isHover}
							globalProps={{
								target: `${isHover ? 'hover-line' : 'line'}`,
								type: 'icon',
							}}
						/>
					)
				) : (
					<InfoBox
						key='maxi-warning-box__icon-color'
						message={__(
							'Icon stroke colour is inheriting from button.',
							'maxi-blocks'
						)}
						links={[
							{
								title: __('Button colour', 'maxi-blocks'),
								panel: 'typography',
							},
						]}
					/>
				))}
			{iconStyle === 'border' && (
				<BorderControl
					{...getGroupAttributes(
						props,
						['iconBorder', 'iconBorderWidth', 'iconBorderRadius'],
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
					color={getAttributeValue({
						target: 'icon-fill-color',
						props,
						isHover,
						prefix,
					})}
					prefix={`${prefix}icon-fill-`}
					paletteColor={getAttributeValue({
						target: 'icon-fill-palette-color',
						props,
						isHover,
						prefix,
					})}
					paletteOpacity={getAttributeValue({
						target: 'icon-fill-palette-opacity',
						props,
						isHover,
						prefix,
					})}
					paletteStatus={getAttributeValue({
						target: 'icon-fill-palette-status',
						props,
						isHover,
						prefix,
					})}
					paletteSCStatus={getAttributeValue({
						target: 'icon-fill-palette-sc-status',
						props,
						isHover,
						prefix,
					})}
					onChangeInline={({ color }) =>
						onChangeInline &&
						onChangeInline({ fill: color }, '[data-fill]', true)
					}
					onChange={({
						color,
						paletteColor,
						paletteStatus,
						paletteSCStatus,
						paletteOpacity,
					}) => {
						const icon = getIconWithColor({
							color,
							paletteColor,
							paletteStatus,
							paletteSCStatus,
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
							[`${prefix}icon-fill-palette-sc-status${
								isHover ? '-hover' : ''
							}`]: paletteSCStatus,
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
								label={__('Icon background', 'maxi-blocks')}
								paletteStatus={getLastBreakpointAttribute({
									target: `${prefix}icon-background-palette-status`,
									breakpoint,
									attributes: props,
									isHover,
								})}
								paletteSCStatus={getLastBreakpointAttribute({
									target: `${prefix}icon-background-palette-sc-status`,
									breakpoint,
									attributes: props,
									isHover,
								})}
								paletteColor={getLastBreakpointAttribute({
									target: `${prefix}icon-background-palette-color`,
									breakpoint,
									attributes: props,
									isHover,
									prefix,
								})}
								paletteOpacity={getLastBreakpointAttribute({
									target: `${prefix}icon-background-palette-opacity`,
									breakpoint,
									attributes: props,
									isHover,
									prefix,
								})}
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
									paletteSCStatus,
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
												'background-palette-sc-status',
												isHover,
												`${prefix}icon-`,
												breakpoint
											)]: paletteSCStatus,
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
							{...getGroupAttributes(
								props,
								'iconBackgroundGradient',
								isHover,
								prefix
							)}
							label={__(
								'Icon background gradient',
								'maxi-blocks'
							)}
							breakpoint={breakpoint}
							prefix={`${prefix}icon-background-`}
							isHover={isHover}
							onChange={onChange}
						/>
					)}
				</>
			)}
			{!disablePadding && !isHover && (
				<AxisControl
					{...getGroupAttributes(props, 'iconPadding', false, prefix)}
					prefix={prefix}
					label={__('Icon padding', 'maxi-blocks')}
					onChange={onChange}
					breakpoint={breakpoint}
					target='icon-padding'
					disableAuto
					optionType='string'
					minMaxSettings={minMaxSettings}
					enableAxisUnits
				/>
			)}
		</>
	);
});

/**
 * Component
 */
const IconControl = props => {
	const {
		className,
		onChange,
		breakpoint,
		blockStyle,
		isHover = false,
		isIB = false,
		disableModal = false,
		disableHeightFitContent = false,
		getIconWithColor,
		ariaLabels,
		type = 'button-icon',
		prefix = '',
		[`${prefix}icon-content`]: iconContent,
		disablePadding = false,
	} = props;

	const classes = classnames(
		'maxi-icon-control',
		className,
		disablePadding
			? 'maxi-accordion-control__item__panel--disable-padding'
			: ''
	);

	return (
		<div className={classes}>
			{!isIB && !disableModal && !isHover && breakpoint === 'general' && (
				<MaxiModal
					type={type}
					style={blockStyle}
					onSelect={obj => {
						const newSvgType = obj[`${prefix}svgType`];

						let icon = getIconWithColor({
							rawIcon: obj[`${prefix}icon-content`],
							type: [
								newSvgType !== 'Shape' && 'stroke',
								newSvgType !== 'Line' && 'fill',
							].filter(Boolean),
						});

						if (
							!disableHeightFitContent &&
							shouldSetPreserveAspectRatio(
								props,
								`${prefix}icon-`
							)
						) {
							icon = togglePreserveAspectRatio(icon, true);
						}

						if (type === 'button-icon') {
							if (icon && ariaLabels?.icon) {
								icon = setSVGAriaLabel(
									ariaLabels.icon,
									() => icon,
									'icon'
								);
							}
						} else if (type === 'search-icon') {
							if (
								prefix === 'close-' &&
								icon &&
								ariaLabels?.['close icon']
							) {
								icon = setSVGAriaLabel(
									ariaLabels['close icon'],
									() => icon,
									'search'
								);
							} else if (icon && ariaLabels?.icon) {
								icon = setSVGAriaLabel(
									ariaLabels.icon,
									() => icon,
									'search'
								);
							}
						}

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
			{iconContent && <IconControlResponsiveSettings {...props} />}
		</div>
	);
};

export default IconControl;
