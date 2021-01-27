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
	BlockStylesControl,
	SettingTabsControl,
	TypographyControl,
	ClipPath,
	HoverEffectControl,
	ImageAltControl,
	FancyRadioControl,
	SVGDefaultsDisplayer,
	CustomLabel,
} from '../../components';
import { injectImgSVG } from '../../extensions/svg/utils';

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
import ImageCropControl from '../../components/image-crop-control/newImageCropControl';

import getGroupAttributes from '../../extensions/styles/getGroupAttributes';
import getDefaultAttribute from '../../extensions/styles/getDefaultAttribute';

/**
 * External dependencies
 */
import { capitalize, isEmpty, isNil, isObject, isNumber } from 'lodash';

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
	} = props;
	const {
		customLabel,
		uniqueID,
		isFirstOnHierarchy,
		blockStyle,
		defaultBlockStyle,
		blockStyleBackground,
		imageSize,
		cropOptions,
		fullWidth,
		captionType,
		captionContent,
		captionTypography,
		mediaID,
		mediaURL,
		extraClassName,
		mediaAlt,
		altSelector,
		clipPath,
		SVGData,
		SVGCurrentElement,
	} = attributes;

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
										// border={border}
									/>
								</div>
								<AccordionControl
									isSecondary
									items={[
										// {
										// 	label: __(
										// 		'Alignment',
										// 		'maxi-blocks'
										// 	),
										// 	content: (
										// 		<AlignmentControl
										// 			alignment={alignment}
										// 			onChange={alignment =>
										// 				setAttributes({
										// 					alignment,
										// 				})
										// 			}
										// 			disableJustify
										// 			breakpoint={deviceType}
										// 		/>
										// 	),
										// },
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
															attributes[
																'width-general'
															]
														}
														onChange={val => {
															if (!isNil(val))
																setAttributes({
																	'width-general': val,
																});
															else
																setAttributes({
																	'width-general': getDefaultAttribute(
																		'width-general',
																		clientId
																	),
																});
														}}
														max={
															imageData &&
															imageData
																.media_details
																.width
														}
														allowReset
														initialPosition={getDefaultAttribute(
															'width-general',
															clientId
														)}
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
													{/* {captionType !== 'none' && (
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
													)} */}
												</Fragment>
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
																					'background-status-hover': !!val,
																				}
																			)
																		}
																	/>
																	{!!attributes[
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
																			disableImage
																			disableVideo
																			disableSVG
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
																					'border-status-hover': !!val,
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
														onChange={obj =>
															setAttributes(obj)
														}
														breakpoint={deviceType}
														hideWith
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
																					'box-shadow-status-hover': !!val,
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
												'Padding & Margin',
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
										// {
										// 	label: __(
										// 		'Clip-Path',
										// 		'maxi-blocks'
										// 	),
										// 	content: (
										// 		<ClipPath
										// 			clipPath={clipPath}
										// 			onChange={clipPath =>
										// 				setAttributes({
										// 					clipPath,
										// 				})
										// 			}
										// 		/>
										// 	),
										// },
										// {
										// 	label: __('Shape', 'maxi-blocks'),
										// 	content: (
										// 		<SVGDefaultsDisplayer
										// 			SVGOptions={SVGData}
										// 			SVGCurrentElement={
										// 				SVGCurrentElement
										// 			}
										// 			onChange={SVGOptions => {
										// 				const SVGValue = !isObject(
										// 					SVGOptions.SVGData
										// 				)
										// 					? SVGOptions.SVGData
										// 					: SVGOptions.SVGData;

										// 				const el = Object.keys(
										// 					SVGValue
										// 				)[0];

										// 				SVGValue[
										// 					el
										// 				].imageID = mediaID;
										// 				SVGValue[
										// 					el
										// 				].imageURL = mediaURL;

										// 				setAttributes({
										// 					...SVGOptions,
										// 					SVGCurrentElement:
										// 						SVGOptions.SVGCurrentElement,
										// 					SVGElement: injectImgSVG(
										// 						SVGOptions.SVGElement,
										// 						SVGValue
										// 					).outerHTML,
										// 				});
										// 			}}
										// 		/>
										// 	),
										// },
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
										// {
										// 	label: __(
										// 		'Hover Effects',
										// 		'maxi-blocks'
										// 	),
										// 	content: (
										// 		<HoverEffectControl
										// 			hover={hover}
										// 			defaultHover={getDefaultProp(
										// 				clientId,
										// 				'hover'
										// 			)}
										// 			onChange={hover =>
										// 				setAttributes({ hover })
										// 			}
										// 			uniqueID={uniqueID}
										// 		/>
										// 	),
										// },
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
