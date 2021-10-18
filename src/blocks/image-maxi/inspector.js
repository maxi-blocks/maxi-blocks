/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { InspectorControls } from '@wordpress/block-editor';
import { RangeControl, TextControl } from '@wordpress/components';
import { memo } from '@wordpress/element';

/**
 * Internal dependencies
 */
import {
	AccordionControl,
	AlignmentControl,
	AxisControl,
	BlockStylesControl,
	BorderControl,
	BoxShadowControl,
	ClipPath,
	CustomLabel,
	DisplayControl,
	FullSizeControl,
	HoverEffectControl,
	ImageCropControl,
	ImageShape,
	InfoBox,
	MotionControl,
	OpacityControl,
	PositionControl,
	ResponsiveControl,
	SelectControl,
	SettingTabsControl,
	ToggleSwitch,
	TransformControl,
	TypographyControl,
	ZIndexControl,
	OverflowControl,
} from '../../components';
import {
	getDefaultAttribute,
	getGroupAttributes,
	setHoverAttributes,
} from '../../extensions/styles';
import * as inspectorTabs from '../../components/inspector-tabs';

/**
 * External dependencies
 */
import { capitalize, isEmpty, isNil, isEqual, cloneDeep } from 'lodash';

/**
 * Inspector
 */
const Inspector = memo(
	props => {
		const {
			altOptions,
			attributes,
			clientId,
			deviceType,
			imageData,
			setAttributes,
		} = props;
		const {
			altSelector,
			blockFullWidth,
			blockStyle,
			captionType,
			clipPath,
			cropOptions,
			customLabel,
			extraClassName,
			fullWidth,
			imageRatio,
			imageSize,
			isFirstOnHierarchy,
			isImageUrl,
			mediaAlt,
			mediaID,
			parentBlockStyle,
			SVGElement,
			uniqueID,
		} = attributes;
		const { wpAlt, titleAlt } = altOptions || {};

		const getImageAltOptions = () => {
			const response = [
				{
					label: __('WordPress Alt', 'maxi-blocks'),
					value: 'wordpress',
				},
				{
					label: __('Custom', 'maxi-blocks'),
					value: 'custom',
				},
				{
					label: __('None', 'maxi-blocks'),
					value: 'none',
				},
			];

			if (titleAlt)
				response.unshift({
					label: __('Image Title', 'maxi-blocks'),
					value: 'title',
				});

			return response;
		};

		const getSizeOptions = () => {
			const response = [];
			if (imageData) {
				let { sizes } = imageData.media_details;
				sizes = Object.entries(sizes).sort((a, b) => {
					return a[1].width - b[1].width;
				});
				sizes.forEach(size => {
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

		const getSizeResponse = imageSize => {
			if (cropOptions && imageSize === 'custom') {
				const {
					source_url: mediaURL,
					width: mediaWidth,
					height: mediaHeight,
				} = cropOptions;
				return { mediaURL, mediaWidth, mediaHeight };
			}
			if (imageData && imageSize !== 'custom') {
				const {
					source_url: mediaURL,
					width: mediaWidth,
					height: mediaHeight,
				} = imageData.media_details.sizes[imageSize];

				return { mediaURL, mediaWidth, mediaHeight };
			}
			return { mediaURL: null, mediaWidth: null, mediaHeight: null };
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
													'Dimension',
													'maxi-blocks'
												),
												content: (
													<>
														{!isImageUrl && (
															<SelectControl
																label={__(
																	'Image Size',
																	'maxi-blocks'
																)}
																value={
																	imageSize ||
																	imageSize ===
																		'custom'
																		? imageSize
																		: 'full'
																} // is still necessary?
																options={getSizeOptions()}
																onChange={imageSize => {
																	const {
																		mediaURL,
																		mediaWidth,
																		mediaHeight,
																	} =
																		getSizeResponse(
																			imageSize
																		);
																	setAttributes(
																		{
																			imageSize,
																			mediaURL,
																			mediaWidth,
																			mediaHeight,
																		}
																	);
																}}
															/>
														)}
														{!isImageUrl &&
															imageSize ===
																'custom' && (
																<ImageCropControl
																	mediaID={
																		mediaID
																	}
																	cropOptions={
																		cropOptions
																	}
																	onChange={cropOptions => {
																		setAttributes(
																			{
																				cropOptions,
																				mediaURL:
																					cropOptions
																						.image
																						.source_url,
																				mediaHeight:
																					cropOptions
																						.image
																						.height,
																				mediaWidth:
																					cropOptions
																						.image
																						.width,
																			}
																		);
																	}}
																/>
															)}
														<RangeControl
															className='maxi-image-inspector__dimension-width'
															label={__(
																'Width',
																'maxi-blocks'
															)}
															value={
																attributes.imgWidth
															}
															onChange={val => {
																if (!isNil(val))
																	setAttributes(
																		{
																			imgWidth:
																				val,
																		}
																	);
																else
																	setAttributes(
																		{
																			imgWidth:
																				getDefaultAttribute(
																					'imgWidth',
																					clientId
																				),
																		}
																	);
															}}
															max={100}
															allowReset
															initialPosition={getDefaultAttribute(
																'imgWidth',
																clientId
															)}
														/>
														<SelectControl
															className='maxi-image-inspector__ratio'
															label={__(
																'Image Ratio',
																'maxi-blocks'
															)}
															value={imageRatio}
															options={[
																{
																	label: __(
																		'Original Size',
																		'maxi-blocks'
																	),
																	value: 'original',
																},
																{
																	label: __(
																		'1:1 Aspect Ratio',
																		'maxi-blocks'
																	),
																	value: 'ar11',
																},
																{
																	label: __(
																		'2:3 Aspect Ratio',
																		'maxi-blocks'
																	),
																	value: 'ar23',
																},
																{
																	label: __(
																		'3:2 Aspect Ratio',
																		'maxi-blocks'
																	),
																	value: 'ar32',
																},
																{
																	label: __(
																		'4:3 Aspect Ratio',
																		'maxi-blocks'
																	),
																	value: 'ar43',
																},
																{
																	label: __(
																		'16:9 Aspect Ratio',
																		'maxi-blocks'
																	),
																	value: 'ar169',
																},
															]}
															onChange={imageRatio =>
																setAttributes({
																	imageRatio,
																})
															}
														/>
													</>
												),
											},
											{
												label: __(
													'Alignment',
													'maxi-blocks'
												),
												content: (
													<AlignmentControl
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
												),
											},
											deviceType === 'general' && {
												label: __(
													'Alt tag',
													'maxi-blocks'
												),
												content: (
													<>
														<SelectControl
															className='maxi-image-inspector__alt-tag'
															label={__(
																'Image Alt Tag',
																'maxi-blocks'
															)}
															value={altSelector}
															options={getImageAltOptions()}
															onChange={altSelector =>
																setAttributes({
																	altSelector,
																	...(altSelector ===
																		'wordpress' && {
																		mediaAlt:
																			wpAlt,
																	}),
																	...(altSelector ===
																		'title' && {
																		mediaAlt:
																			titleAlt,
																	}),
																})
															}
														/>
														{altSelector ===
															'custom' && (
															<TextControl
																className='maxi-image-inspector__custom-tag'
																placeholder={__(
																	'Add Your Alt Tag Here',
																	'maxi-blocks'
																)}
																value={
																	mediaAlt ||
																	''
																}
																onChange={mediaAlt =>
																	setAttributes(
																		{
																			mediaAlt,
																		}
																	)
																}
															/>
														)}
													</>
												),
											},
											{
												label: __(
													'Caption',
													'maxi-blocks'
												),
												content: (
													<>
														<SelectControl
															value={captionType}
															className='maxi-image-caption-type'
															options={getCaptionOptions()}
															onChange={captionType => {
																setAttributes({
																	captionType,
																});
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
														{captionType !==
															'none' && (
															<TypographyControl
																{...getGroupAttributes(
																	attributes,
																	[
																		'typography',
																		'textAlignment',
																		'link',
																	]
																)}
																textLevel='p'
																onChange={obj => {
																	if (
																		'content' in
																		obj
																	) {
																		const newCaptionContent =
																			obj.content;

																		delete obj.content;
																		obj.captionContent =
																			newCaptionContent;
																	}

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
																blockStyle={
																	parentBlockStyle
																}
																allowLink
															/>
														)}
													</>
												),
											},
											{
												label: __(
													'Hover effect',
													'maxi-blocks'
												),
												content: (
													<HoverEffectControl
														uniqueID={uniqueID}
														{...getGroupAttributes(
															attributes,
															[
																'hover',
																'hoverBorder',
																'hoverBorderWidth',
																'hoverBorderRadius',
																'hoverBackground',
																'hoverBackgroundColor',
																'hoverBackgroundGradient',
																'hoverMargin',
																'hoverPadding',
																'hoverTitleTypography',
																'hoverContentTypography',
															]
														)}
														onChange={obj =>
															setAttributes(obj)
														}
														blockStyle={blockStyle}
														clientId={clientId}
													/>
												),
											},
											{
												label: __(
													'Shape mask',
													'maxi-blocks'
												),
												content: (
													<ImageShape
														{...getGroupAttributes(
															attributes,
															'imageShape'
														)}
														onChange={obj => {
															setAttributes(obj);
														}}
														icon={SVGElement}
														breakpoint={deviceType}
													/>
												),
											},
											{
												label: __(
													'Clip-path',
													'maxi-blocks'
												),
												content: (
													<ClipPath
														clipPath={clipPath}
														onChange={clipPath =>
															setAttributes({
																clipPath,
															})
														}
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
																			'image-'
																		)}
																		prefix='image-'
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
																					'image-border-status-hover'
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
																										'image-'
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
																										'image-'
																									),
																								}
																							)),
																						'image-border-status-hover':
																							val,
																					}
																				)
																			}
																		/>
																		{attributes[
																			'image-border-status-hover'
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
																					'image-'
																				)}
																				prefix='image-'
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
																			'image-'
																		)}
																		prefix='image-'
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
																					'image-box-shadow-status-hover'
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
																										'image-'
																									),
																								},
																								{
																									...getGroupAttributes(
																										attributes,
																										'boxShadow',
																										true,
																										'image-'
																									),
																								}
																							)),
																						'image-box-shadow-status-hover':
																							val,
																					}
																				)
																			}
																		/>
																		{attributes[
																			'image-box-shadow-status-hover'
																		] && (
																			<BoxShadowControl
																				{...getGroupAttributes(
																					attributes,
																					'boxShadow',
																					true,
																					'image-'
																				)}
																				prefix='image-'
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
																	'Set image to full-width',
																	'maxi-blocks'
																)}
																selected={
																	fullWidth ===
																	'full'
																}
																onChange={val =>
																	setAttributes(
																		{
																			imageRatio:
																				'original',
																			imageSize:
																				'full',
																			imgWidth: 100,
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
																'size',
																false,
																'image-'
															)}
															prefix='image-'
															onChange={obj =>
																setAttributes(
																	obj
																)
															}
															breakpoint={
																deviceType
															}
															hideWith
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
																'padding',
																false,
																'image-'
															)}
															prefix='image-'
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
																'margin',
																false,
																'image-'
															)}
															prefix='image-'
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
										...inspectorTabs.background({
											props,
										}),
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
											label: __(
												'Height / Width',
												'maxi-blocks'
											),
											content: (
												<>
													{isFirstOnHierarchy && (
														<ToggleSwitch
															label={__(
																'Set image to full-width',
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
														hideWith
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
								<>
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
