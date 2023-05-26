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
} from '../../extensions/attributes';
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
	const [iconOnly, iconInherit, iconContent, iconPosition] =
		getAttributesValue({
			target: ['i_on', 'i_i', 'i_c', 'i_pos'],
			props,
			prefix,
		});
	const iconSpacing = getAttributesValue({
		target: 'i_spa',
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
		target: 'i-b_am',
		prefix,
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
									[getAttributeKey({ key: 'i_on', prefix })]:
										val,
									[getAttributeKey({ key: 'i_c', prefix })]:
										icon,
								});
							}}
						/>
					</>
				)}
			<SvgWidthControl
				{...getGroupAttributes(props, 'icon', isHover, prefix)}
				className='maxi-icon-control__width'
				onChange={onChange}
				prefix={`${prefix}i-`}
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
					prefix={`${prefix}i-`}
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
								[getAttributeKey({
									key: 'i_spa',
									prefix,
									breakpoint,
								})]: val !== undefined && val !== '' ? val : '',
							});
						}}
						onReset={() =>
							onChange({
								[getAttributeKey({
									key: 'i_spa',
									prefix,
									breakpoint,
								})]: getDefaultAttribute(
									getAttributeKey({
										key: 'i_spa',
										prefix,
										breakpoint,
									})
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
									[getAttributeKey({ key: 'i_pos', prefix })]:
										val,
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
							[getAttributeKey({ key: 'i_i', prefix })]: val,
							[getAttributeKey({ key: 'i_c', prefix })]: icon,
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
								target: 'i-str_cc',
								props,
								isHover,
								prefix,
							})}
							prefix={`${prefix}i-str-`}
							paletteColor={getAttributesValue({
								target: 'i-str_pc',
								props,
								isHover,
								prefix,
							})}
							paletteOpacity={getAttributesValue({
								target: 'i-str_po',
								props,
								isHover,
								prefix,
							})}
							paletteStatus={getAttributesValue({
								target: 'i-str_ps',
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
									[getAttributeKey({
										key: '_cc',
										isHover,
										prefix: `${prefix}i-str-`,
									})]: color,
									[getAttributeKey({
										key: '_pc',
										isHover,
										prefix: `${prefix}i-str-`,
									})]: paletteColor,
									[getAttributeKey({
										key: '_ps',
										isHover,
										prefix: `${prefix}i-str-`,
									})]: paletteStatus,
									[getAttributeKey({
										key: '_po',
										isHover,
										prefix: `${prefix}i-str-`,
									})]: paletteOpacity,
									[getAttributeKey({ key: 'i_c', prefix })]:
										icon,
								});
							}}
							isHover={isHover}
							globalProps={{
								target: `${isHover ? 'h-li' : 'li'}`,
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
					prefix={`${prefix}i-`}
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
						target: 'i-f_cc',
						props,
						isHover,
						prefix,
					})}
					prefix={`${prefix}i-f-`}
					paletteColor={getAttributesValue({
						target: 'i-f_pc',
						props,
						isHover,
						prefix,
					})}
					paletteOpacity={getAttributesValue({
						target: 'i-f_po',
						props,
						isHover,
						prefix,
					})}
					paletteStatus={getAttributesValue({
						target: 'i-f_ps',
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
							[getAttributeKey({
								key: '_cc',
								isHover,
								prefix: `${prefix}i-f-`,
							})]: color,
							[getAttributeKey({
								key: '_pc',
								isHover,
								prefix: `${prefix}i-f-`,
							})]: paletteColor,
							[getAttributeKey({
								key: '_ps',
								isHover,
								prefix: `${prefix}i-f-`,
							})]: paletteStatus,
							[getAttributeKey({
								key: '_po',
								isHover,
								prefix: `${prefix}i-f-`,
							})]: paletteOpacity,
							[getAttributeKey({
								key: '_c',
								isHover,
								prefix: `${prefix}i-`,
							})]: icon,
						});
					}}
					isHover={isHover}
					globalProps={{
						target: `${isHover ? 'h-f' : 'f'}`,
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
								[getAttributeKey({
									key: 'b_am',
									prefix: `${prefix}i-`,
									breakpoint,
								})]: val,
							});
						}}
					/>
					{iconBgActive === 'color' &&
						(!iconInherit || disableIconInherit ? (
							<ColorControl
								label={__('Icon background', 'maxi-blocks')}
								paletteStatus={getLastBreakpointAttribute({
									target: 'i-bc_ps',
									prefix,
									breakpoint,
									attributes: props,
									isHover,
								})}
								paletteColor={getLastBreakpointAttribute({
									target: 'i-bc_pc',
									prefix,
									breakpoint,
									attributes: props,
									isHover,
								})}
								paletteOpacity={getLastBreakpointAttribute({
									target: 'i-bc_po',
									prefix,
									breakpoint,
									attributes: props,
									isHover,
								})}
								color={getLastBreakpointAttribute({
									target: 'i-bc_cc',
									breakpoint,
									attributes: props,
									isHover,
									prefix,
								})}
								prefix={`${prefix}i-bc-`}
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
											[getAttributeKey({
												key: 'bc_ps',
												isHover,
												prefix: `${prefix}i-`,
												breakpoint,
											})]: paletteStatus,
											[getAttributeKey({
												key: 'bc_pc',
												isHover,
												prefix: `${prefix}i-`,
												breakpoint,
											})]: paletteColor,
											[getAttributeKey({
												key: 'bc_po',
												isHover,
												prefix: `${prefix}i-`,
												breakpoint,
											})]: paletteOpacity,
											[getAttributeKey({
												key: 'bc_cc',
												isHover,
												prefix: `${prefix}i-`,
												breakpoint,
											})]: color,
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
							prefix={`${prefix}i-bg-`}
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
					target='i_p'
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
		isInteractionBuilder = false,
		disableModal = false,
		disableHeightFitContent = false,
		getIconWithColor,
		type = 'button-icon',
		prefix = '',
	} = props;
	const iconContent = getAttributesValue({
		target: 'i_c',
		prefix,
		props,
	});

	const heightFitContent = getLastBreakpointAttribute({
		target: 'i_wfc',
		prefix,
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
							const newSvgType =
								obj[getAttributeKey({ key: '_st', prefix })];

							let icon = getIconWithColor({
								rawIcon:
									obj[
										getAttributeKey({ key: 'i_c', prefix })
									],
								type: [
									newSvgType !== 'Shape' && 'stroke',
									newSvgType !== 'Line' && 'fill',
								].filter(Boolean),
							});

							if (!disableHeightFitContent && heightFitContent)
								icon = togglePreserveAspectRatio(icon, true);

							onChange({
								[getAttributeKey({ key: '_st', prefix })]:
									newSvgType,
								[getAttributeKey({ key: 'i_c', prefix })]: icon,
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
