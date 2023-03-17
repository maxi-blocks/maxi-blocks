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
import withRTC from '../../extensions/maxi-block/withRTC';
import {
	getAttributeKey,
	getAttributesValue,
	getDefaultAttribute,
	getGroupAttributes,
	getLastBreakpointAttribute,
} from '../../extensions/styles';
import { togglePreserveAspectRatio } from '../../extensions/svg';
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

const IconControlResponsiveSettings = withRTC(props => {
	const {
		onChangeInline = null,
		onChange,
		clientId,
		svgType,
		breakpoint,
		isHover = false,
		isInteractionBuilder = false,
		disableBackground = false,
		disableBorder = false,
		disableIconInherit = false,
		disableIconOnly = false,
		disablePadding = false,
		disablePosition = false,
		disableSpacing = false,
		disableHeightFitContent = false,
		getIconWithColor,
		inlineTarget,
		prefix = '',
	} = props;
	const { iconOnly, iconInherit, iconContent, iconPosition } =
		getAttributesValue({
			target: [
				'icon-only',
				'icon-inherit',
				'icon-content',
				'icon-position',
			],
			props,
			prefix,
		});
	const iconSpacing = getAttributesValue({
		target: 'icon-spacing',
		props,
		prefix,
		breakpoint,
	});

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
			{!isInteractionBuilder &&
				!disableIconOnly &&
				!isHover &&
				breakpoint === 'general' && (
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
					content={iconContent}
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
						value={iconSpacing}
						onChangeValue={val => {
							onChange({
								[`${prefix}icon-spacing-${breakpoint}`]:
									val !== undefined && val !== '' ? val : '',
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
					{!disablePosition && (
						<AxisPositionControl
							label='Icon'
							className='maxi-icon-control__position'
							selected={iconPosition}
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
			{!disableIconInherit && !isHover && breakpoint === 'general' && (
				<ToggleSwitch
					label={__(
						'Inherit stroke colour/background from button',
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
							color={getAttributesValue({
								target: 'icon-stroke-color',
								props,
								isHover,
								prefix,
							})}
							prefix={`${prefix}icon-stroke-`}
							paletteColor={getAttributesValue({
								target: 'icon-stroke-palette-color',
								props,
								isHover,
								prefix,
							})}
							paletteOpacity={getAttributesValue({
								target: 'icon-stroke-palette-opacity',
								props,
								isHover,
								prefix,
							})}
							paletteStatus={getAttributesValue({
								target: 'icon-stroke-palette-status',
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
									[getAttributeKey(
										'color',
										isHover,
										`${prefix}icon-stroke-`
									)]: color,
									[getAttributeKey(
										'palette-color',
										isHover,
										`${prefix}icon-stroke-`
									)]: paletteColor,
									[getAttributeKey(
										'palette-status',
										isHover,
										`${prefix}icon-stroke-`
									)]: paletteStatus,
									[getAttributeKey(
										'palette-opacity',
										isHover,
										`${prefix}icon-stroke-`
									)]: paletteOpacity,
									[getAttributeKey(
										'content',
										isHover,
										`${prefix}icon-`
									)]: icon,
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
					color={getAttributesValue({
						target: 'icon-fill-color',
						props,
						isHover,
						prefix,
					})}
					prefix={`${prefix}icon-fill-`}
					paletteColor={getAttributesValue({
						target: 'icon-fill-palette-color',
						props,
						isHover,
						prefix,
					})}
					paletteOpacity={getAttributesValue({
						target: 'icon-fill-palette-opacity',
						props,
						isHover,
						prefix,
					})}
					paletteStatus={getAttributesValue({
						target: 'icon-fill-palette-status',
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
							[getAttributeKey(
								'color',
								isHover,
								`${prefix}icon-fill-`
							)]: color,
							[getAttributeKey(
								'palette-color',
								isHover,
								`${prefix}icon-fill-`
							)]: paletteColor,
							[getAttributeKey(
								'palette-status',
								isHover,
								`${prefix}icon-fill-`
							)]: paletteStatus,
							[getAttributeKey(
								'palette-opacity',
								isHover,
								`${prefix}icon-fill-`
							)]: paletteOpacity,
							[getAttributeKey(
								'content',
								isHover,
								`${prefix}icon-`
							)]: icon,
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
							{...getGroupAttributes(
								props,
								'iconBackgroundGradient',
								isHover,
								prefix
							)}
							label={__(
								'Icon Background gradient',
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
		isInteractionBuilder = false,
		disableModal = false,
		disableHeightFitContent = false,
		getIconWithColor,
		type = 'button-icon',
		prefix = '',
		[`${prefix}icon-content`]: iconContent,
	} = props;

	const heightFitContent = getLastBreakpointAttribute({
		target: `${prefix}icon-width-fit-content`,
		breakpoint,
		attributes: props,
		isHover,
	});

	const classes = classnames('maxi-icon-control', className);

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
							const newSvgType = obj[`${prefix}svgType`];

							let icon = getIconWithColor({
								rawIcon: obj[`${prefix}icon-content`],
								type: [
									newSvgType !== 'Shape' && 'stroke',
									newSvgType !== 'Line' && 'fill',
								].filter(Boolean),
							});

							if (!disableHeightFitContent && heightFitContent)
								icon = togglePreserveAspectRatio(icon, true);

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
