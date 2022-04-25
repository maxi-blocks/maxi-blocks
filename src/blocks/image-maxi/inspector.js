/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { InspectorControls } from '@wordpress/block-editor';
import { RangeControl } from '@wordpress/components';
import { memo } from '@wordpress/element';

/**
 * Internal dependencies
 */
import {
	AccordionControl,
	AdvancedNumberControl,
	ClipPath,
	HoverEffectControl,
	ImageAltControl,
	ImageCropControl,
	ImageShape,
	SelectControl,
	SettingTabsControl,
	ToggleSwitch,
	TypographyControl,
} from '../../components';
import {
	getDefaultAttribute,
	getGroupAttributes,
	getLastBreakpointAttribute,
} from '../../extensions/styles';
import * as inspectorTabs from '../../components/inspector-tabs';
import { selectorsImage, categoriesImage } from './custom-css';

/**
 * External dependencies
 */
import { capitalize, isEmpty, isNil, isEqual, cloneDeep } from 'lodash';

/**
 * Dimension tab
 */
const dimensionTab = props => {
	const { attributes, clientId, imageData, maxiSetAttributes } = props;
	const {
		cropOptions,
		imageRatio,
		imageSize,
		isImageUrl,
		mediaID,
		SVGElement,
		useInitSize,
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

	return {
		label: __('Dimension', 'maxi-blocks'),
		content: (
			<>
				{(!isImageUrl || !SVGElement) && getSizeOptions().length > 1 && (
					<>
						<SelectControl
							label={__('Image Size', 'maxi-blocks')}
							value={
								imageSize || imageSize === 'custom'
									? imageSize
									: 'full'
							} // is still necessary?
							options={getSizeOptions()}
							onChange={imageSize => {
								const { mediaURL, mediaWidth, mediaHeight } =
									getSizeResponse(imageSize);
								maxiSetAttributes({
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
								cropOptions={cropOptions}
								onChange={cropOptions => {
									maxiSetAttributes({
										cropOptions,
										mediaURL: cropOptions.image.source_url,
										mediaHeight: cropOptions.image.height,
										mediaWidth: cropOptions.image.width,
									});
								}}
							/>
						)}
					</>
				)}
				<ToggleSwitch
					label={__('Use original size', 'maxi-blocks')}
					className='maxi-image-inspector__initial-size'
					selected={useInitSize}
					onChange={val =>
						maxiSetAttributes({
							useInitSize: val,
						})
					}
				/>
				{!useInitSize && (
					<RangeControl
						className='maxi-image-inspector__dimension-width'
						label={__('Width', 'maxi-blocks')}
						value={attributes.imgWidth}
						onChange={val => {
							if (!isNil(val))
								maxiSetAttributes({
									imgWidth: val,
								});
							else
								maxiSetAttributes({
									imgWidth: getDefaultAttribute(
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
				)}
				<SelectControl
					className='maxi-image-inspector__ratio'
					label={__('Image Ratio', 'maxi-blocks')}
					value={imageRatio}
					options={[
						{
							label: __('Original Size', 'maxi-blocks'),
							value: 'original',
						},
						{
							label: __('1:1 Aspect Ratio', 'maxi-blocks'),
							value: 'ar11',
						},
						{
							label: __('2:3 Aspect Ratio', 'maxi-blocks'),
							value: 'ar23',
						},
						{
							label: __('3:2 Aspect Ratio', 'maxi-blocks'),
							value: 'ar32',
						},
						{
							label: __('4:3 Aspect Ratio', 'maxi-blocks'),
							value: 'ar43',
						},
						{
							label: __('16:9 Aspect Ratio', 'maxi-blocks'),
							value: 'ar169',
						},
					]}
					onChange={imageRatio =>
						maxiSetAttributes({
							imageRatio,
						})
					}
				/>
			</>
		),
		extraIndicators: ['imageRatio', 'imgWidth'],
	};
};

/**
 * Inspector
 */
const Inspector = memo(
	props => {
		const {
			attributes,
			clientId,
			deviceType,
			imageData,
			maxiSetAttributes,
		} = props;
		const {
			altSelector,
			blockStyle,
			captionType,
			fullWidth,
			mediaAlt,
			SVGElement,
			uniqueID,
			mediaID,
			captionPosition,
		} = attributes;

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

		return (
			<InspectorControls>
				{inspectorTabs.responsiveInfoBox({ props })}
				<SettingTabsControl
					target='sidebar-settings-tabs'
					disablePadding
					deviceType={deviceType}
					depth={0}
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
											deviceType === 'general' &&
												fullWidth !== 'full' &&
												dimensionTab(props),
											...inspectorTabs.alignment({
												props,
												isAlignment: true,
												disableJustify: true,
											}),
											deviceType === 'general' &&
												!SVGElement && {
													label: __(
														'Alt tag',
														'maxi-blocks'
													),
													content: (
														<ImageAltControl
															mediaID={mediaID}
															altSelector={
																altSelector
															}
															mediaAlt={mediaAlt}
															onChange={obj => {
																maxiSetAttributes(
																	obj
																);
															}}
														/>
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
																maxiSetAttributes(
																	{
																		captionType,
																	}
																);
																if (
																	imageData &&
																	captionType ===
																		'attachment'
																)
																	maxiSetAttributes(
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
															<>
																<SelectControl
																	label={__(
																		'Caption position',
																		'maxi-blocks'
																	)}
																	className='maxi-image-inspector__caption-position'
																	value={
																		captionPosition
																	}
																	options={[
																		{
																			label: __(
																				'Top',
																				'maxi-blocks'
																			),
																			value: 'top',
																		},
																		{
																			label: __(
																				'Bottom',
																				'maxi-blocks'
																			),
																			value: 'bottom',
																		},
																	]}
																	onChange={captionPosition =>
																		maxiSetAttributes(
																			{
																				captionPosition,
																			}
																		)
																	}
																/>
																<AdvancedNumberControl
																	label={__(
																		'Caption gap',
																		'maxi-blocks'
																	)}
																	className='maxi-image-inspector__caption-gap'
																	placeholder={getLastBreakpointAttribute(
																		{
																			target: 'caption-gap',
																			breakpoint:
																				deviceType,
																			attributes,
																		}
																	)}
																	value={
																		attributes[
																			`caption-gap-${deviceType}`
																		]
																	}
																	onChangeValue={val =>
																		maxiSetAttributes(
																			{
																				[`caption-gap-${deviceType}`]:
																					val,
																			}
																		)
																	}
																	enableUnit
																	unit={getLastBreakpointAttribute(
																		{
																			target: 'caption-gap-unit',
																			breakpoint:
																				deviceType,
																			attributes,
																		}
																	)}
																	minMaxSettings={{
																		px: {
																			min: 0,
																			max: 999,
																		},
																		em: {
																			min: 0,
																			max: 99,
																		},
																	}}
																	onChangeUnit={val =>
																		maxiSetAttributes(
																			{
																				[`caption-gap-unit-${deviceType}`]:
																					val,
																			}
																		)
																	}
																	onReset={() =>
																		maxiSetAttributes(
																			{
																				[`caption-gap-${deviceType}`]:
																					getDefaultAttribute(
																						`caption-gap-${deviceType}`
																					),
																				[`caption-gap-unit-${deviceType}`]:
																					getDefaultAttribute(
																						`caption-gap-unit-${deviceType}`
																					),
																			}
																		)
																	}
																/>
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

																		maxiSetAttributes(
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
																		blockStyle
																	}
																	globalProps={{
																		target: '',
																		type: 'p',
																	}}
																	hoverGlobalProps={{
																		target: 'hover',
																		type: 'p',
																	}}
																	styleCardPrefix=''
																	allowLink
																/>
															</>
														)}
													</>
												),
												extraIndicators: [
													'captionType',
												],
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
															maxiSetAttributes(
																obj
															)
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
															maxiSetAttributes(
																obj
															);
														}}
														icon={SVGElement}
														breakpoint={deviceType}
													/>
												),
												extraIndicators: ['SVGElement'],
												ignoreIndicator: [
													`image-shape-scale-${deviceType}`,
													`image-shape-rotate-${deviceType}`,
													`image-shape-flip-x-${deviceType}`,
													`image-shape-flip-y-${deviceType}`,
												],
											},
											{
												label: __(
													'Clip-path',
													'maxi-blocks'
												),
												content: (
													<ClipPath
														onChange={obj => {
															maxiSetAttributes(
																obj
															);
														}}
														{...getGroupAttributes(
															attributes,
															'clipPath',
															false,
															''
														)}
														breakpoint={deviceType}
														prefix=''
													/>
												),
												ignoreIndicator: [
													`clip-path-${deviceType}`,
												],
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
												hideWidth: true,
											}),
											...inspectorTabs.marginPadding({
												props,
												prefix: 'image-',
												customLabel: __(
													'Padding',
													'maxi-blocks'
												),
												disableMargin: true,
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
										...inspectorTabs.blockBackground({
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
											deviceType === 'general' && {
												...inspectorTabs.anchor({
													props,
												}),
											},
											...inspectorTabs.customCss({
												props,
												breakpoint: deviceType,
												selectors: selectorsImage,
												categories: categoriesImage,
											}),
											...inspectorTabs.scrollEffects({
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
											...inspectorTabs.flex({
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
