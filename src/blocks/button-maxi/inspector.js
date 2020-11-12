/**
 * WordPress dependencies
 */
const { __ } = wp.i18n;
const { InspectorControls } = wp.blockEditor;
const { TextControl } = wp.components;
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
	__experimentalZIndexControl,
	__experimentalAxisControl,
	__experimentalResponsiveControl,
	__experimentalPositionControl,
	__experimentalDisplayControl,
	__experimentalMotionControl,
	__experimentalTransformControl,
	__experimentalEntranceAnimationControl,
	__experimentalFancyRadioControl,
	__experimentalFontIconControl,
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
	PresetOne,
	PresetTwo,
	PresetThree,
	PresetFour,
	PresetFive,
	PresetSix,
} from '../../icons';

/**
 * Inspector
 */
const Inspector = props => {
	const {
		attributes: {
			uniqueID,
			isFirstOnHierarchy,
			blockStyle,
			defaultBlockStyle,
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
									<BlockStylesControl
										blockStyle={blockStyle}
										onChangeBlockStyle={blockStyle =>
											setAttributes({ blockStyle })
										}
										defaultBlockStyle={defaultBlockStyle}
										onChangeDefaultBlockStyle={defaultBlockStyle =>
											setAttributes({ defaultBlockStyle })
										}
										isFirstOnHierarchy={isFirstOnHierarchy}
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
															activeItem: false,
															content: (
																<PresetOne />
															),
															onChange: () =>
																onChangePreset(
																	1
																),
														},
														{
															activeItem: false,
															content: (
																<PresetTwo />
															),
															onChange: () =>
																onChangePreset(
																	2
																),
														},
														{
															activeItem: false,
															content: (
																<PresetThree />
															),
															onChange: () =>
																onChangePreset(
																	3
																),
														},
														{
															activeItem: false,
															content: (
																<PresetFour />
															),
															onChange: () =>
																onChangePreset(
																	4
																),
														},
														{
															activeItem: false,
															content: (
																<PresetFive />
															),
															onChange: () =>
																onChangePreset(
																	5
																),
														},
														{
															activeItem: false,
															content: (
																<PresetSix />
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
																	<__experimentalFancyRadioControl
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
															),
														},
													]}
												/>
											),
										},
										{
											label: __('Icon', 'maxi-blocks'),
											content: (
												<__experimentalFontIconControl
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
																	<__experimentalFancyRadioControl
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
													<__experimentalAxisControl
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
													<__experimentalAxisControl
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
												<__experimentalMotionControl
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
												<__experimentalEntranceAnimationControl
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
												<__experimentalTransformControl
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
												<__experimentalDisplayControl
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
												<__experimentalPositionControl
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
												<__experimentalResponsiveControl
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
												<__experimentalZIndexControl
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
