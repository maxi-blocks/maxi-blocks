/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { InspectorControls } from '@wordpress/block-editor';
import { RangeControl, TextControl } from '@wordpress/components';
import { useState } from '@wordpress/element';

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
	ClipPath,
	CustomLabel,
	DisplayControl,
	EntranceAnimationControl,
	FancyRadioControl,
	FullSizeControl,
	HoverEffectControl,
	ImageCropControl,
	MotionControl,
	OpacityControl,
	PositionControl,
	ResponsiveControl,
	SelectControl,
	SettingTabsControl,
	TransformControl,
	TypographyControl,
	InfoBox,
	ZIndexControl,
	TextareaControl,
} from '../../components';
import {
	getDefaultAttribute,
	getGroupAttributes,
} from '../../extensions/styles';
import MaxiModal from '../../editor/library/modal';

/**
 * External dependencies
 */
import { capitalize, isEmpty, isNil } from 'lodash';

/**
 * Inspector
 */
const Inspector = props => {
	const {
		attributes,
		imageData,
		clientId,
		deviceType,
		setAttributes,
		altOptions,
	} = props;
	const {
		customLabel,
		uniqueID,
		isFirstOnHierarchy,
		blockStyle,
		imageSize,
		cropOptions,
		fullWidth,
		captionType,
		captionContent,
		mediaID,
		extraClassName,
		mediaAlt,
		altSelector,
		clipPath,
		imageRatio,
		isImageUrl,
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

	const [showSize, setShowSize] = useState(isImageUrl);

	// console.log(`showSize ${showSize}`);

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
										<hr />
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
												'Image Dimension',
												'maxi-blocks'
											),
											content: (
												<>
													{showSize && (
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
																setAttributes({
																	imageSize,
																	mediaURL,
																	mediaWidth,
																	mediaHeight,
																});
															}}
														/>
													)}
													{showSize &&
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
														label={__(
															'Width',
															'maxi-blocks'
														)}
														value={
															attributes.imgWidth
														}
														onChange={val => {
															if (!isNil(val))
																setAttributes({
																	imgWidth:
																		val,
																});
															else
																setAttributes({
																	imgWidth:
																		getDefaultAttribute(
																			'imgWidth',
																			clientId
																		),
																});
														}}
														max={100}
														allowReset
														initialPosition={getDefaultAttribute(
															'imgWidth',
															clientId
														)}
													/>
													<SelectControl
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
										deviceType === 'general' && {
											label: __(
												'Image Alt Tag',
												'maxi-blocks'
											),
											content: (
												<>
													<SelectControl
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
															placeholder={__(
																'Add Your Alt Tag Here',
																'maxi-blocks'
															)}
															value={
																mediaAlt || ''
															}
															onChange={mediaAlt =>
																setAttributes({
																	mediaAlt,
																})
															}
														/>
													)}
												</>
											),
										},
										deviceType === 'general' && {
											label: __('Caption', 'maxi-blocks'),
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
																setAttributes({
																	captionContent:
																		imageData
																			.caption
																			.raw,
																});
														}}
													/>
													{captionType ===
														'custom' && (
														<TextareaControl
															className='custom-caption'
															placeholder={__(
																'Add you Custom Caption here',
																'maxi-blocks'
															)}
															value={
																captionContent ||
																''
															}
															onChange={captionContent =>
																setAttributes({
																	captionContent,
																})
															}
														/>
													)}
													{captionType !== 'none' && (
														<TypographyControl
															{...getGroupAttributes(
																attributes,
																[
																	'typography',
																	'textAlignment',
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
															clientId={clientId}
															disableCustomFormats
															blockStyle={
																blockStyle
															}
														/>
													)}
												</>
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
																						!!+val,
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
												'Padding & Margin',
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
												'Clip-Path',
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
											label: __('Shape', 'maxi-blocks'),
											content: (
												<MaxiModal type='image-shape' />
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
												'Hover Effects',
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
};

export default Inspector;
