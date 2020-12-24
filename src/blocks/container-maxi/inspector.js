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
	SettingTabsControl,
	SizeControl,
	ZIndexControl,
	ResponsiveControl,
	OpacityControl,
	ShapeDividerControl,
	PositionControl,
	DisplayControl,
	MotionControl,
	TransformControl,
	EntranceAnimationControl,
	ParallaxControl,
	FancyRadioControl,
	CustomLabel,
} from '../../components';
import { getDefaultProp } from '../../utils';
import FullSizeControl from '../../components/full-size-control/newFullSize';
import BorderControl from '../../components/border-control/newBorderControl';
import BoxShadowControl from '../../components/box-shadow-control/newBoxShadowControl';
import AxisControl from '../../components/axis-control/newAxisControl';
import ArrowControl from '../../components/arrow-control/newArrowControl';

import getGroupAttributes from '../../extensions/styles/getGroupAttributes';
import getDefaultAttribute from '../../extensions/styles/getDefaultAttribute';

/**
 * Inspector
 */
const Inspector = props => {
	const { attributes, deviceType, setAttributes, clientId } = props;
	const {
		customLabel,
		uniqueID,
		isFirstOnHierarchy,
		blockStyle,
		defaultBlockStyle,
		blockStyleBackground,
		fullWidth,
		extraClassName,
		breakpoints,
		zIndex,
		shapeDivider,
		position,
		display,
		motion,
		arrow,
		transform,
	} = attributes;
	const background = { ...props.attributes.background };
	const backgroundHover = { ...props.attributes.backgroundHover };

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
										{...getGroupAttributes(
											attributes,
											'border'
										)}
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
																	attributes[
																		`container-max-width-unit-${deviceType}`
																	]
																}
																defaultUnit={getDefaultAttribute(
																	`max-width-unit-${deviceType}`,
																	clientId
																)}
																onChangeUnit={val => {
																	setAttributes(
																		{
																			[`container-max-width-unit-${deviceType}`]: val,
																		}
																	);
																}}
																value={
																	attributes[
																		`container-max-width-${deviceType}`
																	]
																}
																default={getDefaultAttribute(
																	`container-max-width-${deviceType}`,
																	clientId
																)}
																onChangeValue={val => {
																	setAttributes(
																		{
																			[`container-max-width-${deviceType}`]: val,
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
																	attributes[
																		`container-width-unit-${deviceType}`
																	]
																}
																defaultUnit={getDefaultAttribute(
																	`container-width-unit-${deviceType}`,
																	clientId
																)}
																onChangeUnit={val => {
																	setAttributes(
																		{
																			[`container-width-unit-${deviceType}`]: val,
																		}
																	);
																}}
																value={
																	attributes[
																		`container-width-${deviceType}`
																	]
																}
																default={getDefaultAttribute(
																	`container-width-${deviceType}`,
																	clientId
																)}
																onChangeValue={val => {
																	setAttributes(
																		{
																			[`container-width-${deviceType}`]: val,
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
															{...getGroupAttributes(
																attributes,
																'size'
															)}
															onChange={obj =>
																setAttributes(
																	obj
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
										// deviceType === 'general' && {
										// 	label: __(
										// 		'Background',
										// 		'maxi-blocks'
										// 	),
										// 	disablePadding: true,
										// 	content: (
										// 		<SettingTabsControl
										// 			items={[
										// 				{
										// 					label: __(
										// 						'Normal',
										// 						'maxi-blocks'
										// 					),
										// 					content: (
										// 						<Fragment>
										// 							<BackgroundControl
										// 								background={
										// 									background
										// 								}
										// 								defaultBackground={getDefaultProp(
										// 									clientId,
										// 									'background'
										// 								)}
										// 								onChange={background =>
										// 									setAttributes(
										// 										{
										// 											background,
										// 										}
										// 									)
										// 								}
										// 							/>
										// 							{background.activeMedia ===
										// 								'image' && (
										// 								<ParallaxControl
										// 									motion={
										// 										motion
										// 									}
										// 									defaultMotion={getDefaultProp(
										// 										clientId,
										// 										'motion'
										// 									)}
										// 									onChange={motion =>
										// 										setAttributes(
										// 											{
										// 												motion,
										// 											}
										// 										)
										// 									}
										// 								/>
										// 							)}
										// 						</Fragment>
										// 					),
										// 				},
										// 				{
										// 					label: __(
										// 						'Hover',
										// 						'maxi-blocks'
										// 					),
										// 					content: (
										// 						<Fragment>
										// 							<FancyRadioControl
										// 								label={__(
										// 									'Enable Background Hover',
										// 									'maxi-blocks'
										// 								)}
										// 								selected={
										// 									backgroundHover.status
										// 								}
										// 								options={[
										// 									{
										// 										label: __(
										// 											'Yes',
										// 											'maxi-blocks'
										// 										),
										// 										value: 1,
										// 									},
										// 									{
										// 										label: __(
										// 											'No',
										// 											'maxi-blocks'
										// 										),
										// 										value: 0,
										// 									},
										// 								]}
										// 								onChange={val => {
										// 									backgroundHover.status = Number(
										// 										val
										// 									);
										// 									setAttributes(
										// 										{
										// 											backgroundHover,
										// 										}
										// 									);
										// 								}}
										// 							/>
										// 							{!!backgroundHover.status && (
										// 								<BackgroundControl
										// 									background={
										// 										backgroundHover
										// 									}
										// 									defaultBackground={getDefaultProp(
										// 										clientId,
										// 										'backgroundHover'
										// 									)}
										// 									onChange={backgroundHover =>
										// 										setAttributes(
										// 											{
										// 												backgroundHover,
										// 											}
										// 										)
										// 									}
										// 									disableImage
										// 									disableVideo
										// 									disableSVG
										// 								/>
										// 							)}
										// 						</Fragment>
										// 					),
										// 				},
										// 			]}
										// 		/>
										// 	),
										// },
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
																	{...getGroupAttributes(
																		attributes,
																		'border'
																	)}
																	onChange={obj =>
																		setAttributes(
																			obj
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
																		selected={
																			attributes[
																				'border-hover-status'
																			]
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
																			setAttributes(
																				{
																					'border-hover-status': !!val,
																				}
																			);
																		}}
																	/>
																	{attributes[
																		'border-hover-status'
																	] && (
																		<BorderControl
																			{...getGroupAttributes(
																				attributes,
																				'borderHover'
																			)}
																			onChange={obj =>
																				setAttributes(
																					obj
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
																	{...getGroupAttributes(
																		attributes,
																		'boxShadow'
																	)}
																	onChange={obj =>
																		setAttributes(
																			obj
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
																		selected={
																			attributes[
																				'boxShadow-hover-status'
																			]
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
																			setAttributes(
																				{
																					'boxShadow-hover-status': !!val,
																				}
																			);
																		}}
																	/>
																	{attributes[
																		'boxShadow-hover-status'
																	] && (
																		<BoxShadowControl
																			{...getGroupAttributes(
																				attributes,
																				'boxShadow-hover'
																			)}
																			onChange={obj =>
																				setAttributes(
																					obj
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
														{...getGroupAttributes(
															attributes,
															'padding'
														)}
														label={__(
															'Padding',
															'maxi-blocks'
														)}
														onChange={obj =>
															setAttributes(obj)
														}
														breakpoint={deviceType}
														target='padding'
														disableAuto
													/>
													<AxisControl
														{...getGroupAttributes(
															attributes,
															'margin'
														)}
														label={__(
															'Margin',
															'maxi-blocks'
														)}
														onChange={obj =>
															setAttributes(obj)
														}
														breakpoint={deviceType}
														target='margin'
													/>
												</Fragment>
											),
										},
										{
											label: __('Arrow', 'maxi-blocks'),
											content: (
												<ArrowControl
													{...getGroupAttributes(
														attributes,
														'arrow'
													)}
													onChange={obj =>
														setAttributes(obj)
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
					// {
					// 	label: __('Advanced', 'maxi-blocks'),
					// 	content: (
					// 		<AccordionControl
					// 			isPrimary
					// 			items={[
					// 				deviceType === 'general' && {
					// 					label: __(
					// 						'Custom Classes',
					// 						'maxi-blocks'
					// 					),
					// 					content: (
					// 						<TextControl
					// 							label={__(
					// 								'Additional CSS Classes',
					// 								'maxi-blocks'
					// 							)}
					// 							className='maxi-additional__css-classes'
					// 							value={extraClassName}
					// 							onChange={extraClassName =>
					// 								setAttributes({
					// 									extraClassName,
					// 								})
					// 							}
					// 						/>
					// 					),
					// 				},
					// 				{
					// 					label: __(
					// 						'Shape Divider',
					// 						'maxi-blocks'
					// 					),
					// 					content: (
					// 						<ShapeDividerControl
					// 							shapeDividerOptions={
					// 								shapeDivider
					// 							}
					// 							defaultShapeDividerOptions={getDefaultProp(
					// 								clientId,
					// 								'shapeDivider'
					// 							)}
					// 							onChange={shapeDivider =>
					// 								setAttributes({
					// 									shapeDivider,
					// 								})
					// 							}
					// 						/>
					// 					),
					// 				},
					// 				{
					// 					label: __(
					// 						'Motion Effects',
					// 						'maxi-blocks'
					// 					),
					// 					content: (
					// 						<MotionControl
					// 							motion={motion}
					// 							onChange={motion =>
					// 								setAttributes({ motion })
					// 							}
					// 						/>
					// 					),
					// 				},
					// 				{
					// 					label: __(
					// 						'Entrance Animation',
					// 						'maxi-blocks'
					// 					),
					// 					content: (
					// 						<EntranceAnimationControl
					// 							motion={motion}
					// 							defaultMotion={getDefaultProp(
					// 								clientId,
					// 								'motion'
					// 							)}
					// 							onChange={motion =>
					// 								setAttributes({ motion })
					// 							}
					// 						/>
					// 					),
					// 				},
					// 				{
					// 					label: __('Transform', 'maxi-blocks'),
					// 					content: (
					// 						<TransformControl
					// 							transform={transform}
					// 							onChange={transform =>
					// 								setAttributes({ transform })
					// 							}
					// 							uniqueID={uniqueID}
					// 							breakpoint={deviceType}
					// 						/>
					// 					),
					// 				},
					// 				{
					// 					label: __('Display', 'maxi-blocks'),
					// 					content: (
					// 						<DisplayControl
					// 							display={display}
					// 							onChange={display =>
					// 								setAttributes({ display })
					// 							}
					// 							breakpoint={deviceType}
					// 						/>
					// 					),
					// 				},
					// 				{
					// 					label: __('Position', 'maxi-blocks'),
					// 					content: (
					// 						<PositionControl
					// 							position={position}
					// 							defaultPosition={getDefaultProp(
					// 								clientId,
					// 								'position'
					// 							)}
					// 							onChange={position =>
					// 								setAttributes({ position })
					// 							}
					// 							breakpoint={deviceType}
					// 						/>
					// 					),
					// 				},
					// 				deviceType !== 'general' && {
					// 					label: __('Breakpoint', 'maxi-blocks'),
					// 					content: (
					// 						<ResponsiveControl
					// 							breakpoints={breakpoints}
					// 							defaultBreakpoints={getDefaultProp(
					// 								clientId,
					// 								'breakpoints'
					// 							)}
					// 							onChange={breakpoints =>
					// 								setAttributes({
					// 									breakpoints,
					// 								})
					// 							}
					// 							breakpoint={deviceType}
					// 						/>
					// 					),
					// 				},
					// 				{
					// 					label: __('Z-index', 'maxi-blocks'),
					// 					content: (
					// 						<ZIndexControl
					// 							zIndex={zIndex}
					// 							defaultZIndex={getDefaultProp(
					// 								clientId,
					// 								'zIndex'
					// 							)}
					// 							onChange={zIndex =>
					// 								setAttributes({ zIndex })
					// 							}
					// 							breakpoint={deviceType}
					// 						/>
					// 					),
					// 				},
					// 				{
					// 					label: __('Opacity', 'maxi-blocks'),
					// 					content: (
					// 						<OpacityControl
					// 							opacity={opacity}
					// 							defaultOpacity={getDefaultProp(
					// 								clientId,
					// 								'opacity'
					// 							)}
					// 							onChange={opacity =>
					// 								setAttributes({
					// 									opacity,
					// 								})
					// 							}
					// 							breakpoint={deviceType}
					// 						/>
					// 					),
					// 				},
					// 			]}
					// 		/>
					// 	),
					// },
				]}
			/>
		</InspectorControls>
	);
};

export default Inspector;
