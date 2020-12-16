/**
 * WordPress dependencies
 */
const { __ } = wp.i18n;
const { InspectorControls } = wp.blockEditor;
const { TextControl, Icon } = wp.components;
const { Fragment } = wp.element;

/**
 * Internal dependencies
 */
import {
	AccordionControl,
	AlignmentControl,
	BackgroundControl,
	BorderControl,
	BlockStylesControl,
	BoxShadowControl,
	DefaultStylesControl,
	FullSizeControl,
	SettingTabsControl,
	TypographyControl,
	ZIndexControl,
	AxisControl,
	ResponsiveControl,
	PositionControl,
	DisplayControl,
	MotionControl,
	TransformControl,
	EntranceAnimationControl,
	FancyRadioControl,
	FontIconControl,
	CustomLabel,
} from '../../components';
import { getDefaultProp } from '../../utils';
import * as defaultPresets from './defaults';

/**
 * External dependencies
 */
import { isObject, merge } from 'lodash';

/**
 * Icons
 */
import {
	presetOne,
	presetTwo,
	presetThree,
	presetFour,
	presetFive,
	presetSix,
} from '../../icons';

/**
 * Inspector
 */
const Inspector = props => {
	const {
		attributes: {
			customLabel,
			uniqueID,
			isFirstOnHierarchy,
			blockStyle,
			defaultBlockStyle,
			highlight,
			blockStyleBackground,
			alignment,
			alignmentText,
			typography,
			typographyHover,
			background,
			backgroundHover,
			border,
			borderHover,
			size,
			boxShadow,
			boxShadowHover,
			margin,
			padding,
			extraClassName,
			zIndex,
			breakpoints,
			position,
			display,
			motion,
			transform,
			icon,
			iconPadding,
			iconBorder,
			iconBackground,
		},
		deviceType,
		setAttributes,
		clientId,
		formatValue,
	} = props;

	const backgroundHoverValue = !isObject(backgroundHover)
		? JSON.parse(backgroundHover)
		: backgroundHover;
	const borderValue = !isObject(border) ? JSON.parse(border) : border;
	const backgroundValue = !isObject(background)
		? JSON.parse(background)
		: background;
	const paddingValue = !isObject(padding) ? JSON.parse(padding) : padding;
	const typographyValue = !isObject(typography)
		? JSON.parse(typography)
		: typography;
	const boxShadowValue = !isObject(boxShadow)
		? JSON.parse(boxShadow)
		: boxShadow;
	const iconValue = !isObject(icon) ? JSON.parse(icon) : icon;
	const iconBorderValue = !isObject(iconBorder)
		? JSON.parse(iconBorder)
		: iconBorder;
	const iconBackgroundValue = !isObject(iconBackground)
		? JSON.parse(iconBackground)
		: iconBackground;
	const iconPaddingValue = !isObject(iconPadding)
		? JSON.parse(iconPadding)
		: iconPadding;

	const onChangePreset = number => {
		const response = {
			border: borderValue,
			background: backgroundValue,
			padding: paddingValue,
			typography: typographyValue,
			boxShadow: boxShadowValue,
			icon: iconValue,
			iconBorder: iconBorderValue,
			iconBackground: iconBackgroundValue,
			iconPadding: iconPaddingValue,
		};

		const result = merge(response, defaultPresets[`preset${number}`]);

		Object.entries(result).forEach(([key, value]) => {
			result[key] = JSON.stringify(value);
		});

		setAttributes(result);
	};

	const boxShadowHoverValue = !isObject(boxShadowHover)
		? JSON.parse(boxShadowHover)
		: boxShadowHover;

	const typographyHoverValue = !isObject(typographyHover)
		? JSON.parse(typographyHover)
		: typographyHover;

	const borderHoverValue = !isObject(borderHover)
		? JSON.parse(borderHover)
		: borderHover;

	return (
		<InspectorControls>
			<SettingTabsControl
				disablePadding
				items={[
					{
						label: __('Style', 'maxi-blocks'),
						content: (
							<Fragment>
								<div className='maxi-tab-content__box'>
									<CustomLabel
										customLabel={customLabel}
										onChange={customLabel =>
											setAttributes({ customLabel })
										}
									/>
									<hr />
									<BlockStylesControl
										blockStyle={blockStyle}
										blockStyleBackground={
											blockStyleBackground
										}
										defaultBlockStyle={defaultBlockStyle}
										isFirstOnHierarchy={isFirstOnHierarchy}
										highlight={highlight}
										onChange={highlight =>
											setAttributes({ highlight })
										}
										disableHighlightColor1
										disableHighlightColor2
										border={border}
										onChangeBorder={border =>
											setAttributes({ border })
										}
									/>
								</div>
								<AccordionControl
									isSecondary
									items={[
										deviceType === 'general' && {
											label: __('Style', 'maxi-blocks'),
											content: (
												<DefaultStylesControl
													className='maxi-button-default-styles'
													items={[
														{
															activeItem: 0,
															content: (
																<Icon
																	icon={
																		presetOne
																	}
																/>
															),
															onChange: () =>
																onChangePreset(
																	1
																),
														},
														{
															activeItem: 0,
															content: (
																<Icon
																	icon={
																		presetTwo
																	}
																/>
															),
															onChange: () =>
																onChangePreset(
																	2
																),
														},
														{
															activeItem: 0,
															content: (
																<Icon
																	icon={
																		presetThree
																	}
																/>
															),
															onChange: () =>
																onChangePreset(
																	3
																),
														},
														{
															activeItem: 0,
															content: (
																<Icon
																	icon={
																		presetFour
																	}
																/>
															),
															onChange: () =>
																onChangePreset(
																	4
																),
														},
														{
															activeItem: 0,
															content: (
																<Icon
																	icon={
																		presetFive
																	}
																/>
															),
															onChange: () =>
																onChangePreset(
																	5
																),
														},
														{
															activeItem: 0,
															content: (
																<Icon
																	icon={
																		presetSix
																	}
																/>
															),
															onChange: () =>
																onChangePreset(
																	6
																),
														},
													]}
												/>
											),
										},
										{
											label: __('Icon', 'maxi-blocks'),
											content: (
												<FontIconControl
													icon={icon}
													onChange={obj => {
														setAttributes(obj);
													}}
													iconBorder={iconBorder}
													iconPadding={iconPadding}
													iconBackground={
														iconBackground
													}
													breakpoint={deviceType}
												/>
											),
										},
										{
											label: __(
												'Alignment',
												'maxi-blocks'
											),
											content: (
												<Fragment>
													<AlignmentControl
														label={__(
															'Button',
															'maxi-blocks'
														)}
														alignment={alignment}
														onChange={alignment =>
															setAttributes({
																alignment,
															})
														}
														breakpoint={deviceType}
														disableJustify
													/>
													<AlignmentControl
														label={__(
															'Text',
															'maxi-blocks'
														)}
														alignment={
															alignmentText
														}
														onChange={alignmentText =>
															setAttributes({
																alignmentText,
															})
														}
														breakpoint={deviceType}
													/>
												</Fragment>
											),
										},
										{
											label: __(
												'Typography',
												'maxi-blocks'
											),
											disablePadding: true,
											content: (
												<SettingTabsControl
													items={[
														{
															label: __(
																'Normal',
																'maxi-blocks'
															),
															content: (
																<TypographyControl
																	typography={
																		typography
																	}
																	defaultTypography={getDefaultProp(
																		clientId,
																		'typography'
																	)}
																	onChange={obj =>
																		setAttributes(
																			obj
																		)
																	}
																	hideAlignment
																	breakpoint={
																		deviceType
																	}
																	formatValue={
																		formatValue
																	}
																/>
															),
														},
														{
															label: __(
																'Hover',
																'maxi-blocks'
															),
															content: (
																<Fragment>
																	<FancyRadioControl
																		label={__(
																			'Enable Typography Hover',
																			'maxi-blocks'
																		)}
																		selected={Number(
																			typographyHoverValue.status
																		)}
																		options={[
																			{
																				label: __(
																					'Yes',
																					'maxi-blocks'
																				),
																				value: 1,
																			},
																			{
																				label: __(
																					'No',
																					'maxi-blocks'
																				),
																				value: 0,
																			},
																		]}
																		onChange={val => {
																			typographyHoverValue.status = Number(
																				val
																			);
																			setAttributes(
																				{
																					typographyHover: JSON.stringify(
																						typographyHoverValue
																					),
																				}
																			);
																		}}
																	/>
																	{!!typographyHoverValue.status && (
																		<TypographyControl
																			typography={
																				typographyHover
																			}
																			defaultTypography={getDefaultProp(
																				clientId,
																				'typographyHover'
																			)}
																			onChange={obj => {
																				setAttributes(
																					{
																						typographyHover:
																							obj.typography,
																						...(obj.content && {
																							content:
																								obj.content,
																						}),
																					}
																				);
																			}}
																			hideAlignment
																			breakpoint={
																				deviceType
																			}
																			formatValue={
																				formatValue
																			}
																			isHover
																		/>
																	)}
																</Fragment>
															),
														},
													]}
												/>
											),
										},
										deviceType === 'general' && {
											label: __(
												'Background',
												'maxi-blocks'
											),
											disablePadding: true,
											content: (
												<SettingTabsControl
													items={[
														{
															label: __(
																'Normal',
																'maxi-blocks'
															),
															content: (
																<Fragment>
																	<BackgroundControl
																		background={
																			background
																		}
																		defaultBackground={getDefaultProp(
																			clientId,
																			'background'
																		)}
																		onChange={background =>
																			setAttributes(
																				{
																					background,
																				}
																			)
																		}
																		disableImage
																		disableVideo
																		disableClipPath
																		disableSVG
																		disableLayers
																	/>
																</Fragment>
															),
														},
														{
															label: __(
																'Hover',
																'maxi-blocks'
															),
															content: (
																<Fragment>
																	<FancyRadioControl
																		label={__(
																			'Enable Background Hover',
																			'maxi-blocks'
																		)}
																		selected={
																			backgroundHoverValue.status
																		}
																		options={[
																			{
																				label: __(
																					'Yes',
																					'maxi-blocks'
																				),
																				value: 1,
																			},
																			{
																				label: __(
																					'No',
																					'maxi-blocks'
																				),
																				value: 0,
																			},
																		]}
																		onChange={val => {
																			backgroundHoverValue.status = Number(
																				val
																			);
																			setAttributes(
																				{
																					backgroundHover: JSON.stringify(
																						backgroundHoverValue
																					),
																				}
																			);
																		}}
																	/>
																	{!!backgroundHoverValue.status && (
																		<BackgroundControl
																			background={
																				backgroundHover
																			}
																			defaultBackground={getDefaultProp(
																				clientId,
																				'backgroundHover'
																			)}
																			onChange={backgroundHover =>
																				setAttributes(
																					{
																						backgroundHover,
																					}
																				)
																			}
																			disableImage
																			disableVideo
																			disableClipPath
																			disableSVG
																			disableLayers
																		/>
																	)}
																</Fragment>
															),
														},
													]}
												/>
											),
										},
										{
											label: __('Border', 'maxi-blocks'),
											disablePadding: true,
											content: (
												<SettingTabsControl
													items={[
														{
															label: __(
																'Normal',
																'maxi-blocks'
															),
															content: (
																<BorderControl
																	border={
																		border
																	}
																	defaultBorder={getDefaultProp(
																		clientId,
																		'border'
																	)}
																	onChange={border =>
																		setAttributes(
																			{
																				border,
																			}
																		)
																	}
																	breakpoint={
																		deviceType
																	}
																/>
															),
														},
														{
															label: __(
																'Hover',
																'maxi-blocks'
															),
															content: (
																<Fragment>
																	<FancyRadioControl
																		label={__(
																			'Enable Border Hover',
																			'maxi-blocks'
																		)}
																		selected={Number(
																			borderHoverValue.status
																		)}
																		options={[
																			{
																				label: __(
																					'Yes',
																					'maxi-blocks'
																				),
																				value: 1,
																			},
																			{
																				label: __(
																					'No',
																					'maxi-blocks'
																				),
																				value: 0,
																			},
																		]}
																		onChange={val => {
																			borderHoverValue.status = Number(
																				val
																			);
																			setAttributes(
																				{
																					borderHover: JSON.stringify(
																						borderHoverValue
																					),
																				}
																			);
																		}}
																	/>
																	{!!borderHoverValue.status && (
																		<BorderControl
																			border={
																				borderHover
																			}
																			defaultBorder={getDefaultProp(
																				clientId,
																				'borderHover'
																			)}
																			onChange={borderHover =>
																				setAttributes(
																					{
																						borderHover,
																					}
																				)
																			}
																			breakpoint={
																				deviceType
																			}
																		/>
																	)}
																</Fragment>
															),
														},
													]}
												/>
											),
										},
										{
											label: __(
												'Width / Height',
												'maxi-blocks'
											),
											content: (
												<FullSizeControl
													size={size}
													defaultSize={getDefaultProp(
														clientId,
														'size'
													)}
													onChange={size =>
														setAttributes({ size })
													}
													breakpoint={deviceType}
												/>
											),
										},
										{
											label: __(
												'Box Shadow',
												'maxi-blocks'
											),
											disablePadding: true,
											content: (
												<SettingTabsControl
													items={[
														{
															label: __(
																'Normal',
																'maxi-blocks'
															),
															content: (
																<BoxShadowControl
																	boxShadow={
																		boxShadow
																	}
																	defaultBoxShadow={getDefaultProp(
																		clientId,
																		'boxShadow'
																	)}
																	onChange={boxShadow =>
																		setAttributes(
																			{
																				boxShadow,
																			}
																		)
																	}
																	breakpoint={
																		deviceType
																	}
																/>
															),
														},
														{
															label: __(
																'Hover',
																'maxi-blocks'
															),
															content: (
																<Fragment>
																	<FancyRadioControl
																		label={__(
																			'Enable Border Hover',
																			'maxi-blocks'
																		)}
																		selected={Number(
																			boxShadowHoverValue.status
																		)}
																		options={[
																			{
																				label: __(
																					'Yes',
																					'maxi-blocks'
																				),
																				value: 1,
																			},
																			{
																				label: __(
																					'No',
																					'maxi-blocks'
																				),
																				value: 0,
																			},
																		]}
																		onChange={val => {
																			boxShadowHoverValue.status = Number(
																				val
																			);
																			setAttributes(
																				{
																					boxShadowHover: JSON.stringify(
																						boxShadowHoverValue
																					),
																				}
																			);
																		}}
																	/>
																	{!!boxShadowHoverValue.status && (
																		<BoxShadowControl
																			boxShadow={
																				boxShadowHover
																			}
																			defaultBoxShadow={getDefaultProp(
																				clientId,
																				'boxShadowHover'
																			)}
																			onChange={boxShadowHover =>
																				setAttributes(
																					{
																						boxShadowHover,
																					}
																				)
																			}
																			breakpoint={
																				deviceType
																			}
																		/>
																	)}
																</Fragment>
															),
														},
													]}
												/>
											),
										},
										{
											label: __(
												'Padding / Margin',
												'maxi-blocks'
											),
											content: (
												<Fragment>
													<AxisControl
														values={padding}
														defaultValues={getDefaultProp(
															clientId,
															'padding'
														)}
														onChange={padding =>
															setAttributes({
																padding,
															})
														}
														breakpoint={deviceType}
														disableAuto
													/>
													<AxisControl
														values={margin}
														defaultValues={getDefaultProp(
															clientId,
															'margin'
														)}
														onChange={margin =>
															setAttributes({
																margin,
															})
														}
														breakpoint={deviceType}
													/>
												</Fragment>
											),
										},
									]}
								/>
							</Fragment>
						),
					},
					{
						label: __('Advanced', 'maxi-blocks'),
						content: (
							<Fragment>
								<AccordionControl
									isPrimary
									items={[
										deviceType === 'general' && {
											label: __(
												'Custom Classes',
												'maxi-blocks'
											),
											content: (
												<TextControl
													label={__(
														'Additional CSS Classes',
														'maxi-blocks'
													)}
													className='maxi-additional__css-classes'
													value={extraClassName}
													onChange={extraClassName =>
														setAttributes({
															extraClassName,
														})
													}
												/>
											),
										},
										{
											label: __(
												'Motion Effects',
												'maxi-blocks'
											),
											content: (
												<MotionControl
													motion={motion}
													onChange={motion =>
														setAttributes({
															motion,
														})
													}
												/>
											),
										},
										{
											label: __(
												'Entrance Animation',
												'maxi-blocks'
											),
											content: (
												<EntranceAnimationControl
													motion={motion}
													defaultMotion={getDefaultProp(
														clientId,
														'motion'
													)}
													onChange={motion =>
														setAttributes({
															motion,
														})
													}
												/>
											),
										},
										{
											label: __(
												'Transform',
												'maxi-blocks'
											),
											content: (
												<TransformControl
													transform={transform}
													onChange={transform =>
														setAttributes({
															transform,
														})
													}
													uniqueID={uniqueID}
													breakpoint={deviceType}
												/>
											),
										},
										{
											label: __('Display', 'maxi-blocks'),
											content: (
												<DisplayControl
													display={display}
													onChange={display =>
														setAttributes({
															display,
														})
													}
													breakpoint={deviceType}
												/>
											),
										},
										{
											label: __(
												'Position',
												'maxi-blocks'
											),
											content: (
												<PositionControl
													position={position}
													defaultPosition={getDefaultProp(
														clientId,
														'position'
													)}
													onChange={position =>
														setAttributes({
															position,
														})
													}
													breakpoint={deviceType}
												/>
											),
										},
										deviceType !== 'general' && {
											label: __(
												'Breakpoint',
												'maxi-blocks'
											),
											content: (
												<ResponsiveControl
													breakpoints={breakpoints}
													defaultBreakpoints={getDefaultProp(
														clientId,
														'breakpoints'
													)}
													onChange={breakpoints =>
														setAttributes({
															breakpoints,
														})
													}
													breakpoint={deviceType}
												/>
											),
										},
										{
											label: __('Z-index', 'maxi-blocks'),
											content: (
												<ZIndexControl
													zIndex={zIndex}
													defaultZIndex={getDefaultProp(
														clientId,
														'zIndex'
													)}
													onChange={zIndex =>
														setAttributes({
															zIndex,
														})
													}
													breakpoint={deviceType}
												/>
											),
										},
									]}
								/>
							</Fragment>
						),
					},
				]}
			/>
		</InspectorControls>
	);
};

export default Inspector;
