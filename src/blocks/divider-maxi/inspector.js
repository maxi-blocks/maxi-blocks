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
	AxisControl,
	BlockStylesControl,
	BorderControl,
	BoxShadowControl,
	CustomLabel,
	DisplayControl,
	DividerControl,
	FancyRadioControl,
	FullSizeControl,
	InfoBox,
	MotionControl,
	OpacityControl,
	OverflowControl,
	PositionControl,
	ResponsiveControl,
	SettingTabsControl,
	TextControl,
	ToggleSwitch,
	TransformControl,
	ZIndexControl,
} from '../../components';
import {
	getGroupAttributes,
	setHoverAttributes,
} from '../../extensions/styles';
import * as inspectorTabs from '../../components/inspector-tabs';

/**
 * Inspector
 */
const Inspector = props => {
	const { attributes, deviceType, setAttributes, clientId } = props;
	const {
		blockFullWidth,
		blockStyle,
		customLabel,
		extraClassName,
		fullWidth,
		isFirstOnHierarchy,
		lineHorizontal,
		lineOrientation,
		lineVertical,
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
											onChange={obj => setAttributes(obj)}
											clientId={clientId}
										/>
									</div>
								)}
								<AccordionControl
									isSecondary
									items={[
										deviceType === 'general' && {
											label: __('Line', 'maxi-blocks'),
											content: (
												<>
													<FancyRadioControl
														fullWidthMode
														label={__(
															'Line Orientation',
															'maxi-blocks'
														)}
														selected={
															lineOrientation
														}
														options={[
															{
																label: __(
																	'Horizontal',
																	'maxi-blocks'
																),
																value: 'horizontal',
															},
															{
																label: __(
																	'Vertical',
																	'maxi-blocks'
																),
																value: 'vertical',
															},
														]}
														optionType='string'
														onChange={lineOrientation =>
															setAttributes({
																lineOrientation,
															})
														}
													/>
													<FancyRadioControl
														fullWidthMode
														label={__(
															'Line Vertical Position',
															'maxi-blocks'
														)}
														selected={lineVertical}
														options={[
															{
																label: __(
																	'Top',
																	'maxi-blocks'
																),
																value: 'flex-start',
															},
															{
																label: __(
																	'Center',
																	'maxi-blocks'
																),
																value: 'center',
															},
															{
																label: __(
																	'Bottom',
																	'maxi-blocks'
																),
																value: 'flex-end',
															},
														]}
														optionType='string'
														onChange={lineVertical =>
															setAttributes({
																lineVertical,
															})
														}
													/>
													<FancyRadioControl
														fullWidthMode
														label={__(
															'Line Horizontal Position',
															'maxi-blocks'
														)}
														selected={
															lineHorizontal
														}
														options={[
															{
																label: __(
																	'Left',
																	'maxi-blocks'
																),
																value: 'flex-start',
															},
															{
																label: __(
																	'Center',
																	'maxi-blocks'
																),
																value: 'center',
															},
															{
																label: __(
																	'Right',
																	'maxi-blocks'
																),
																value: 'flex-end',
															},
														]}
														optionType='string'
														onChange={lineHorizontal =>
															setAttributes({
																lineHorizontal,
															})
														}
													/>
													<DividerControl
														{...getGroupAttributes(
															attributes,
															['divider', 'size']
														)}
														onChange={obj =>
															setAttributes(obj)
														}
														lineOrientation={
															lineOrientation
														}
														breakpoint={deviceType}
														clientId={clientId}
													/>
												</>
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
																		'divider-'
																	)}
																	prefix='divider-'
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
																				'divider-box-shadow-status-hover'
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
																									'divider-'
																								),
																							},
																							{
																								...getGroupAttributes(
																									attributes,
																									'boxShadow',
																									true,
																									'divider-'
																								),
																							}
																						)),
																					'divider-box-shadow-status-hover':
																						val,
																				}
																			)
																		}
																	/>
																	{attributes[
																		'divider-box-shadow-status-hover'
																	] && (
																		<BoxShadowControl
																			{...getGroupAttributes(
																				attributes,
																				'boxShadow',
																				true,
																				'divider-'
																			)}
																			prefix='divider-'
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
												'Height / Width',
												'maxi-blocks'
											),
											content: (
												<>
													{isFirstOnHierarchy && (
														<ToggleSwitch
															label={__(
																'Set divider to full-width',
																'maxi-blocks'
															)}
															selected={
																fullWidth ===
																'full'
															}
															onChange={val =>
																setAttributes({
																	fullWidth:
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
															'size',
															false,
															'divider-'
														)}
														prefix='divider-'
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
															'padding',
															false,
															'divider-'
														)}
														prefix='divider-'
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
															'divider-'
														)}
														prefix='divider-'
														label={__(
															'Margin',
															'maxi-blocks'
														)}
														onChange={obj =>
															setAttributes(obj)
														}
														target='margin'
														breakpoint={deviceType}
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
									deviceType === 'general' && {
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
																			'backgroundGradient',
																		]
																	)}
																	onChange={obj =>
																		setAttributes(
																			obj
																		)
																	}
																	disableImage
																	disableVideo
																	disableSVG
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
																				'backgroundGradient',
																			],
																			true
																		)}
																		onChange={obj =>
																			setAttributes(
																				obj
																			)
																		}
																		disableImage
																		disableVideo
																		disableSVG
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
																isButton
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
																		isButton
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
									{
										label: __(
											'Height / Width',
											'maxi-blocks'
										),
										content: (
											<>
												{isFirstOnHierarchy && (
													<ToggleSwitch
														label={__(
															'Set divider to full-width',
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
													target='margin'
													breakpoint={deviceType}
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
												'Motion effects',
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
