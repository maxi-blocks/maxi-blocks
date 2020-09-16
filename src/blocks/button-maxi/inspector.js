/**
 * WordPress dependencies
 */
const { __ } = wp.i18n;
const { InspectorControls } = wp.blockEditor;
const { TextControl } = wp.components;
const { Fragment } = wp.element;
const { useSelect } = wp.data;

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
	FullSizeControl,
	SettingTabsControl,
	TypographyControl,
	__experimentalResponsiveSelector,
	__experimentalZIndexControl,
	__experimentalAxisControl,
	__experimentalResponsiveControl,
	__experimentalOpacityControl,
	__experimentalPositionControl,
	__experimentalDisplayControl,
	__experimentalMotionControl,
	__experimentalTransformControl,
	__experimentalEntranceAnimationControl,
} from '../../components';
import { getDefaultProp } from '../../utils';

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
			opacity,
			opacityHover,
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
		},
		setAttributes,
		clientId,
	} = props;

	const { deviceType } = useSelect(select => {
		const { __experimentalGetPreviewDeviceType } = select('core/edit-post');
		let deviceType = __experimentalGetPreviewDeviceType();
		deviceType = deviceType === 'Desktop' ? 'general' : deviceType;
		return {
			deviceType,
		};
	});

	return (
		<InspectorControls>
			<__experimentalResponsiveSelector />
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
																	onChange={typography =>
																		setAttributes(
																			{
																				typography,
																			}
																		)
																	}
																	hideAlignment
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
																<TypographyControl
																	typography={
																		typographyHover
																	}
																	defaultTypography={getDefaultProp(
																		clientId,
																		'typographyHover'
																	)}
																	onChange={typographyHover =>
																		setAttributes(
																			{
																				typographyHover,
																			}
																		)
																	}
																	hideAlignment
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
																	<__experimentalOpacityControl
																		opacity={
																			opacity
																		}
																		defaultOpacity={getDefaultProp(
																			clientId,
																			'opacity'
																		)}
																		onChange={opacity =>
																			setAttributes(
																				{
																					opacity,
																				}
																			)
																		}
																		breakpoint={
																			deviceType
																		}
																	/>
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
																	<__experimentalOpacityControl
																		opacity={
																			opacityHover
																		}
																		defaultOpacity={getDefaultProp(
																			clientId,
																			'opacityHover'
																		)}
																		onChange={opacityHover =>
																			setAttributes(
																				{
																					opacityHover,
																				}
																			)
																		}
																		breakpoint={
																			deviceType
																		}
																	/>
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
																	/>
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
