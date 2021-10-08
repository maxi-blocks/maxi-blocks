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
	ArrowControl,
	AxisControl,
	BlockBackgroundControl,
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
	ShapeDividerControl,
	TextControl,
	ToggleSwitch,
	TransformControl,
	ZIndexControl,
	OverflowControl,
} from '../../components';
import {
	getGroupAttributes,
	setHoverAttributes,
} from '../../extensions/styles';

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
		fullWidth,
		extraClassName,
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
						label: __('Style', 'maxi-blocks'),
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
											label: __(
												'Height / Width',
												'maxi-blocks'
											),
											content: (
												<>
													{isFirstOnHierarchy && (
														<ToggleSwitch
															label={__(
																'Full width',
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
													{fullWidth === 'full' ? (
														<FullSizeControl
															{...getGroupAttributes(
																attributes,
																'container'
															)}
															onChange={obj =>
																setAttributes(
																	obj
																)
															}
															breakpoint={
																deviceType
															}
															prefix='container-'
															hideWidth
															hideMaxWidth
														/>
													) : (
														<FullSizeControl
															{...getGroupAttributes(
																attributes,
																'container'
															)}
															onChange={obj =>
																setAttributes(
																	obj
																)
															}
															breakpoint={
																deviceType
															}
															prefix='container-'
															hideMaxWidth
														/>
													)}
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
										{
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
																<>
																	<BlockBackgroundControl
																		{...getGroupAttributes(
																			attributes,
																			[
																				'background',
																				'parallax',
																			]
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
																		enableParallax
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
																										'parallax',
																									]
																								),
																							},
																							{
																								...getGroupAttributes(
																									attributes,
																									[
																										'background',
																										'parallax',
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
																		<BlockBackgroundControl
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
																			breakpoint={
																				deviceType
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
											label: __(
												'Callout arrow',
												'maxi-blocks'
											),
											content: (
												<ArrowControl
													{...getGroupAttributes(
														attributes,
														[
															'background',
															'arrow',
															'border',
														],
														true
													)}
													onChange={obj =>
														setAttributes(obj)
													}
													isFullWidth={fullWidth}
													breakpoint={deviceType}
												/>
											),
										},
									]}
								/>
							</>
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
											'Custom classes',
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
											'Shape divider',
											'maxi-blocks'
										),
										content: (
											<ShapeDividerControl
												{...getGroupAttributes(
													attributes,
													'shapeDivider'
												)}
												onChange={obj =>
													setAttributes(obj)
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
										label: __('Display', 'maxi-blocks'),
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
