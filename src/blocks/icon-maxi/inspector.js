/**
 * WordPress dependencies
 */
const { __ } = wp.i18n;
const { InspectorControls } = wp.blockEditor;
const { Fragment } = wp.element;
const {
	RangeControl,
	SelectControl,
	TextareaControl,
	TextControl,
} = wp.components;

/**
 * Internal dependencies
 */
import { getDefaultProp } from '../../utils';
import {
	AccordionControl,
	AlignmentControl,
	BackgroundControl,
	BorderControl,
	BlockStylesControl,
	BoxShadowControl,
	FullSizeControl,
	ImageCropControl,
	SettingTabsControl,
	TypographyControl,
	__experimentalZIndexControl,
	__experimentalAxisControl,
	__experimentalResponsiveControl,
	__experimentalOpacityControl,
	__experimentalPositionControl,
	__experimentalDisplayControl,
	__experimentalTransformControl,
	__experimentalClipPath,
	__experimentalEntranceAnimationControl,
	__experimentalHoverEffectControl,
	__experimentalImageAltControl,
	__experimentalFancyRadioControl,
} from '../../components';

/**
 * External dependencies
 */
import { capitalize, isEmpty, isNil, isObject } from 'lodash';

/**
 * Inspector
 */
const Inspector = props => {
	const {
		attributes: {
			uniqueID,
			isFirstOnHierarchy,
			blockStyle,
			defaultBlockStyle,
			imageSize,
			cropOptions,
			fullWidth,
			alignment,
			captionType,
			captionContent,
			captionTypography,
			background,
			opacity,
			boxShadow,
			border,
			size,
			padding,
			margin,
			backgroundHover,
			boxShadowHover,
			borderHover,
			mediaID,
			extraClassName,
			zIndex,
			mediaAlt,
			altSelector,
			breakpoints,
			position,
			display,
			transform,
			clipPath,
			hover,
			content,
		},
		imageData,
		clientId,
		deviceType,
		setAttributes,
	} = props;

	const sizeValue = !isObject(size) ? JSON.parse(size) : size;

	const defaultSize = JSON.parse(getDefaultProp(clientId, 'size'));

	const getSizeOptions = () => {
		const response = [];
		if (imageData) {
			let { sizes } = imageData.media_details;
			sizes = Object.entries(sizes).sort((a, b) => {
				return a[1].width - b[1].width;
			});
			sizes.map(size => {
				const name = capitalize(size[0]);
				const val = size[1];
				response.push({
					label: `${name} - ${val.width}x${val.height}`,
					value: size[0],
				});
			});
		}
		response.push({
			label: 'Custom',
			value: 'custom',
		});
		return response;
	};

	const getCaptionOptions = () => {
		const response = [
			{ label: 'None', value: 'none' },
			{ label: 'Custom Caption', value: 'custom' },
		];
		if (imageData && !isEmpty(imageData.caption.rendered)) {
			const newCaption = {
				label: 'Attachment Caption',
				value: 'attachment',
			};
			response.splice(1, 0, newCaption);
		}
		return response;
	};

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
									<__experimentalImageAltControl
										mediaAlt={mediaAlt}
										altSelector={altSelector}
										onChangeAltSelector={altSelector => {
											setAttributes({ altSelector });
										}}
										onChangeMediaAlt={mediaAlt =>
											setAttributes({ mediaAlt })
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
													disableJustify
													breakpoint={deviceType}
												/>
											),
										},
										(function () {
											if (deviceType === 'general') {
												return {
													label: __(
														'Width / Height',
														'maxi-blocks'
													),
													content: (
														<Fragment>
															<SelectControl
																label={__(
																	'Image Size',
																	'maxi-blocks'
																)}
																value={
																	imageSize ||
																	imageSize ==
																		'custom'
																		? imageSize
																		: 'full'
																} // is still necessary?
																options={getSizeOptions()}
																onChange={imageSize =>
																	setAttributes(
																		{
																			imageSize,
																		}
																	)
																}
															/>
															{imageSize ===
																'custom' && (
																<ImageCropControl
																	mediaID={
																		mediaID
																	}
																	cropOptions={JSON.parse(
																		cropOptions
																	)}
																	onChange={cropOptions =>
																		setAttributes(
																			{
																				cropOptions: JSON.stringify(
																					cropOptions
																				),
																			}
																		)
																	}
																/>
															)}
															<RangeControl
																label={__(
																	'Width',
																	'maxi-blocks'
																)}
																value={
																	sizeValue
																		.general
																		.width
																}
																onChange={val => {
																	if (
																		isNil(
																			val
																		)
																	)
																		sizeValue.general.width =
																			defaultSize.general.width;
																	else
																		sizeValue.general.width = val;

																	setAttributes(
																		{
																			size: JSON.stringify(
																				sizeValue
																			),
																		}
																	);
																}}
																allowReset
																initialPosition={
																	defaultSize
																		.general
																		.width
																}
															/>
														</Fragment>
													),
												};
											}
										})(),
										(function () {
											if (deviceType === 'general') {
												return {
													label: __(
														'Caption',
														'maxi-blocks'
													),
													content: (
														<Fragment>
															<SelectControl
																value={
																	captionType
																}
																options={getCaptionOptions()}
																onChange={captionType => {
																	setAttributes(
																		{
																			captionType,
																		}
																	);
																	if (
																		imageData &&
																		captionType ===
																			'attachment'
																	)
																		setAttributes(
																			{
																				captionContent:
																					imageData
																						.caption
																						.raw,
																			}
																		);
																}}
															/>
															{captionType ===
																'custom' && (
																<TextareaControl
																	className='custom-caption'
																	placeHolder={__(
																		'Add you Custom Caption here',
																		'maxi-blocks'
																	)}
																	value={
																		captionContent
																	}
																	onChange={captionContent =>
																		setAttributes(
																			{
																				captionContent,
																			}
																		)
																	}
																/>
															)}
															{captionType !=
																'none' && (
																<TypographyControl
																	typography={
																		captionTypography
																	}
																	defaultTypography={getDefaultProp(
																		clientId,
																		'captionTypography'
																	)}
																	onChange={captionTypography =>
																		setAttributes(
																			{
																				captionTypography,
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
												};
											}
										})(),
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
																'gutenberg-extra'
															),
															content: (
																<Fragment>
																	<__experimentalOpacityControl
																		opacity={
																			opacity
																		}
																		defaultOpacity={getDefaultProp(
																			clientId,
																			'opacity'
																		)}
																		onChange={opacity =>
																			setAttributes(
																				{
																					opacity,
																				}
																			)
																		}
																		breakpoint={
																			deviceType
																		}
																	/>
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
																		disableGradient
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
																		disableGradient
																		disableSVG
																	/>
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
																	<__experimentalFancyRadioControl
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
														<__experimentalFancyRadioControl
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
														hideWidth
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
								<div className='maxi-tab-content__box'>
									{deviceType === 'general' && (
										<Fragment>
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
										</Fragment>
									)}
									<__experimentalZIndexControl
										zIndex={zIndex}
										defaultZIndex={getDefaultProp(
											clientId,
											'zIndex'
										)}
										onChange={zIndex =>
											setAttributes({ zIndex })
										}
										breakpoint={deviceType}
									/>
									{deviceType != 'general' && (
										<__experimentalResponsiveControl
											breakpoints={breakpoints}
											defaultBreakpoints={getDefaultProp(
												clientId,
												'breakpoints'
											)}
											onChange={breakpoints =>
												setAttributes({ breakpoints })
											}
											breakpoint={deviceType}
										/>
									)}
									<__experimentalPositionControl
										position={position}
										defaultPosition={getDefaultProp(
											clientId,
											'position'
										)}
										onChange={position =>
											setAttributes({ position })
										}
										breakpoint={deviceType}
									/>
									<__experimentalDisplayControl
										display={display}
										onChange={display =>
											setAttributes({ display })
										}
										breakpoint={deviceType}
										defaultDisplay='flex'
									/>
									<__experimentalClipPath
										clipPath={clipPath}
										onChange={clipPath =>
											setAttributes({ clipPath })
										}
									/>
								</div>
								<AccordionControl
									isPrimary
									items={[
										{
											label: __(
												'Hover Effects',
												'maxi-blocks'
											),
											content: (
												<__experimentalHoverEffectControl
													hover={hover}
													defaultHover={getDefaultProp(
														clientId,
														'hover'
													)}
													onChange={hover =>
														setAttributes({ hover })
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
