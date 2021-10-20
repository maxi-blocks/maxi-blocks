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
	ClipPath,
	HoverEffectControl,
	ImageCropControl,
	ImageShape,
	SelectControl,
	SettingTabsControl,
	TypographyControl,
} from '../../components';
import {
	getDefaultAttribute,
	getGroupAttributes,
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
			blockStyle,
			captionType,
			clipPath,
			cropOptions,
			imageRatio,
			imageSize,
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
				{inspectorTabs.infoBox({ props })}
				<SettingTabsControl
					disablePadding
					deviceType={deviceType}
					items={[
						{
							label: __('Settings', 'maxi-blocks'),
							content: (
								<>
									{inspectorTabs.blockSettings({
										props,
									})}
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
											...inspectorTabs.alignment({
												props,
												isAlignment: true,
												disableJustify: true,
											}),
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
											...inspectorTabs.border({
												props,
												prefix: 'image-',
											}),
											...inspectorTabs.boxShadow({
												props,
												prefix: 'image-',
											}),
											...inspectorTabs.size({
												props,
												prefix: 'image-',
												isImage: true,
												hideWith: true,
											}),
											...inspectorTabs.marginPadding({
												props,
												prefix: 'image-',
											}),
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
										...inspectorTabs.border({
											props,
										}),
										...inspectorTabs.boxShadow({
											props,
										}),
										...inspectorTabs.opacity({
											props,
										}),
										...inspectorTabs.size({
											props,
											block: true,
										}),
										...inspectorTabs.marginPadding({
											props,
										}),
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
												...inspectorTabs.customClasses({
													props,
												}),
											},
											...inspectorTabs.motion({
												props,
											}),
											...inspectorTabs.transform({
												props,
											}),
											...inspectorTabs.display({
												props,
											}),
											...inspectorTabs.position({
												props,
											}),
											deviceType !== 'general' && {
												...inspectorTabs.responsive({
													props,
												}),
											},
											...inspectorTabs.overflow({
												props,
											}),
											...inspectorTabs.zindex({
												props,
											}),
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
