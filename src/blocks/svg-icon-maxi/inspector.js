/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { InspectorControls } from '@wordpress/block-editor';

/**
 * Internal dependencies
 */
import {
	AccordionControl,
	AlignmentControl,
	AxisControl,
	BackgroundControl,
	BlockStylesControl,
	BorderControl,
	BoxShadowControl,
	CustomLabel,
	DisplayControl,
	FullSizeControl,
	InfoBox,
	MotionControl,
	OpacityControl,
	PositionControl,
	ResponsiveControl,
	SettingTabsControl,
	SvgColor,
	SvgStrokeWidthControl,
	SvgWidthControl,
	TextControl,
	ToggleSwitch,
	TransformControl,
	ZIndexControl,
	OverflowControl,
} from '../../components';
import {
	getColorRGBAString,
	getGroupAttributes,
	setHoverAttributes,
} from '../../extensions/styles';

/**
 * Inspector
 */
const Inspector = props => {
	const {
		attributes,
		changeSVGContent,
		changeSVGContentWithBlockStyle,
		changeSVGStrokeWidth,
		clientId,
		deviceType,
		setAttributes,
	} = props;
	const {
		blockFullWidth,
		blockStyle,
		customLabel,
		extraClassName,
		isFirstOnHierarchy,
		parentBlockStyle,
		svgType,
		uniqueID,
	} = attributes;

	return (
		<InspectorControls>
			{deviceType !== 'general' && (
				<InfoBox
					message={__(
						'You are currently in responsive editing mode. Select Base to continue editing general settings.',
						'maxi-blocks'
					)}
				/>
			)}
			<SettingTabsControl
				disablePadding
				deviceType={deviceType}
				items={[
					{
						label: __('Settings', 'maxi-blocks'),
						content: (
							<>
								{deviceType === 'general' && (
									<div className='maxi-tab-content__box'>
										<CustomLabel
											customLabel={customLabel}
											onChange={customLabel =>
												setAttributes({ customLabel })
											}
										/>
										<BlockStylesControl
											blockStyle={blockStyle}
											isFirstOnHierarchy={
												isFirstOnHierarchy
											}
											onChange={obj => {
												setAttributes(obj);

												const { parentBlockStyle } =
													obj;

												const {
													'svg-palette-fill-color':
														svgPaletteFillColor,
													'svg-palette-fill-opacity':
														svgPaletteFillOpacity,
													'svg-fill-color':
														svgFillColor,
													'svg-palette-line-color':
														svgPaletteLineColor,
													'svg-palette-line-opacity':
														svgPaletteLineOpacity,
													'svg-line-color':
														svgLineColor,
												} = attributes;

												const fillColorStr =
													getColorRGBAString({
														firstVar: 'icon-fill',
														secondVar: `color-${svgPaletteFillColor}`,
														opacity:
															svgPaletteFillOpacity,
														blockStyle:
															parentBlockStyle,
													});
												const lineColorStr =
													getColorRGBAString({
														firstVar: 'icon-line',
														secondVar: `color-${svgPaletteLineColor}`,
														opacity:
															svgPaletteLineOpacity,
														blockStyle:
															parentBlockStyle,
													});

												changeSVGContentWithBlockStyle(
													attributes[
														'svg-palette-fill-color-status'
													]
														? fillColorStr
														: svgFillColor,
													attributes[
														'svg-palette-line-color-status'
													]
														? lineColorStr
														: svgLineColor
												);
											}}
											clientId={clientId}
										/>
									</div>
								)}
								<AccordionControl
									isSecondary
									items={[
										{
											label: __(
												'Alignment',
												'maxi-blocks'
											),
											content: (
												<AlignmentControl
													{...getGroupAttributes(
														attributes,
														'alignment'
													)}
													onChange={obj =>
														setAttributes(obj)
													}
													breakpoint={deviceType}
													disableJustify
												/>
											),
										},
										attributes.content && {
											label: __('Colour', 'maxi-blocks'),
											content: (
												<>
													{svgType !== 'Line' && (
														<>
															<SvgColor
																{...getGroupAttributes(
																	attributes,
																	'svg'
																)}
																type='fill'
																label={__(
																	'SVG Fill',
																	'maxi-blocks'
																)}
																onChange={obj => {
																	setAttributes(
																		obj
																	);

																	const fillColorStr =
																		getColorRGBAString(
																			{
																				firstVar:
																					'icon-fill',
																				secondVar: `color-${obj['svg-palette-fill-color']}`,
																				opacity:
																					obj[
																						'svg-palette-fill-opacity'
																					],
																				blockStyle:
																					parentBlockStyle,
																			}
																		);

																	changeSVGContent(
																		obj[
																			'svg-palette-fill-color-status'
																		]
																			? fillColorStr
																			: obj[
																					'svg-fill-color'
																			  ],
																		'fill'
																	);
																}}
															/>
															{svgType ===
																'Filled' && (
																<hr />
															)}
														</>
													)}
													{svgType !== 'Shape' && (
														<SvgColor
															{...getGroupAttributes(
																attributes,
																'svg'
															)}
															type='line'
															label={__(
																'SVG Line',
																'maxi-blocks'
															)}
															onChange={obj => {
																setAttributes(
																	obj
																);

																const lineColorStr =
																	getColorRGBAString(
																		{
																			firstVar:
																				'icon-line',
																			secondVar: `color-${obj['svg-palette-line-color']}`,
																			opacity:
																				obj[
																					'svg-palette-line-opacity'
																				],
																			blockStyle:
																				parentBlockStyle,
																		}
																	);

																changeSVGContent(
																	obj[
																		'svg-palette-line-color-status'
																	]
																		? lineColorStr
																		: obj[
																				'svg-line-color'
																		  ],
																	'stroke'
																);
															}}
														/>
													)}
												</>
											),
										},
										attributes.content &&
											svgType !== 'Shape' && {
												label: __(
													'Icon line width',
													'maxi-blocks'
												),
												content: (
													<SvgStrokeWidthControl
														{...getGroupAttributes(
															attributes,
															'svg'
														)}
														prefix='svg-'
														onChange={obj => {
															setAttributes(obj);
															changeSVGStrokeWidth(
																obj[
																	`svg-stroke-${deviceType}`
																]
															);
														}}
														breakpoint={deviceType}
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
																	{...getGroupAttributes(
																		attributes,
																		[
																			'border',
																			'borderWidth',
																			'borderRadius',
																		],
																		false,
																		'svg-'
																	)}
																	prefix='svg-'
																	onChange={obj => {
																		setAttributes(
																			obj
																		);
																	}}
																	breakpoint={
																		deviceType
																	}
																	clientId={
																		clientId
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
																<>
																	<ToggleSwitch
																		label={__(
																			'Enable Border Hover',
																			'maxi-blocks'
																		)}
																		selected={
																			attributes[
																				'svg-border-status-hover'
																			]
																		}
																		className='maxi-border-status-hover'
																		onChange={val =>
																			setAttributes(
																				{
																					...(val &&
																						setHoverAttributes(
																							{
																								...getGroupAttributes(
																									attributes,
																									[
																										'border',
																										'borderWidth',
																										'borderRadius',
																									],
																									false,
																									'svg-'
																								),
																							},
																							{
																								...getGroupAttributes(
																									attributes,
																									[
																										'border',
																										'borderWidth',
																										'borderRadius',
																									],
																									true,
																									'svg-'
																								),
																							}
																						)),
																					'svg-border-status-hover':
																						val,
																				}
																			)
																		}
																	/>
																	{attributes[
																		'svg-border-status-hover'
																	] && (
																		<BorderControl
																			{...getGroupAttributes(
																				attributes,
																				[
																					'border',
																					'borderWidth',
																					'borderRadius',
																				],
																				true,
																				'svg-'
																			)}
																			prefix='svg-'
																			onChange={obj =>
																				setAttributes(
																					obj
																				)
																			}
																			breakpoint={
																				deviceType
																			}
																			isHover
																			clientId={
																				clientId
																			}
																		/>
																	)}
																</>
															),
														},
													]}
												/>
											),
										},
										{
											label: __(
												'Box shadow',
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
																		'boxShadow',
																		false,
																		'svg-'
																	)}
																	prefix='svg-'
																	onChange={obj =>
																		setAttributes(
																			obj
																		)
																	}
																	breakpoint={
																		deviceType
																	}
																	clientId={
																		clientId
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
																<>
																	<ToggleSwitch
																		label={__(
																			'Enable Box Shadow Hover',
																			'maxi-blocks'
																		)}
																		selected={
																			attributes[
																				'svg-box-shadow-status-hover'
																			]
																		}
																		className='maxi-box-shadow-status-hover'
																		onChange={val =>
																			setAttributes(
																				{
																					...(val &&
																						setHoverAttributes(
																							{
																								...getGroupAttributes(
																									attributes,
																									'boxShadow',
																									false,
																									'svg-'
																								),
																							},
																							{
																								...getGroupAttributes(
																									attributes,
																									'boxShadow',
																									true,
																									'svg-'
																								),
																							}
																						)),
																					'svg-box-shadow-status-hover':
																						val,
																				}
																			)
																		}
																	/>
																	{attributes[
																		'svg-box-shadow-status-hover'
																	] && (
																		<BoxShadowControl
																			{...getGroupAttributes(
																				attributes,
																				'boxShadow',
																				true,
																				'svg-'
																			)}
																			prefix='svg-'
																			onChange={obj =>
																				setAttributes(
																					obj
																				)
																			}
																			breakpoint={
																				deviceType
																			}
																			isHover
																			clientId={
																				clientId
																			}
																		/>
																	)}
																</>
															),
														},
													]}
												/>
											),
										},
										attributes.content && {
											label: __(
												'Height / Width',
												'maxi-blocks'
											),
											content: (
												<SvgWidthControl
													{...getGroupAttributes(
														attributes,
														'svg'
													)}
													onChange={obj => {
														setAttributes(obj);
													}}
													breakpoint={deviceType}
													prefix='svg-'
												/>
											),
										},
										{
											label: __(
												'Margin / Padding',
												'maxi-blocks'
											),
											content: (
												<>
													<AxisControl
														{...getGroupAttributes(
															attributes,
															'padding',
															false,
															'svg-'
														)}
														prefix='svg-'
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
															'margin',
															false,
															'svg-'
														)}
														prefix='svg-'
														label={__(
															'Margin',
															'maxi-blocks'
														)}
														onChange={obj =>
															setAttributes(obj)
														}
														breakpoint={deviceType}
														target='margin'
														optionType='string'
													/>
												</>
											),
										},
									]}
								/>
							</>
						),
					},
					{
						label: __('Canvas', 'maxi-blocks'),
						content: (
							<AccordionControl
								isPrimary
								items={[
									{
										label: __(
											'Background / Layer',
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
															<>
																<BackgroundControl
																	{...getGroupAttributes(
																		attributes,
																		[
																			'background',
																			'backgroundColor',
																		]
																	)}
																	onChange={obj =>
																		setAttributes(
																			obj
																		)
																	}
																	disableImage
																	disableVideo
																	disableGradient
																	disableSVG
																	disableClipPath
																	clientId={
																		clientId
																	}
																/>
															</>
														),
													},
													{
														label: __(
															'Hover',
															'maxi-blocks'
														),
														content: (
															<>
																<ToggleSwitch
																	label={__(
																		'Enable Background Hover',
																		'maxi-blocks'
																	)}
																	selected={
																		attributes[
																			'background-status-hover'
																		]
																	}
																	className='maxi-background-status-hover'
																	onChange={val =>
																		setAttributes(
																			{
																				...(val &&
																					setHoverAttributes(
																						{
																							...getGroupAttributes(
																								attributes,
																								[
																									'background',
																									'backgroundColor',
																									'backgroundGradient',
																								]
																							),
																						},
																						{
																							...getGroupAttributes(
																								attributes,
																								[
																									'background',
																									'backgroundColor',
																									'backgroundGradient',
																								],
																								true
																							),
																						}
																					)),
																				'background-status-hover':
																					val,
																			}
																		)
																	}
																/>
																{attributes[
																	'background-status-hover'
																] && (
																	<BackgroundControl
																		{...getGroupAttributes(
																			attributes,
																			[
																				'background',
																				'backgroundColor',
																			],
																			true
																		)}
																		onChange={obj =>
																			setAttributes(
																				obj
																			)
																		}
																		disableColor={
																			!!attributes[
																				'background-Highlight'
																			]
																		}
																		disableImage
																		disableVideo
																		disableGradient
																		disableSVG
																		disableClipPath
																		isHover
																		clientId={
																			clientId
																		}
																	/>
																)}
															</>
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
																{...getGroupAttributes(
																	attributes,
																	[
																		'border',
																		'borderWidth',
																		'borderRadius',
																	]
																)}
																onChange={obj => {
																	setAttributes(
																		obj
																	);
																}}
																breakpoint={
																	deviceType
																}
																clientId={
																	clientId
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
															<>
																<ToggleSwitch
																	label={__(
																		'Enable Border Hover',
																		'maxi-blocks'
																	)}
																	selected={
																		attributes[
																			'border-status-hover'
																		]
																	}
																	className='maxi-border-status-hover'
																	onChange={val =>
																		setAttributes(
																			{
																				...(val &&
																					setHoverAttributes(
																						{
																							...getGroupAttributes(
																								attributes,
																								[
																									'border',
																									'borderWidth',
																									'borderRadius',
																								]
																							),
																						},
																						{
																							...getGroupAttributes(
																								attributes,
																								[
																									'border',
																									'borderWidth',
																									'borderRadius',
																								],
																								true
																							),
																						}
																					)),
																				'border-status-hover':
																					val,
																			}
																		)
																	}
																/>
																{attributes[
																	'border-status-hover'
																] && (
																	<BorderControl
																		{...getGroupAttributes(
																			attributes,
																			[
																				'border',
																				'borderWidth',
																				'borderRadius',
																			],
																			true
																		)}
																		onChange={obj =>
																			setAttributes(
																				obj
																			)
																		}
																		breakpoint={
																			deviceType
																		}
																		isHover
																		clientId={
																			clientId
																		}
																	/>
																)}
															</>
														),
													},
												]}
											/>
										),
									},
									{
										label: __('Box shadow', 'maxi-blocks'),
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
																clientId={
																	clientId
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
															<>
																<ToggleSwitch
																	label={__(
																		'Enable Box Shadow Hover',
																		'maxi-blocks'
																	)}
																	selected={
																		attributes[
																			'box-shadow-status-hover'
																		]
																	}
																	className='maxi-box-shadow-status-hover'
																	onChange={val =>
																		setAttributes(
																			{
																				...(val &&
																					setHoverAttributes(
																						{
																							...getGroupAttributes(
																								attributes,
																								'boxShadow'
																							),
																						},
																						{
																							...getGroupAttributes(
																								attributes,
																								'boxShadow',
																								true
																							),
																						}
																					)),
																				'box-shadow-status-hover':
																					val,
																			}
																		)
																	}
																/>
																{attributes[
																	'box-shadow-status-hover'
																] && (
																	<BoxShadowControl
																		{...getGroupAttributes(
																			attributes,
																			'boxShadowHover'
																		)}
																		onChange={obj =>
																			setAttributes(
																				obj
																			)
																		}
																		breakpoint={
																			deviceType
																		}
																		isHover
																		clientId={
																			clientId
																		}
																	/>
																)}
															</>
														),
													},
												]}
											/>
										),
									},
									{
										label: __('Opacity', 'maxi-blocks'),
										content: (
											<OpacityControl
												{...getGroupAttributes(
													attributes,
													'opacity'
												)}
												onChange={obj =>
													setAttributes(obj)
												}
												breakpoint={deviceType}
											/>
										),
									},
									isFirstOnHierarchy && {
										label: __(
											'Height / Width',
											'maxi-blocks'
										),
										content: (
											<>
												{isFirstOnHierarchy && (
													<ToggleSwitch
														label={__(
															'Set svg icon to full-width',
															'maxi-blocks'
														)}
														selected={
															blockFullWidth ===
															'full'
														}
														onChange={val =>
															setAttributes({
																blockFullWidth:
																	val
																		? 'full'
																		: 'normal',
															})
														}
													/>
												)}
												<FullSizeControl
													{...getGroupAttributes(
														attributes,
														'size'
													)}
													onChange={obj =>
														setAttributes(obj)
													}
													breakpoint={deviceType}
												/>
											</>
										),
									},
									{
										label: __(
											'Margin / Padding',
											'maxi-blocks'
										),
										content: (
											<>
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
													optionType='string'
												/>
											</>
										),
									},
								]}
							/>
						),
					},
					{
						label: __('Advanced', 'maxi-blocks'),
						content: (
							<>
								<AccordionControl
									isPrimary
									items={[
										deviceType === 'general' && {
											label: __(
												'Add CSS class/id',
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
												'Motion effect',
												'maxi-blocks'
											),
											content: (
												<MotionControl
													{...getGroupAttributes(
														attributes,
														'motion'
													)}
													onChange={obj =>
														setAttributes(obj)
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
													{...getGroupAttributes(
														attributes,
														'transform'
													)}
													onChange={obj =>
														setAttributes(obj)
													}
													uniqueID={uniqueID}
													breakpoint={deviceType}
												/>
											),
										},
										{
											label: __(
												'Show/hide block',
												'maxi-blocks'
											),
											content: (
												<DisplayControl
													{...getGroupAttributes(
														attributes,
														'display'
													)}
													onChange={obj =>
														setAttributes(obj)
													}
													breakpoint={deviceType}
													defaultDisplay='flex'
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
													{...getGroupAttributes(
														attributes,
														'position'
													)}
													onChange={obj =>
														setAttributes(obj)
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
													{...getGroupAttributes(
														attributes,
														'breakpoints'
													)}
													onChange={obj =>
														setAttributes(obj)
													}
													breakpoint={deviceType}
												/>
											),
										},
										{
											label: __(
												'Overflow',
												'maxi-blocks'
											),
											content: (
												<OverflowControl
													{...getGroupAttributes(
														attributes,
														'overflow'
													)}
													onChange={obj =>
														setAttributes(obj)
													}
													breakpoint={deviceType}
												/>
											),
										},
										{
											label: __('Z-index', 'maxi-blocks'),
											content: (
												<ZIndexControl
													{...getGroupAttributes(
														attributes,
														'zIndex'
													)}
													onChange={obj =>
														setAttributes(obj)
													}
													breakpoint={deviceType}
												/>
											),
										},
									]}
								/>
							</>
						),
					},
				]}
			/>
		</InspectorControls>
	);
};

export default Inspector;
