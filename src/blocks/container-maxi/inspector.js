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
	FancyRadioControl,
	CustomLabel,
} from '../../components';
import { getDefaultProp } from '../../utils';

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
			blockStyleBackground,
			fullWidth,
			size,
			opacity,
			border,
			boxShadow,
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
	const sizeContainer = { ...props.attributes.sizeContainer };
	const background = { ...props.attributes.background };
	const backgroundHover = { ...props.attributes.backgroundHover };
	const boxShadowHover = { ...props.attributes.boxShadowHover };
	const borderHover = { ...props.attributes.borderHover };

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
										onChange={obj => setAttributes(obj)}
										disableHighlightText
										disableHighlightBackground
										disableHighlightBorder
										disableHighlightColor1
										disableHighlightColor2
										border={border}
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
																	'Width',
																	'maxi-blocks'
																)}
																unit={
																	sizeContainer[
																		deviceType
																	].widthUnit
																}
																defaultUnit={
																	getDefaultProp(
																		clientId,
																		'sizeContainer'
																	)[
																		deviceType
																	].widthUnit
																}
																onChangeUnit={val => {
																	sizeContainer[
																		deviceType
																	].widthUnit = val;
																	setAttributes(
																		{
																			sizeContainer,
																		}
																	);
																}}
																value={
																	sizeContainer[
																		deviceType
																	].width
																}
																default={
																	getDefaultProp(
																		clientId,
																		'sizeContainer'
																	)[
																		deviceType
																	].width
																}
																onChangeValue={val => {
																	sizeContainer[
																		deviceType
																	].width = val;
																	setAttributes(
																		{
																			sizeContainer,
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
																	{background.activeMedia ===
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
																			backgroundHover.status
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
																			backgroundHover.status = Number(
																				val
																			);
																			setAttributes(
																				{
																					backgroundHover,
																				}
																			);
																		}}
																	/>
																	{!!backgroundHover.status && (
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
																			borderHover.status
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
																			borderHover.status = Number(
																				val
																			);
																			setAttributes(
																				{
																					borderHover,
																				}
																			);
																		}}
																	/>
																	{!!borderHover.status && (
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
																			boxShadowHover.status
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
																			boxShadowHover.status = Number(
																				val
																			);
																			setAttributes(
																				{
																					boxShadowHover,
																				}
																			);
																		}}
																	/>
																	{!!boxShadowHover.status && (
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
														defaults={getDefaultProp(
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
														defaults={getDefaultProp(
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
