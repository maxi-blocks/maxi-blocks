/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
const { InspectorControls } = wp.blockEditor;
const { TextControl, Icon } = wp.components;
const { Fragment } = wp.element;

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
	DefaultStylesControl,
	DisplayControl,
	EntranceAnimationControl,
	FancyRadioControl,
	FontIconControl,
	FullSizeControl,
	MotionControl,
	PositionControl,
	ResponsiveControl,
	SettingTabsControl,
	TransformControl,
	TypographyControl,
	ZIndexControl,
} from '../../components';
import * as defaultPresets from './defaults';
import { getGroupAttributes } from '../../extensions/styles';

/**
 * Icons
 */
import {
	presetOne,
	presetTwo,
	presetThree,
	presetFour,
	presetFive,
	presetSix,
} from '../../icons';

/**
 * Inspector
 */
const Inspector = props => {
	const { attributes, deviceType, setAttributes, formatValue } = props;
	const {
		customLabel,
		uniqueID,
		isFirstOnHierarchy,
		blockStyle,
		defaultBlockStyle,
		blockStyleBackground,
		extraClassName,
		fullWidth,
	} = attributes;

	const onChangePreset = number => {
		setAttributes({ ...defaultPresets[`preset${number}`] });
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
											setAttributes({
												customLabel,
											})
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
										disableHighlightColor1
										disableHighlightColor2
										{...getGroupAttributes(attributes, [
											'border',
											'highlight',
										])}
									/>
								</div>
								<AccordionControl
									isSecondary
									items={[
										deviceType === 'general' && {
											label: __('Style', 'maxi-blocks'),
											content: (
												<DefaultStylesControl
													className='maxi-button-default-styles'
													items={[
														{
															activeItem: 0,
															content: (
																<Icon
																	icon={
																		presetOne
																	}
																/>
															),
															onChange: () =>
																onChangePreset(
																	1
																),
														},
														{
															activeItem: 0,
															content: (
																<Icon
																	icon={
																		presetTwo
																	}
																/>
															),
															onChange: () =>
																onChangePreset(
																	2
																),
														},
														{
															activeItem: 0,
															content: (
																<Icon
																	icon={
																		presetThree
																	}
																/>
															),
															onChange: () =>
																onChangePreset(
																	3
																),
														},
														{
															activeItem: 0,
															content: (
																<Icon
																	icon={
																		presetFour
																	}
																/>
															),
															onChange: () =>
																onChangePreset(
																	4
																),
														},
														{
															activeItem: 0,
															content: (
																<Icon
																	icon={
																		presetFive
																	}
																/>
															),
															onChange: () =>
																onChangePreset(
																	5
																),
														},
														{
															activeItem: 0,
															content: (
																<Icon
																	icon={
																		presetSix
																	}
																/>
															),
															onChange: () =>
																onChangePreset(
																	6
																),
														},
													]}
												/>
											),
										},
										{
											label: __('Icon', 'maxi-blocks'),
											content: (
												<FontIconControl
													{...getGroupAttributes(
														attributes,
														[
															'icon',
															'iconPadding',
															'iconBorder',
															'iconBorderWidth',
															'iconBorderRadius',
														]
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
													<AlignmentControl
														label={__(
															'Text',
															'maxi-blocks'
														)}
														{...getGroupAttributes(
															attributes,
															'textAlignment'
														)}
														onChange={obj =>
															setAttributes(obj)
														}
														breakpoint={deviceType}
														type='text'
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
																	{...getGroupAttributes(
																		attributes,
																		'typography'
																	)}
																	onChange={obj =>
																		setAttributes(
																			obj
																		)
																	}
																	hideAlignment
																	breakpoint={
																		deviceType
																	}
																	formatValue={
																		formatValue
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
																			'Enable Typography Hover',
																			'maxi-blocks'
																		)}
																		selected={
																			attributes[
																				'typography-status-hover'
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
																					'typography-status-hover': val,
																				}
																			)
																		}
																	/>
																	{attributes[
																		'typography-status-hover'
																	] && (
																		<TypographyControl
																			{...getGroupAttributes(
																				attributes,
																				[
																					'typography',
																					'typographyHover',
																				]
																			)}
																			onChange={obj =>
																				setAttributes(
																					obj
																				)
																			}
																			hideAlignment
																			breakpoint={
																				deviceType
																			}
																			formatValue={
																				formatValue
																			}
																			isHover
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
																				'backgroundGradient',
																			]
																		)}
																		onChange={obj =>
																			setAttributes(
																				obj
																			)
																		}
																		disableColor={
																			!!attributes[
																				'background-highlight'
																			]
																		}
																		disableImage
																		disableVideo
																		disableClipPath
																		disableSVG
																		disableLayers
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
																					'background-status-hover': val,
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
																				]
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
																			disableClipPath
																			disableSVG
																			disableLayers
																			isHover
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
																	disableColor={
																		!!attributes[
																			'border-highlight'
																		]
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
																					'border-status-hover': val,
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
																			disableColor={
																				!!attributes[
																					'border-highlight'
																				]
																			}
																			isHover
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
															optionType='string'
															onChange={fullWidth =>
																setAttributes({
																	fullWidth,
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
												</Fragment>
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
																					'box-shadow-status-hover': val,
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
												'Padding / Margin',
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
							</Fragment>
						),
					},
				]}
			/>
		</InspectorControls>
	);
};

export default Inspector;
