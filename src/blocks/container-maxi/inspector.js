/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { InspectorControls } from '@wordpress/block-editor';
import { Fragment } from '@wordpress/element';

/**
 * Internal dependencies
 */
import {
	AccordionControl,
	ArrowControl,
	AxisControl,
	BackgroundControl,
	BlockStylesControl,
	BorderControl,
	BoxShadowControl,
	CustomLabel,
	DisplayControl,
	EntranceAnimationControl,
	FancyRadioControl,
	FullSizeControl,
	MotionControl,
	OpacityControl,
	ParallaxControl,
	PositionControl,
	ResponsiveControl,
	SettingTabsControl,
	ShapeDividerControl,
	TextControl,
	TransformControl,
	ZIndexControl,
} from '../../components';
import {
	getDefaultAttribute,
	getGroupAttributes,
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
										isFirstOnHierarchy={isFirstOnHierarchy}
										onChange={obj => setAttributes(obj)}
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
																		'Yes',
																		'maxi-blocks'
																	),
																	value: 'full',
																},
																{
																	label: __(
																		'No',
																		'maxi-blocks'
																	),
																	value: 'normal',
																},
															]}
															optionType='string'
															onChange={fullWidth =>
																setAttributes({
																	fullWidth,
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
																		{...getGroupAttributes(
																			attributes,
																			[
																				'background',
																				'backgroundColor',
																				'backgroundImage',
																				'backgroundVideo',
																				'backgroundGradient',
																				'backgroundSVG',
																				'palette',
																			]
																		)}
																		onChange={obj =>
																			setAttributes(
																				obj
																			)
																		}
																		useStyleCard
																		clientId={
																			clientId
																		}
																	/>
																	{attributes[
																		'background-active-media'
																	] ===
																		'image' && (
																		<ParallaxControl
																			{...getGroupAttributes(
																				attributes,
																				'parallax'
																			)}
																			onChange={obj =>
																				setAttributes(
																					obj
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
																			attributes[
																				'background-status-hover'
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
																		onChange={val =>
																			setAttributes(
																				{
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
																					'backgroundHover',
																					'backgroundColorHover',
																					'backgroundGradientHover',
																					'palette',
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
																			isHover
																			clientId={
																				clientId
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
																	{...getGroupAttributes(
																		attributes,
																		[
																			'border',
																			'borderWidth',
																			'borderRadius',
																			'palette',
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
																<Fragment>
																	<FancyRadioControl
																		label={__(
																			'Enable Border Hover',
																			'maxi-blocks'
																		)}
																		selected={
																			attributes[
																				'border-status-hover'
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
																		onChange={val =>
																			setAttributes(
																				{
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
																					'borderHover',
																					'borderWidthHover',
																					'borderRadiusHover',
																					'palette',
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
																			isHover
																			clientId={
																				clientId
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
																		[
																			'boxShadow',
																			'palette',
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
																<Fragment>
																	<FancyRadioControl
																		label={__(
																			'Enable Box Shadow Hover',
																			'maxi-blocks'
																		)}
																		selected={
																			attributes[
																				'box-shadow-status-hover'
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
																		onChange={val =>
																			setAttributes(
																				{
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
																				[
																					'boxShadowHover',
																					'palette',
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
																			isHover
																			clientId={
																				clientId
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
														optionType='string'
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
											'Motion Effects',
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
											'Entrance Animation',
											'maxi-blocks'
										),
										content: (
											<EntranceAnimationControl
												{...getGroupAttributes(
													attributes,
													'entrance'
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
												opacity={
													attributes[
														`opacity-${deviceType}`
													]
												}
												defaultOpacity={getDefaultAttribute(
													`opacity-${deviceType}`,
													clientId
												)}
												onChange={val =>
													setAttributes({
														[`opacity-${deviceType}`]:
															val,
													})
												}
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
