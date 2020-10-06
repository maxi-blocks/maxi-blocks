/**
 * WordPress dependencies
 */
const { __ } = wp.i18n;
const { InspectorControls } = wp.blockEditor;
const { Fragment } = wp.element;
const { useSelect } = wp.data;
const { TextControl, RadioControl, SelectControl } = wp.components;

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
	__experimentalZIndexControl,
	__experimentalResponsiveSelector,
	__experimentalResponsiveControl,
	__experimentalNumberControl,
	__experimentalOpacityControl,
	__experimentalAxisControl,
	__experimentalPositionControl,
	__experimentalDisplayControl,
	__experimentalMotionControl,
	__experimentalTransformControl,
	__experimentalEntranceAnimationControl,
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
			isFirstOnHierarchy,
			uniqueID,
			blockStyle,
			defaultBlockStyle,
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
		setAttributes,
		clientId,
	} = props;

	const { deviceType } = useSelect(select => {
		const { __experimentalGetPreviewDeviceType } = select('core/edit-post');
		let deviceType = __experimentalGetPreviewDeviceType();
		deviceType = deviceType === 'Desktop' ? 'general' : deviceType;
		return {
			deviceType,
		};
	});

	const backgroundHoverValue = !isObject(backgroundHover)
		? JSON.parse(backgroundHover)
		: backgroundHover;

	return (
		<InspectorControls>
			<__experimentalResponsiveSelector />
			<SettingTabsControl
				disablePadding
				items={[
					{
						label: __('Style', 'maxi-blocks'),
						content: (
							<Fragment>
								<div className='maxi-tab-content__box'>
									<BlockStylesControl
										blockStyle={blockStyle}
										onChangeBlockStyle={blockStyle =>
											setAttributes({ blockStyle })
										}
										defaultBlockStyle={defaultBlockStyle}
										onChangeDefaultBlockStyle={defaultBlockStyle =>
											setAttributes({ defaultBlockStyle })
										}
										isFirstOnHierarchy={isFirstOnHierarchy}
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
														onChange={(
															textLevel,
															typography,
															typographyHover,
															margin
														) =>
															setAttributes({
																textLevel,
																typography,
																typographyHover,
																margin,
															})
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
																<__experimentalNumberControl
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
																	onChange={typography =>
																		setAttributes(
																			{
																				typography,
																			}
																		)
																	}
																	hideAlignment
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
																	onChange={typographyHover =>
																		setAttributes(
																			{
																				typographyHover,
																			}
																		)
																	}
																	hideAlignment
																	breakpoint={
																		deviceType
																	}
																/>
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
																	<div className='maxi-fancy-radio-control'>
																		<RadioControl
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
																	</div>
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
														<div className='maxi-fancy-radio-control'>
															<RadioControl
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
																	setAttributes(
																		{
																			fullWidth,
																		}
																	)
																}
															/>
														</div>
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
													<__experimentalAxisControl
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
													<__experimentalAxisControl
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
												<__experimentalMotionControl
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
												<__experimentalEntranceAnimationControl
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
												<__experimentalTransformControl
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
												<__experimentalDisplayControl
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
												<__experimentalPositionControl
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
												<__experimentalResponsiveControl
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
												<__experimentalZIndexControl
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
												<__experimentalOpacityControl
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
