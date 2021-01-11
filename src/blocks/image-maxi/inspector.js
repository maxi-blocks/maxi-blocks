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
	ZIndexControl,
	AxisControl,
	ResponsiveControl,
	OpacityControl,
	PositionControl,
	DisplayControl,
	MotionControl,
	TransformControl,
	ClipPath,
	EntranceAnimationControl,
	HoverEffectControl,
	ImageAltControl,
	FancyRadioControl,
	SVGDefaultsDisplayer,
	CustomLabel,
} from '../../components';
import { injectImgSVG } from '../../extensions/svg/utils';

/**
 * External dependencies
 */
import { capitalize, isEmpty, isNil, isObject, isNumber } from 'lodash';
/**
 * Inspector
 */
const Inspector = props => {
	const {
		attributes: {
			customLabel,
			uniqueID,
			isFirstOnHierarchy,
			blockStyle,
			defaultBlockStyle,
			blockStyleBackground,
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
			padding,
			margin,
			backgroundHover,
			boxShadowHover,
			borderHover,
			mediaID,
			mediaURL,
			extraClassName,
			zIndex,
			mediaAlt,
			altSelector,
			breakpoints,
			position,
			display,
			motion,
			transform,
			clipPath,
			hover,
			SVGData,
			SVGCurrentElement,
		},
		imageData,
		clientId,
		deviceType,
		setAttributes,
	} = props;

	const size = { ...props.attributes.size };
	const defaultSize = getDefaultProp(clientId, 'size');

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

	const getSizeResponse = size => {
		if (size === 'custom') {
			const {
				source_url: mediaURL,
				width: mediaWidth,
				height: mediaHeight,
			} = cropOptions;

			return { mediaURL, mediaWidth, mediaHeight };
		}

		const {
			source_url: mediaURL,
			width: mediaWidth,
			height: mediaHeight,
		} = imageData.media_details.sizes[size];

		return { mediaURL, mediaWidth, mediaHeight };
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
											setAttributes({ customLabel })
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
										disableHighlightText
										disableHighlightBackground
										disableHighlightBorder
										disableHighlightColor1
										disableHighlightColor2
										border={border}
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
										deviceType === 'general' && {
											label: __(
												'Image Dimension',
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
															} = getSizeResponse(
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
													{imageSize === 'custom' && (
														<ImageCropControl
															mediaID={mediaID}
															cropOptions={
																cropOptions
															}
															onChange={cropOptions => {
																setAttributes({
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
																});
															}}
														/>
													)}
													<RangeControl
														label={__(
															'Width',
															'maxi-blocks'
														)}
														value={
															!isNumber(
																size.general
																	.width
															)
																? imageData &&
																  imageData
																		.media_details
																		.width
																: size.general
																		.width
														}
														onChange={val => {
															if (isNil(val))
																size.general.width =
																	defaultSize.general.width;
															else
																size.general.width = val;

															setAttributes({
																size,
															});
														}}
														max={
															imageData &&
															imageData
																.media_details
																.width
														}
														allowReset
														initialPosition={
															defaultSize.general
																.width
														}
													/>
												</Fragment>
											),
										},
										deviceType === 'general' && {
											label: __(
												'Image Alt Tag',
												'maxi-blocks'
											),
											content: (
												<ImageAltControl
													mediaAlt={mediaAlt}
													altSelector={altSelector}
													onChangeAltSelector={altSelector => {
														setAttributes({
															altSelector,
														});
													}}
													onChangeMediaAlt={mediaAlt =>
														setAttributes({
															mediaAlt,
														})
													}
												/>
											),
										},
										deviceType === 'general' && {
											label: __('Caption', 'maxi-blocks'),
											content: (
												<Fragment>
													<SelectControl
														value={captionType}
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
															placeHolder={__(
																'Add you Custom Caption here',
																'maxi-blocks'
															)}
															value={
																captionContent
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
															typography={
																captionTypography
															}
															defaultTypography={getDefaultProp(
																clientId,
																'captionTypography'
															)}
															onChange={obj =>
																setAttributes({
																	captionTypography:
																		obj.typography,
																})
															}
															breakpoint={
																deviceType
															}
														/>
													)}
												</Fragment>
											),
										},
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
																'maxi-blocks'
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
																		disableGradient
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
																			backgroundHover.status
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
																			backgroundHover.status = Number(
																				val
																			);
																			setAttributes(
																				{
																					backgroundHover,
																				}
																			);
																		}}
																	/>
																	{!!backgroundHover.status && (
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
																'maxi-blocks'
															),
															content: (
																<Fragment>
																	<FancyRadioControl
																		label={__(
																			'Enable Border Hover',
																			'maxi-blocks'
																		)}
																		selected={Number(
																			borderHover.status
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
																			borderHover.status = Number(
																				val
																			);
																			setAttributes(
																				{
																					borderHover,
																				}
																			);
																		}}
																	/>
																	{!!borderHover.status && (
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
																'maxi-blocks'
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
																'maxi-blocks'
															),
															content: (
																<Fragment>
																	<FancyRadioControl
																		label={__(
																			'Enable Box Shadow Hover',
																			'maxi-blocks'
																		)}
																		selected={Number(
																			boxShadowHover.status
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
																			boxShadowHover.status = Number(
																				val
																			);
																			setAttributes(
																				{
																					boxShadowHover,
																				}
																			);
																		}}
																	/>
																	{!!boxShadowHover.status && (
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
												<SVGDefaultsDisplayer
													SVGOptions={SVGData}
													SVGCurrentElement={
														SVGCurrentElement
													}
													onChange={SVGOptions => {
														const SVGValue = !isObject(
															SVGOptions.SVGData
														)
															? SVGOptions.SVGData
															: SVGOptions.SVGData;

														const el = Object.keys(
															SVGValue
														)[0];

														SVGValue[
															el
														].imageID = mediaID;
														SVGValue[
															el
														].imageURL = mediaURL;

														setAttributes({
															...SVGOptions,
															SVGCurrentElement:
																SVGOptions.SVGCurrentElement,
															SVGElement: injectImgSVG(
																SVGOptions.SVGElement,
																SVGValue
															).outerHTML,
														});
													}}
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
												'Hover Effects',
												'maxi-blocks'
											),
											content: (
												<HoverEffectControl
													hover={hover}
													defaultHover={getDefaultProp(
														clientId,
														'hover'
													)}
													onChange={hover =>
														setAttributes({ hover })
													}
													uniqueID={uniqueID}
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
