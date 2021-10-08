/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { InspectorControls } from '@wordpress/block-editor';
import { memo } from '@wordpress/element';

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
	FullSizeControl,
	Icon,
	IconControl,
	InfoBox,
	MotionControl,
	PositionControl,
	ResponsiveControl,
	SettingTabsControl,
	TextControl,
	ToggleSwitch,
	TransformControl,
	TransitionControl,
	TypographyControl,
	ZIndexControl,
	OverflowControl,
} from '../../components';
import * as defaultPresets from './defaults';
import {
	getGroupAttributes,
	setHoverAttributes,
} from '../../extensions/styles';

/**
 * External dependencies
 */
import { isEmpty, isEqual, cloneDeep } from 'lodash';

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
	presetSeven,
	presetEight,
	presetNine,
	presetTen,
	presetEleven,
} from '../../icons';

/**
 * Inspector
 */
const Inspector = memo(
	props => {
		const { attributes, deviceType, setAttributes, clientId } = props;

		const {
			customLabel,
			uniqueID,
			isFirstOnHierarchy,
			blockStyle,
			extraClassName,
			fullWidth,
			parentBlockStyle,
		} = attributes;

		const onChangePreset = (number, type = 'normal') => {
			const newDefaultPresets = cloneDeep({ ...defaultPresets });

			if (
				type === 'icon' &&
				!isEmpty(attributes['icon-content']) &&
				attributes['icon-content'] !==
					defaultPresets[`preset${number}`]['icon-content']
			)
				newDefaultPresets[`preset${number}`]['icon-content'] =
					attributes['icon-content'];

			setAttributes({
				...newDefaultPresets[`preset${number}`],
			});
		};

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
													setAttributes({
														customLabel,
													})
												}
											/>
											<BlockStylesControl
												blockStyle={blockStyle}
												isFirstOnHierarchy={
													isFirstOnHierarchy
												}
												onChange={obj =>
													setAttributes(obj)
												}
												clientId={clientId}
											/>
										</div>
									)}
									<AccordionControl
										isSecondary
										items={[
											deviceType === 'general' && {
												label: __(
													'Style shortcut',
													'maxi-blocks'
												),
												content: (
													<DefaultStylesControl
														className='maxi-button-default-styles'
														items={[
															{
																label: __(
																	'Button shortcut 1',
																	'maxi-blocks'
																),
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
																label: __(
																	'Button shortcut 2',
																	'maxi-blocks'
																),
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
																label: __(
																	'Button shortcut 3',
																	'maxi-blocks'
																),
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
																label: __(
																	'Button shortcut 4',
																	'maxi-blocks'
																),
																content: (
																	<Icon
																		icon={
																			presetFour
																		}
																	/>
																),
																onChange: () =>
																	onChangePreset(
																		4,
																		'icon'
																	),
															},
															{
																label: __(
																	'Button shortcut 5',
																	'maxi-blocks'
																),
																content: (
																	<Icon
																		icon={
																			presetFive
																		}
																	/>
																),
																onChange: () =>
																	onChangePreset(
																		5,
																		'icon'
																	),
															},
															{
																label: __(
																	'Button shortcut 6',
																	'maxi-blocks'
																),
																content: (
																	<Icon
																		icon={
																			presetSix
																		}
																	/>
																),
																onChange: () =>
																	onChangePreset(
																		6,
																		'icon'
																	),
															},
															{
																label: __(
																	'Button shortcut 7',
																	'maxi-blocks'
																),
																content: (
																	<Icon
																		icon={
																			presetSeven
																		}
																	/>
																),
																onChange: () =>
																	onChangePreset(
																		7,
																		'icon'
																	),
															},
															{
																label: __(
																	'Button shortcut 8',
																	'maxi-blocks'
																),
																content: (
																	<Icon
																		icon={
																			presetEight
																		}
																	/>
																),
																onChange: () =>
																	onChangePreset(
																		8,
																		'icon'
																	),
															},
															{
																label: __(
																	'Button shortcut 9',
																	'maxi-blocks'
																),
																content: (
																	<Icon
																		icon={
																			presetNine
																		}
																	/>
																),
																onChange: () =>
																	onChangePreset(
																		9,
																		'icon'
																	),
															},
															{
																label: __(
																	'Button shortcut 10',
																	'maxi-blocks'
																),
																content: (
																	<Icon
																		icon={
																			presetTen
																		}
																	/>
																),
																onChange: () =>
																	onChangePreset(
																		10,
																		'icon'
																	),
															},
															{
																label: __(
																	'Button shortcut 11',
																	'maxi-blocks'
																),
																content: (
																	<Icon
																		icon={
																			presetEleven
																		}
																	/>
																),
																onChange: () =>
																	onChangePreset(
																		11,
																		'icon'
																	),
															},
														]}
													/>
												),
											},
											{
												label: __(
													'Icon',
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
																	<IconControl
																		{...getGroupAttributes(
																			attributes,
																			[
																				'icon',
																				'iconGradient',
																				'iconBackgroundColor',
																				'iconBorder',
																				'iconBorderWidth',
																				'iconBorderRadius',
																				'iconPadding',
																			]
																		)}
																		onChange={obj => {
																			setAttributes(
																				obj
																			);
																		}}
																		deviceType={
																			deviceType
																		}
																		clientId={
																			clientId
																		}
																		parentBlockStyle={
																			parentBlockStyle
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
																	<IconControl
																		{...getGroupAttributes(
																			attributes,
																			[
																				'iconHover',
																				'iconGradientHover',
																				'iconBackgroundColorHover',
																				'iconBorderHover',
																				'iconBorderWidthHover',
																				'iconBorderRadiusHover',
																			]
																		)}
																		onChange={obj => {
																			setAttributes(
																				obj
																			);
																		}}
																		deviceType={
																			deviceType
																		}
																		clientId={
																			clientId
																		}
																		parentBlockStyle={
																			parentBlockStyle
																		}
																		isHover
																	/>
																),
															},
														]}
													/>
												),
											},
											{
												label: __(
													'Alignment',
													'maxi-blocks'
												),
												content: (
													<>
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
																setAttributes(
																	obj
																)
															}
															breakpoint={
																deviceType
															}
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
																setAttributes(
																	obj
																)
															}
															breakpoint={
																deviceType
															}
															type='text'
														/>
													</>
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
																		clientId={
																			clientId
																		}
																		disableCustomFormats
																		blockStyle={
																			parentBlockStyle
																		}
																		styleCardPrefix='button'
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
																				'Enable Typography Hover',
																				'maxi-blocks'
																			)}
																			selected={
																				attributes[
																					'typography-status-hover'
																				]
																			}
																			onChange={val =>
																				setAttributes(
																					{
																						'typography-status-hover':
																							val,
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
																				isHover
																				clientId={
																					clientId
																				}
																				disableCustomFormats
																				blockStyle={
																					parentBlockStyle
																				}
																				styleCardPrefix='button'
																			/>
																		)}
																	</>
																),
															},
														]}
													/>
												),
											},
											deviceType === 'general' && {
												label: __(
													'Button background',
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
																			disableClipPath
																			disableSVG
																			disableLayers
																			clientId={
																				clientId
																			}
																			isButton
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
																				disableImage
																				disableVideo
																				disableClipPath
																				disableSVG
																				disableLayers
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
												label: __(
													'Border',
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
																	<BorderControl
																		{...getGroupAttributes(
																			attributes,
																			[
																				'border',
																				'borderWidth',
																				'borderRadius',
																			],
																			false,
																			'button-'
																		)}
																		prefix='button-'
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
																					'button-border-status-hover'
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
																											'brder',
																											'brderWidth',
																											'brderRadius',
																										],
																										false,
																										'button-'
																									),
																								},
																								{
																									...getGroupAttributes(
																										attributes,
																										[
																											'brder',
																											'brderWidth',
																											'brderRadius',
																										],
																										true,
																										'button-'
																									),
																								}
																							)),
																						'button-border-status-hover':
																							val,
																					}
																				)
																			}
																		/>
																		{attributes[
																			'button-border-status-hover'
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
																					'button-'
																				)}
																				prefix='button-'
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
													'Height / Width',
													'maxi-blocks'
												),
												content: (
													<>
														{isFirstOnHierarchy && (
															<ToggleSwitch
																label={__(
																	'Set button to full-width',
																	'maxi-blocks'
																)}
																selected={
																	fullWidth ===
																	'full'
																}
																onChange={val =>
																	setAttributes(
																		{
																			fullWidth:
																				val
																					? 'full'
																					: 'normal',
																		}
																	)
																}
															/>
														)}
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
																setAttributes(
																	obj
																)
															}
															breakpoint={
																deviceType
															}
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
																setAttributes(
																	obj
																)
															}
															breakpoint={
																deviceType
															}
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
												'Custom Classes',
												'maxi-blocks'
											),
											content: (
												<TextControl
													label={__(
														'Add CSS class/id',
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
												'Hover transition',
												'maxi-blocks'
											),
											content: (
												<TransitionControl
													{...getGroupAttributes(
														attributes,
														'transitionDuration'
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
							),
						},
					]}
				/>
			</InspectorControls>
		);
	},
	// Avoids non-necessary renderings
	(
		{
			attributes: oldAttr,
			propsToAvoid,
			isSelected: wasSelected,
			deviceType: oldBreakpoint,
		},
		{ attributes: newAttr, isSelected, deviceType: breakpoint }
	) => {
		if (
			!wasSelected ||
			wasSelected !== isSelected ||
			oldBreakpoint !== breakpoint
		)
			return false;

		const oldAttributes = cloneDeep(oldAttr);
		const newAttributes = cloneDeep(newAttr);

		if (!isEmpty(propsToAvoid)) {
			propsToAvoid.forEach(prop => {
				delete oldAttributes[prop];
				delete newAttributes[prop];
			});

			return isEqual(oldAttributes, newAttributes);
		}

		return isEqual(oldAttributes, newAttributes);
	}
);

export default Inspector;
