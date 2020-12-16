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
import {
	AccordionControl,
	AlignmentControl,
	BackgroundControl,
	BorderControl,
	BlockStylesControl,
	BoxShadowControl,
	FontLevelControl,
	FullSizeControl,
	SettingTabsControl,
	TypographyControl,
	ZIndexControl,
	ResponsiveControl,
	NumberControl,
	OpacityControl,
	AxisControl,
	PositionControl,
	DisplayControl,
	MotionControl,
	TransformControl,
	EntranceAnimationControl,
	FancyRadioControl,
	CustomLabel,
} from '../../components';
import { getDefaultProp } from '../../utils';

/**
 * External dependencies
 */
import { isObject } from 'lodash';

/**
 * Inspector
 */
const Inspector = props => {
	const {
		attributes: {
			customLabel,
			isFirstOnHierarchy,
			uniqueID,
			blockStyle,
			defaultBlockStyle,
			highlight,
			blockStyleBackground,
			alignment,
			textLevel,
			isList,
			typeOfList,
			listStart,
			listReversed,
			typography,
			background,
			opacity,
			boxShadow,
			border,
			fullWidth,
			size,
			margin,
			padding,
			typographyHover,
			backgroundHover,
			boxShadowHover,
			borderHover,
			extraClassName,
			breakpoints,
			zIndex,
			position,
			display,
			motion,
			transform,
		},
		deviceType,
		setAttributes,
		clientId,
		formatValue,
	} = props;

	const backgroundHoverValue = !isObject(backgroundHover)
		? JSON.parse(backgroundHover)
		: backgroundHover;

	const boxShadowHoverValue = !isObject(boxShadowHover)
		? JSON.parse(boxShadowHover)
		: boxShadowHover;

	const typographyHoverValue = !isObject(typographyHover)
		? JSON.parse(typographyHover)
		: typographyHover;

	const borderHoverValue = !isObject(borderHover)
		? JSON.parse(borderHover)
		: borderHover;

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
										onChange={highlight =>
											setAttributes({ highlight })
										}
										disableHighlightColor1
										disableHighlightColor2
										border={border}
										onChangeBorder={border =>
											setAttributes({ border })
										}
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
													alignment={alignment}
													onChange={alignment =>
														setAttributes({
															alignment,
														})
													}
													breakpoint={deviceType}
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
														value={textLevel}
														onChange={obj =>
															setAttributes(obj)
														}
														fontOptions={typography}
														fontOptionsHover={
															typographyHover
														}
														marginOptions={margin}
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
																'gutenberg-extra'
															),
															content: (
																<TypographyControl
																	typography={
																		typography
																	}
																	defaultTypography={getDefaultProp(
																		clientId,
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
																/>
															),
														},
														{
															label: __(
																'Hover',
																'gutenberg-extra'
															),
															content: (
																<Fragment>
																	<FancyRadioControl
																		label={__(
																			'Enable Typography Hover',
																			'maxi-blocks'
																		)}
																		selected={Number(
																			typographyHoverValue.status
																		)}
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
																			typographyHoverValue.status = Number(
																				val
																			);
																			setAttributes(
																				{
																					typographyHover: JSON.stringify(
																						typographyHoverValue
																					),
																				}
																			);
																		}}
																	/>
																	{!!typographyHoverValue.status && (
																		<TypographyControl
																			typography={
																				typographyHover
																			}
																			defaultTypography={getDefaultProp(
																				clientId,
																				'typographyHover'
																			)}
																			textLevel={
																				textLevel
																			}
																			onChange={obj => {
																				setAttributes(
																					{
																						typographyHover:
																							obj.typography,
																						...(obj.content && {
																							content:
																								obj.content,
																						}),
																					}
																				);
																			}}
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
																'gutenberg-extra'
															),
															content: (
																<Fragment>
																	<BackgroundControl
																		background={
																			background
																		}
																		defaultBackground={getDefaultProp(
																			clientId,
																			'background'
																		)}
																		onChange={background =>
																			setAttributes(
																				{
																					background,
																				}
																			)
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
																'gutenberg-extra'
															),
															content: (
																<Fragment>
																	<FancyRadioControl
																		label={__(
																			'Enable Background Hover',
																			'maxi-blocks'
																		)}
																		selected={
																			backgroundHoverValue.status
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
																			backgroundHoverValue.status = Number(
																				val
																			);
																			setAttributes(
																				{
																					backgroundHover: JSON.stringify(
																						backgroundHoverValue
																					),
																				}
																			);
																		}}
																	/>
																	{!!backgroundHoverValue.status && (
																		<BackgroundControl
																			background={
																				backgroundHover
																			}
																			defaultBackground={getDefaultProp(
																				clientId,
																				'backgroundHover'
																			)}
																			onChange={backgroundHover =>
																				setAttributes(
																					{
																						backgroundHover,
																					}
																				)
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
																'gutenberg-extra'
															),
															content: (
																<BorderControl
																	border={
																		border
																	}
																	defaultBorder={getDefaultProp(
																		clientId,
																		'border'
																	)}
																	onChange={border =>
																		setAttributes(
																			{
																				border,
																			}
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
																'gutenberg-extra'
															),
															content: (
																<Fragment>
																	<FancyRadioControl
																		label={__(
																			'Enable Border Hover',
																			'maxi-blocks'
																		)}
																		selected={Number(
																			borderHoverValue.status
																		)}
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
																			borderHoverValue.status = Number(
																				val
																			);
																			setAttributes(
																				{
																					borderHover: JSON.stringify(
																						borderHoverValue
																					),
																				}
																			);
																		}}
																	/>
																	{!!borderHoverValue.status && (
																		<BorderControl
																			border={
																				borderHover
																			}
																			defaultBorder={getDefaultProp(
																				clientId,
																				'borderHover'
																			)}
																			onChange={borderHover =>
																				setAttributes(
																					{
																						borderHover,
																					}
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
														size={size}
														defaultSize={getDefaultProp(
															clientId,
															'size'
														)}
														onChange={size =>
															setAttributes({
																size,
															})
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
																'gutenberg-extra'
															),
															content: (
																<BoxShadowControl
																	boxShadow={
																		boxShadow
																	}
																	defaultBoxShadow={getDefaultProp(
																		clientId,
																		'boxShadow'
																	)}
																	onChange={boxShadow =>
																		setAttributes(
																			{
																				boxShadow,
																			}
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
																'gutenberg-extra'
															),
															content: (
																<Fragment>
																	<FancyRadioControl
																		label={__(
																			'Enable Border Hover',
																			'maxi-blocks'
																		)}
																		selected={Number(
																			boxShadowHoverValue.status
																		)}
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
																			boxShadowHoverValue.status = Number(
																				val
																			);
																			setAttributes(
																				{
																					boxShadowHover: JSON.stringify(
																						boxShadowHoverValue
																					),
																				}
																			);
																		}}
																	/>
																	{!!boxShadowHoverValue.status && (
																		<BoxShadowControl
																			boxShadow={
																				boxShadowHover
																			}
																			defaultBoxShadow={getDefaultProp(
																				clientId,
																				'boxShadowHover'
																			)}
																			onChange={boxShadowHover =>
																				setAttributes(
																					{
																						boxShadowHover,
																					}
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
												'Padding / Margin',
												'maxi-blocks'
											),
											content: (
												<Fragment>
													<AxisControl
														values={padding}
														defaultValues={getDefaultProp(
															clientId,
															'padding'
														)}
														onChange={padding =>
															setAttributes({
																padding,
															})
														}
														breakpoint={deviceType}
														disableAuto
													/>
													<AxisControl
														values={margin}
														defaultValues={getDefaultProp(
															clientId,
															'margin'
														)}
														onChange={margin =>
															setAttributes({
																margin,
															})
														}
														breakpoint={deviceType}
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
													motion={motion}
													onChange={motion =>
														setAttributes({
															motion,
														})
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
													motion={motion}
													defaultMotion={getDefaultProp(
														clientId,
														'motion'
													)}
													onChange={motion =>
														setAttributes({
															motion,
														})
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
													transform={transform}
													onChange={transform =>
														setAttributes({
															transform,
														})
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
													display={display}
													onChange={display =>
														setAttributes({
															display,
														})
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
													position={position}
													defaultPosition={getDefaultProp(
														clientId,
														'position'
													)}
													onChange={position =>
														setAttributes({
															position,
														})
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
													breakpoints={breakpoints}
													defaultBreakpoints={getDefaultProp(
														clientId,
														'breakpoints'
													)}
													onChange={breakpoints =>
														setAttributes({
															breakpoints,
														})
													}
													breakpoint={deviceType}
												/>
											),
										},
										{
											label: __('Z-index', 'maxi-blocks'),
											content: (
												<ZIndexControl
													zIndex={zIndex}
													defaultZIndex={getDefaultProp(
														clientId,
														'zIndex'
													)}
													onChange={zIndex =>
														setAttributes({
															zIndex,
														})
													}
													breakpoint={deviceType}
												/>
											),
										},
										{
											label: __('Opacity', 'maxi-blocks'),
											content: (
												<OpacityControl
													opacity={opacity}
													defaultOpacity={getDefaultProp(
														clientId,
														'opacity'
													)}
													onChange={opacity =>
														setAttributes({
															opacity,
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
