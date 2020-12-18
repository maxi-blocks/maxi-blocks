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
	TransformControl,
	ClipPath,
	HoverEffectControl,
	ImageAltControl,
	FancyRadioControl,
	CustomLabel,
} from '../../components';

/**
 * External dependencies
 */
import { capitalize, isEmpty, isNil } from 'lodash';

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
		},
		imageData,
		clientId,
		deviceType,
		setAttributes,
	} = props;

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
									/>
									<ImageAltControl
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
										deviceType === 'general' && {
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
															imageSize ===
																'custom'
																? imageSize
																: 'full'
														} // is still necessary?
														options={getSizeOptions()}
														onChange={imageSize =>
															setAttributes({
																imageSize,
															})
														}
													/>
													{imageSize === 'custom' && (
														<ImageCropControl
															mediaID={mediaID}
															cropOptions={
																cropOptions
															}
															onChange={cropOptions =>
																setAttributes({
																	cropOptions,
																})
															}
														/>
													)}
													<RangeControl
														label={__(
															'Width',
															'maxi-blocks'
														)}
														value={
															size.general.width
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
															onChange={captionTypography =>
																setAttributes({
																	captionTypography,
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
																	<OpacityControl
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
																'maxi-blocks'
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
																			'Enable Border Hover',
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
									<ZIndexControl
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
									{deviceType !== 'general' && (
										<ResponsiveControl
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
									<PositionControl
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
									<DisplayControl
										display={display}
										onChange={display =>
											setAttributes({ display })
										}
										breakpoint={deviceType}
										defaultDisplay='flex'
									/>
									<ClipPath
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
												<HoverEffectControl
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
