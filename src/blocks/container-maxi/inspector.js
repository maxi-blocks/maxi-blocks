/**
 * WordPress dependencies
 */
const { __ } = wp.i18n;
const { InspectorControls } = wp.blockEditor;
const { Fragment } = wp.element;
const { TextControl } = wp.components;

/**
 * Internal dependencies
 */
import {
	AccordionControl,
	BackgroundControl,
	BlockStylesControl,
	BorderControl,
	BoxShadowControl,
	FullSizeControl,
	SettingTabsControl,
	SizeControl,
	__experimentalZIndexControl,
	__experimentalAxisControl,
	__experimentalResponsiveControl,
	__experimentalOpacityControl,
	__experimentalShapeDividerControl,
	__experimentalPositionControl,
	__experimentalDisplayControl,
	__experimentalMotionControl,
	__experimentalTransformControl,
	__experimentalEntranceAnimationControl,
	__experimentalArrowControl,
	__experimentalParallaxControl,
	__experimentalOverlayControl,
	__experimentalFancyRadioControl,
} from '../../components';
import { getDefaultProp } from '../../utils';

/**
 * External dependencies
 */
import { isObject } from 'lodash';

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
			sizeContainer,
			fullWidth,
			size,
			opacity,
			background,
			backgroundHover,
			overlay,
			overlayHover,
			border,
			borderHover,
			boxShadow,
			boxShadowHover,
			padding,
			margin,
			extraClassName,
			breakpoints,
			zIndex,
			shapeDivider,
			position,
			display,
			motion,
			arrow,
			transform,
		},
		deviceType,
		setAttributes,
		clientId,
	} = props;

	const value = !isObject(sizeContainer)
		? JSON.parse(sizeContainer)
		: sizeContainer;

	const minMaxSettings = {
		px: {
			min: 0,
			max: 3999,
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

	const backgroundHoverValue = !isObject(backgroundHover)
		? JSON.parse(backgroundHover)
		: backgroundHover;

	const overlayHoverValue = !isObject(overlayHover)
		? JSON.parse(overlayHover)
		: overlayHover;

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
									isPrimary
									items={[
										isFirstOnHierarchy &&
											fullWidth === 'full' && {
												label: __(
													'Container',
													'maxi-blocks'
												),
												content: (
													<Fragment>
														<SizeControl
															label={__(
																'Max Width',
																'maxi-blocks'
															)}
															unit={
																value[
																	deviceType
																][
																	'max-widthUnit'
																]
															}
															defaultUnit={
																JSON.parse(
																	getDefaultProp(
																		clientId,
																		'sizeContainer'
																	)
																)[deviceType][
																	'max-widthUnit'
																]
															}
															onChangeUnit={val => {
																value[
																	deviceType
																][
																	'max-widthUnit'
																] = val;
																setAttributes({
																	sizeContainer: JSON.stringify(
																		value
																	),
																});
															}}
															value={
																value[
																	deviceType
																]['max-width']
															}
															defaultValue={
																JSON.parse(
																	getDefaultProp(
																		clientId,
																		'sizeContainer'
																	)
																)[deviceType][
																	'max-width'
																]
															}
															onChangeValue={val => {
																value[
																	deviceType
																][
																	'max-width'
																] = val;
																setAttributes({
																	sizeContainer: JSON.stringify(
																		value
																	),
																});
															}}
															minMaxSettings={
																minMaxSettings
															}
														/>
														<SizeControl
															label={__(
																'Width',
																'maxi-blocks'
															)}
															unit={
																value[
																	deviceType
																].widthUnit
															}
															defaultUnit={
																JSON.parse(
																	getDefaultProp(
																		clientId,
																		'sizeContainer'
																	)
																)[deviceType]
																	.widthUnit
															}
															onChangeUnit={val => {
																value[
																	deviceType
																].widthUnit = val;
																setAttributes({
																	sizeContainer: JSON.stringify(
																		value
																	),
																});
															}}
															value={
																value[
																	deviceType
																].width
															}
															defaultValue={
																JSON.parse(
																	getDefaultProp(
																		clientId,
																		'sizeContainer'
																	)
																)[deviceType]
																	.width
															}
															onChangeValue={val => {
																value[
																	deviceType
																].width = val;
																setAttributes({
																	sizeContainer: JSON.stringify(
																		value
																	),
																});
															}}
															minMaxSettings={
																minMaxSettings
															}
														/>
													</Fragment>
												),
											},
										{
											label: __(
												'Width / Height',
												'maxi-blocks'
											),
											content: (
												<Fragment>
													{isFirstOnHierarchy && (
														<__experimentalFancyRadioControl
															label={__(
																'Full Width',
																'maxi-blocks'
															)}
															selected={fullWidth}
															options={[
																{
																	label: __(
																		'No',
																		'maxi-blocks'
																	),
																	value:
																		'normal',
																},
																{
																	label: __(
																		'Yes',
																		'maxi-blocks'
																	),
																	value:
																		'full',
																},
															]}
															onChange={fullWidth =>
																setAttributes({
																	fullWidth,
																})
															}
														/>
													)}
													<FullSizeControl
														size={size}
														defaultSize={getDefaultProp(
															clientId,
															'size'
														)}
														onChange={size =>
															setAttributes({
																size,
															})
														}
														breakpoint={deviceType}
													/>
												</Fragment>
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
																	/>
																	<__experimentalParallaxControl
																		motion={
																			motion
																		}
																		defaultMotion={getDefaultProp(
																			clientId,
																			'motion'
																		)}
																		onChange={motion =>
																			setAttributes(
																				{
																					motion,
																				}
																			)
																		}
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
											label: __('Overlay', 'maxi-blocks'),
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
																	<__experimentalOverlayControl
																		overlay={
																			overlay
																		}
																		defaultOverlay={getDefaultProp(
																			clientId,
																			'overlay'
																		)}
																		onChange={overlay =>
																			setAttributes(
																				{
																					overlay,
																				}
																			)
																		}
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
																			overlayHoverValue.status
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
																			overlayHoverValue.status = Number(
																				val
																			);
																			setAttributes(
																				{
																					overlayHover: JSON.stringify(
																						overlayHoverValue
																					),
																				}
																			);
																		}}
																	/>
																	{!!overlayHoverValue.status && (
																		<__experimentalOverlayControl
																			overlay={
																				overlayHover
																			}
																			defaultOverlay={getDefaultProp(
																				clientId,
																				'overlayHover'
																			)}
																			onChange={overlayHover =>
																				setAttributes(
																					{
																						overlayHover,
																					}
																				)
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
												'Padding & Margin',
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
										{
											label: __('Arrow', 'maxi-blocks'),
											content: (
												<__experimentalArrowControl
													arrow={arrow}
													defaultArrow={getDefaultProp(
														clientId,
														'arrow'
													)}
													onChange={arrow =>
														setAttributes({ arrow })
													}
													isFullWidth={fullWidth}
													breakpoint={deviceType}
													isFirstOnHierarchy={
														isFirstOnHierarchy
													}
												/>
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
											'Shape Divider',
											'maxi-blocks'
										),
										content: (
											<__experimentalShapeDividerControl
												shapeDividerOptions={
													shapeDivider
												}
												defaultShapeDividerOptions={getDefaultProp(
													clientId,
													'shapeDivider'
												)}
												onChange={shapeDivider =>
													setAttributes({
														shapeDivider,
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
													setAttributes({ motion })
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
													setAttributes({ motion })
												}
											/>
										),
									},
									{
										label: __('Transform', 'maxi-blocks'),
										content: (
											<__experimentalTransformControl
												transform={transform}
												onChange={transform =>
													setAttributes({ transform })
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
													setAttributes({ display })
												}
												breakpoint={deviceType}
											/>
										),
									},
									{
										label: __('Position', 'maxi-blocks'),
										content: (
											<__experimentalPositionControl
												position={position}
												defaultPosition={getDefaultProp(
													clientId,
													'position'
												)}
												onChange={position =>
													setAttributes({ position })
												}
												breakpoint={deviceType}
											/>
										),
									},
									deviceType !== 'general' && {
										label: __('Breakpoint', 'maxi-blocks'),
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
													setAttributes({ zIndex })
												}
												breakpoint={deviceType}
											/>
										),
									},
									{
										label: __('Opacity', 'maxi-blocks'),
										content: (
											<__experimentalOpacityControl
												opacity={opacity}
												defaultOpacity={getDefaultProp(
													clientId,
													'opacity'
												)}
												onChange={opacity =>
													setAttributes({
														opacity,
													})
												}
												breakpoint={deviceType}
											/>
										),
									},
								]}
							/>
						),
					},
				]}
			/>
		</InspectorControls>
	);
};

export default Inspector;
