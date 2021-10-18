/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { InspectorControls } from '@wordpress/block-editor';
import { TextControl } from '@wordpress/components';

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
	FullSizeControl,
	InfoBox,
	NumberCounterControl,
	OpacityControl,
	OverflowControl,
	PositionControl,
	ResponsiveControl,
	SettingTabsControl,
	ToggleSwitch,
	TransformControl,
	ZIndexControl,
} from '../../components';
import {
	getGroupAttributes,
	setHoverAttributes,
} from '../../extensions/styles';

/**
 * Inspector
 */
const Inspector = props => {
	const { attributes, clientId, deviceType, setAttributes } = props;
	const {
		blockFullWidth,
		blockStyle,
		customLabel,
		extraClassName,
		isFirstOnHierarchy,
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
									isPrimary
									items={[
										{
											label: __('Number', 'maxi-blocks'),
											content: (
												<NumberCounterControl
													{...getGroupAttributes(
														attributes,
														'numberCounter'
													)}
													{...getGroupAttributes(
														attributes,
														'size',
														false,
														'number-counter-'
													)}
													onChange={obj =>
														setAttributes(obj)
													}
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
																		'number-counter-'
																	)}
																	prefix='number-counter-'
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
																				'number-counter-border-status-hover'
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
																									'number-counter-'
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
																									'number-counter-'
																								),
																							}
																						)),
																					'number-counter-border-status-hover':
																						val,
																				}
																			)
																		}
																	/>
																	{attributes[
																		'number-counter-border-status-hover'
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
																				'number-counter-'
																			)}
																			prefix='number-counter-'
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
																		'number-counter-'
																	)}
																	prefix='number-counter-'
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
																				'number-counter-box-shadow-status-hover'
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
																									'number-counter-'
																								),
																							},
																							{
																								...getGroupAttributes(
																									attributes,
																									'boxShadow',
																									true,
																									'number-counter-'
																								),
																							}
																						)),
																					'number-counter-box-shadow-status-hover':
																						val,
																				}
																			)
																		}
																	/>
																	{attributes[
																		'number-counter-box-shadow-status-hover'
																	] && (
																		<BoxShadowControl
																			{...getGroupAttributes(
																				attributes,
																				'boxShadow',
																				true,
																				'number-counter-'
																			)}
																			prefix='number-counter-'
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
												'Padding & Margin',
												'maxi-blocks'
											),
											content: (
												<>
													<AxisControl
														{...getGroupAttributes(
															attributes,
															'padding',
															false,
															'number-counter-'
														)}
														prefix='number-counter-'
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
															'number-counter-'
														)}
														prefix='number-counter-'
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
															'Set number counter to full-width',
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
											'Padding & Margin',
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
										label: __('Transform', 'maxi-blocks'),
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
										label: __('Position', 'maxi-blocks'),
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
										label: __('Breakpoint', 'maxi-blocks'),
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
										label: __('Overflow', 'maxi-blocks'),
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
						),
					},
				]}
			/>
		</InspectorControls>
	);
};

export default Inspector;
