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
	ZIndexControl,
	AxisControl,
	ResponsiveControl,
	OpacityControl,
	ShapeDividerControl,
	PositionControl,
	DisplayControl,
	MotionControl,
	TransformControl,
	EntranceAnimationControl,
	ArrowControl,
	ParallaxControl,
	OverlayControl,
	FancyRadioControl,
	CustomLabel,
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
			customLabel,
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
	const backgroundValue = !isObject(background)
		? JSON.parse(background)
		: background;

	const backgroundHoverValue = !isObject(backgroundHover)
		? JSON.parse(backgroundHover)
		: backgroundHover;

	const overlayHoverValue = !isObject(overlayHover)
		? JSON.parse(overlayHover)
		: overlayHover;

	const boxShadowHoverValue = !isObject(boxShadowHover)
		? JSON.parse(boxShadowHover)
		: boxShadowHover;

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
										{
											label: __(
												'Width / Height',
												'maxi-blocks'
											),
											content: (
												<Fragment>
													{isFirstOnHierarchy && (
														<FancyRadioControl
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
													{fullWidth === 'full' ? (
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
																	)[
																		deviceType
																	][
																		'max-widthUnit'
																	]
																}
																onChangeUnit={val => {
																	value[
																		deviceType
																	][
																		'max-widthUnit'
																	] = val;
																	setAttributes(
																		{
																			sizeContainer: JSON.stringify(
																				value
																			),
																		}
																	);
																}}
																value={
																	value[
																		deviceType
																	][
																		'max-width'
																	]
																}
																defaultValue={
																	JSON.parse(
																		getDefaultProp(
																			clientId,
																			'sizeContainer'
																		)
																	)[
																		deviceType
																	][
																		'max-width'
																	]
																}
																onChangeValue={val => {
																	value[
																		deviceType
																	][
																		'max-width'
																	] = val;
																	setAttributes(
																		{
																			sizeContainer: JSON.stringify(
																				value
																			),
																		}
																	);
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
																	)[
																		deviceType
																	].widthUnit
																}
																onChangeUnit={val => {
																	value[
																		deviceType
																	].widthUnit = val;
																	setAttributes(
																		{
																			sizeContainer: JSON.stringify(
																				value
																			),
																		}
																	);
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
																	)[
																		deviceType
																	].width
																}
																onChangeValue={val => {
																	value[
																		deviceType
																	].width = val;
																	setAttributes(
																		{
																			sizeContainer: JSON.stringify(
																				value
																			),
																		}
																	);
																}}
																minMaxSettings={
																	minMaxSettings
																}
															/>
														</Fragment>
													) : (
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
															breakpoint={
																deviceType
															}
														/>
													)}
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
																	{backgroundValue.activeMedia ===
																		'image' && (
																		<ParallaxControl
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
																	)}
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
																			disableSVG
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
																	<OverlayControl
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
																	<FancyRadioControl
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
																		<OverlayControl
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
												'Padding & Margin',
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
										{
											label: __('Arrow', 'maxi-blocks'),
											content: (
												<ArrowControl
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
											<ShapeDividerControl
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
											<MotionControl
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
											<EntranceAnimationControl
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
											<TransformControl
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
											<DisplayControl
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
											<PositionControl
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
													setAttributes({ zIndex })
												}
												breakpoint={deviceType}
											/>
										),
									},
									{
										label: __('Opacity', 'maxi-blocks'),
										content: (
											<OpacityControl
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
