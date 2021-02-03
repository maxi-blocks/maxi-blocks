/**
 * WordPress dependencies
 */
const { __ } = wp.i18n;
const { InspectorControls } = wp.blockEditor;
const { Fragment } = wp.element;
const { TextControl, SelectControl } = wp.components;

/**
 * Internal dependencies
 */
import FullSizeControl from '../../components/full-size-control/newFullSize';
import BorderControl from '../../components/border-control/newBorderControl';
import BoxShadowControl from '../../components/box-shadow-control/newBoxShadowControl';
import AxisControl from '../../components/axis-control/newAxisControl';
import BackgroundControl from '../../components/new-background-control';
import MotionControl from '../../components/new-motion-control';
import EntranceAnimationControl from '../../components/entrance-animation-control/newEntranceControl';
import TransformControl from '../../components/new-transform-control';
import DisplayControl from '../../components/display-control/newDisplayControl';
import PositionControl from '../../components/position-control/newPositionControl';
import ResponsiveControl from '../../components/responsive-control/newResponsiveControl';
import ZIndexControl from '../../components/zindex-control/newIndexControl';
import OpacityControl from '../../components/opacity-control/newOpacityControl';
import TypographyControl from '../../components/typography-control/newTypographyControl';
import FontLevelControl from '../../components/font-level-control/newFontLevelControl';
import AlignmentControl from '../../components/alignment-control/newAlignmentControl';
import {
	AccordionControl,
	BlockStylesControl,
	SettingTabsControl,
	NumberControl,
	FancyRadioControl,
	CustomLabel,
} from '../../components';

import getGroupAttributes from '../../extensions/styles/getGroupAttributes';
import getDefaultAttribute from '../../extensions/styles/getDefaultAttribute';
import getLastBreakpointValue from '../../extensions/styles/getLastBreakpointValue';

/**
 * Inspector
 */
const Inspector = props => {
	const {
		attributes,
		deviceType,
		setAttributes,
		clientId,
		formatValue,
	} = props;
	const {
		customLabel,
		isFirstOnHierarchy,
		uniqueID,
		blockStyle,
		defaultBlockStyle,
		blockStyleBackground,
		fullWidth,
		extraClassName,
		textLevel,
		isList,
		typeOfList,
		listStart,
		listReversed,
	} = attributes;
	const highlight = { ...props.attributes.highlight };

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
										breakpoint={deviceType}
										blockStyleBackground={
											blockStyleBackground
										}
										defaultBlockStyle={defaultBlockStyle}
										isFirstOnHierarchy={isFirstOnHierarchy}
										highlight={highlight}
										onChange={obj => setAttributes(obj)}
										disableHighlightColor1
										disableHighlightColor2
										{...getGroupAttributes(
											attributes,
											'border'
										)}
									/>
								</div>
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
															setAttributes(obj)
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
													<Fragment>
														<SelectControl
															label={__(
																'Type of list',
																'maxi-blocks'
															)}
															value={typeOfList}
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
																setAttributes({
																	typeOfList,
																})
															}
														/>
														{typeOfList ===
															'ol' && (
															<Fragment>
																<NumberControl
																	label={__(
																		'Start from',
																		'maxi-blocks'
																	)}
																	value={
																		listStart
																	}
																	onChange={listStart =>
																		setAttributes(
																			{
																				listStart,
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
																				listReversed: Number(
																					value
																				),
																			}
																		);
																	}}
																/>
															</Fragment>
														)}
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
																	formatValue={
																		formatValue
																	}
																	isList={
																		isList
																	}
																	disableColor={
																		!!highlight.textHighlight
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
																			+attributes[
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
																					'typography-status-hover': !!+val,
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
																			formatValue={
																				formatValue
																			}
																			isList={
																				isList
																			}
																			disableColor={
																				!!highlight.textHighlight
																			}
																			isHover
																			originalFontOptions={getLastBreakpointValue(
																				'font-options',
																				deviceType,
																				attributes
																			)}
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
																		disableColor={
																			!!highlight.backgroundHighlight
																		}
																		disableImage
																		disableVideo
																		disableSVG
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
																			+attributes[
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
																					'background-status-hover': !!+val,
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
																					'backgroundImageHover',
																					'backgroundVideoHover',
																					'backgroundGradientHover',
																					'backgroundSVGHover',
																				]
																			)}
																			onChange={obj =>
																				setAttributes(
																					obj
																				)
																			}
																			disableColor={
																				!!highlight.backgroundHighlight
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
																	disableColor={
																		!!highlight.borderHighlight
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
																			+attributes[
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
																		onChange={val => {
																			setAttributes(
																				{
																					'border-status-hover': !!+val,
																				}
																			);
																		}}
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
																			isHover
																			disableColor={
																				!!highlight.borderHighlight
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
													<FullSizeControl
														{...getGroupAttributes(
															attributes,
															'size'
														)}
														hideMaxWidth
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
																			+attributes[
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
																		onChange={val => {
																			setAttributes(
																				{
																					'box-shadow-status-hover': !!+val,
																				}
																			);
																		}}
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
															[`opacity-${deviceType}`]: val,
														})
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
