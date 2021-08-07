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
	DisplayControl,
	EntranceAnimationControl,
	FancyRadioControl,
	FontLevelControl,
	FullSizeControl,
	InfoBox,
	MotionControl,
	OpacityControl,
	PositionControl,
	ResponsiveControl,
	SelectControl,
	SettingTabsControl,
	AdvancedNumberControl,
	TextControl,
	TransformControl,
	TypographyControl,
	ZIndexControl,
} from '../../components';
import {
	getGroupAttributes,
	setHoverAttributes,
} from '../../extensions/styles';

/**
 * External dependencies
 */
import { isEmpty, isEqual, cloneDeep } from 'lodash';

/**
 * Inspector
 */
const Inspector = memo(
	props => {
		const { attributes, deviceType, setAttributes, clientId } = props;
		const {
			customLabel,
			isFirstOnHierarchy,
			uniqueID,
			blockStyle,
			fullWidth,
			extraClassName,
			textLevel,
			isList,
			typeOfList,
			listStart,
			listReversed,
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
													setAttributes({
														customLabel,
													})
												}
											/>
											<hr />
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
											{
												label: __(
													'Alignment',
													'maxi-blocks'
												),
												content: (
													<AlignmentControl
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
												),
											},
											deviceType === 'general' &&
												!isList && {
													label: __(
														'Level',
														'maxi-blocks'
													),
													content: (
														<FontLevelControl
															{...getGroupAttributes(
																attributes,
																[
																	'typography',
																	'typographyHover',
																]
															)}
															value={textLevel}
															onChange={obj =>
																setAttributes(
																	obj
																)
															}
														/>
													),
												},
											deviceType === 'general' &&
												isList && {
													label: __(
														'List Options',
														'maxi-blocks'
													),
													content: (
														<>
															<SelectControl
																label={__(
																	'Type of list',
																	'maxi-blocks'
																)}
																value={
																	typeOfList
																}
																options={[
																	{
																		label: __(
																			'Unorganized',
																			'maxi-blocks'
																		),
																		value: 'ul',
																	},
																	{
																		label: __(
																			'Organized',
																			'maxi-blocks'
																		),
																		value: 'ol',
																	},
																]}
																onChange={typeOfList =>
																	setAttributes(
																		{
																			typeOfList,
																		}
																	)
																}
															/>
															{typeOfList ===
																'ol' && (
																<>
																	<AdvancedNumberControl
																		label={__(
																			'Start From',
																			'maxi-blocks'
																		)}
																		value={
																			listStart
																		}
																		onChangeValue={val => {
																			setAttributes(
																				{
																					listStart:
																						val !==
																							undefined &&
																						val !==
																							''
																							? val
																							: '',
																				}
																			);
																		}}
																		min={
																			-99
																		}
																		max={99}
																		onReset={() =>
																			setAttributes(
																				{
																					listStart:
																						'',
																				}
																			)
																		}
																	/>
																	<SelectControl
																		label={__(
																			'Reverse order',
																			'maxi-blocks'
																		)}
																		value={
																			listReversed
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
																		onChange={value => {
																			setAttributes(
																				{
																					listReversed:
																						Number(
																							value
																						),
																				}
																			);
																		}}
																	/>
																</>
															)}
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
																			[
																				'typography',
																				'link',
																			]
																		)}
																		textLevel={
																			textLevel
																		}
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
																		isList={
																			isList
																		}
																		blockStyle={
																			blockStyle
																		}
																		allowLink
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
																				textLevel={
																					textLevel
																				}
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
																				isList={
																					isList
																				}
																				isHover
																				blockStyle={
																					blockStyle
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
																	<>
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
																				clientId={
																					clientId
																				}
																				isHover
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
													'Width / Height',
													'maxi-blocks'
												),
												content: (
													<>
														{isFirstOnHierarchy && (
															<FancyRadioControl
																label={__(
																	'Full Width',
																	'maxi-blocks'
																)}
																selected={
																	fullWidth
																}
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
																	setAttributes(
																		{
																			fullWidth,
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
															hideMaxWidth
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
																				isHover
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
													'Padding / Margin',
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
							label: __('Advanced', 'maxi-blocks'),
							content: (
								<>
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
												label: __(
													'Display',
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
													'Z-index',
													'maxi-blocks'
												),
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
												label: __(
													'Opacity',
													'maxi-blocks'
												),
												content: (
													<OpacityControl
														opacity={
															attributes[
																`opacity-${deviceType}`
															]
														}
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
								</>
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
