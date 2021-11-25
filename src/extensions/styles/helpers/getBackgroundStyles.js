/**
 * Internal dependencies
 */
import getAttributeValue from '../getAttributeValue';
import getColorRGBAString from '../getColorRGBAString';
import getDisplayStyles from './getDisplayStyles';
import getGroupAttributes from '../getGroupAttributes';
import getImageShapeStyles from './getImageShapeStyles';
import getLastBreakpointAttribute from '../getLastBreakpointAttribute';

/**
 * External dependencies
 */
import { isEmpty, isNil, isNumber, merge, compact } from 'lodash';

const BREAKPOINTS = ['general', 'xxl', 'xl', 'l', 'm', 's', 'xs'];

/**
 * Clean BackgroundControl object for being delivered for styling
 *
 * @param {Object} background BackgroundControl related object
 */
export const getColorBackgroundObject = ({
	isHover = false,
	prefix = '',
	blockStyle: rawBlockStyle,
	isButton = false,
	isIcon = false,
	isIconInherit = false,
	breakpoint = 'general',
	...props
}) => {
	const blockStyle = rawBlockStyle.replace('maxi-', '');

	const response = {
		label: 'Background Color',
		[breakpoint]: {},
	};

	const bgPaletteStatus = getLastBreakpointAttribute(
		`${prefix}background-palette-color-status`,
		breakpoint,
		props,
		isHover
	);
	const currentBgPaletteColor = getLastBreakpointAttribute(
		`${prefix}background-palette-color`,
		breakpoint,
		props,
		isHover
	);
	const currentBgPaletteOpacity = getLastBreakpointAttribute(
		`${prefix}background-palette-opacity`,
		breakpoint,
		props,
		isHover
	);
	const bgColor = getLastBreakpointAttribute(
		`${prefix}background-color`,
		breakpoint,
		props,
		isHover
	);
	const bgClipPath = getLastBreakpointAttribute(
		`${prefix}background-color-clip-path`,
		breakpoint,
		props,
		isHover
	);

	if (!bgPaletteStatus && !isEmpty(bgColor)) {
		response[breakpoint]['background-color'] = bgColor;
	} else if (
		bgPaletteStatus &&
		(currentBgPaletteColor || currentBgPaletteOpacity)
	) {
		const bgPaletteColor =
			currentBgPaletteColor ||
			getLastBreakpointAttribute(
				`${prefix}background-palette-color`,
				breakpoint,
				props,
				isHover
			);
		const bgPaletteOpacity =
			currentBgPaletteOpacity ||
			getLastBreakpointAttribute(
				`${prefix}background-palette-opacity`,
				breakpoint,
				props,
				isHover
			);

		if (isButton) {
			response[breakpoint].background = getColorRGBAString({
				firstVar: `color${isHover ? '-hover' : ''}`,
				secondVar: `color-${bgPaletteColor}`,
				opacity: bgPaletteOpacity,
				blockStyle,
			});
		} else
			response[breakpoint]['background-color'] = getColorRGBAString({
				firstVar: `color-${bgPaletteColor}`,
				opacity: bgPaletteOpacity,
				blockStyle,
			});
	}

	if (isIconInherit) {
		response[breakpoint]['background-color'] =
			props['background-active-media'] !== '' && bgPaletteStatus
				? getColorRGBAString({
						firstVar: `button-background-color${
							isHover ? '-hover' : ''
						}`,
						secondVar: `color-${currentBgPaletteColor}`,
						opacity: currentBgPaletteOpacity,
						blockStyle,
				  })
				: bgColor;
	}

	if (!isIconInherit && isIcon) {
		response[breakpoint].background = getColorRGBAString({
			firstVar: `color-${currentBgPaletteColor}`,
			opacity: currentBgPaletteOpacity,
			blockStyle,
		});
	}

	if (!isNil(bgClipPath))
		response[breakpoint]['clip-path'] = isEmpty(bgClipPath)
			? 'none'
			: bgClipPath;

	return response;
};

export const getGradientBackgroundObject = ({
	isHover = false,
	prefix = '',
	breakpoint = 'general',
	isIcon = false,
	...props
}) => {
	const response = {
		label: 'Background gradient',
		[breakpoint]: {},
	};

	const bgGradientOpacity = getAttributeValue({
		target: 'background-gradient-opacity',
		props,
		prefix,
		isHover,
		breakpoint,
	});
	const bgGradient = getLastBreakpointAttribute(
		`${prefix}background-gradient`,
		breakpoint,
		props,
		isHover
	);
	const bgGradientClipPath = getAttributeValue({
		target: 'background-gradient-clip-path',
		props,
		prefix,
		isHover,
		breakpoint,
	});

	if (
		isIcon &&
		getLastBreakpointAttribute(
			`${prefix}background-active-media`,
			breakpoint,
			props,
			isHover
		) === 'gradient'
	) {
		if (isNumber(bgGradientOpacity))
			response[breakpoint].opacity = bgGradientOpacity;
		if (!isEmpty(bgGradient)) response[breakpoint].background = bgGradient;
	} else if (!isIcon) {
		if (isNumber(bgGradientOpacity))
			response[breakpoint].opacity = bgGradientOpacity;
		if (!isEmpty(bgGradient)) response[breakpoint].background = bgGradient;
		if (!isNil(bgGradientClipPath))
			response[breakpoint]['clip-path'] = isEmpty(bgGradientClipPath)
				? 'none'
				: bgGradientClipPath;
	}

	return response;
};

export const getImageBackgroundObject = ({
	isHover = false,
	prefix = '',
	breakpoint,
	isParallax = false,
	...props
}) => {
	const response = {
		label: 'Background Image',
		[breakpoint]: {},
	};

	const bgImageUrl = getAttributeValue({
		target: 'background-image-mediaURL',
		props,
		prefix,
	});

	if (isEmpty(bgImageUrl)) return {};

	const getBgImageAttributeValue = target =>
		getAttributeValue({
			target,
			props,
			prefix,
			isHover,
			breakpoint,
		});
	const getBgImageLastBreakpointAttribute = target =>
		getLastBreakpointAttribute(prefix + target, breakpoint, props, isHover);

	const bgImageSize = getLastBreakpointAttribute(
		`${prefix}background-image-size`,
		breakpoint,
		props,
		isHover
	);
	const bgImageCropOptions = getBgImageAttributeValue(
		'background-image-crop-options'
	);
	const bgImageRepeat = getBgImageAttributeValue('background-image-repeat');
	const bgImagePosition = getLastBreakpointAttribute(
		`${prefix}background-image-position`,
		breakpoint,
		props,
		isHover
	);
	const bgImageOrigin = getBgImageAttributeValue('background-image-origin');
	const bgImageClip = getBgImageAttributeValue('background-image-clip');
	const bgImageAttachment = getBgImageAttributeValue(
		'background-image-attachment'
	);
	const bgImageOpacity = getBgImageAttributeValue('background-image-opacity');
	const bgImageClipPath = getBgImageAttributeValue(
		'background-image-clip-path'
	);

	if (!isParallax) {
		// Image
		if (breakpoint === 'general') {
			if (bgImageSize === 'custom' && !isNil(bgImageCropOptions)) {
				response[breakpoint][
					'background-image'
				] = `url('${bgImageCropOptions.image.source_url}')`;
			} else if (
				(bgImageSize === 'custom' && isNil(bgImageCropOptions)) ||
				(bgImageSize !== 'custom' && !isNil(bgImageUrl))
			) {
				response[breakpoint][
					'background-image'
				] = `url('${bgImageUrl}')`;
			}
		}

		// Size
		if (bgImageSize !== 'custom') {
			if (!isNil(response[breakpoint]['background-size']))
				response[breakpoint][
					'background-size'
				] = `${response[breakpoint]['background-size']},${bgImageSize}`;
			else response[breakpoint]['background-size'] = bgImageSize;
		} else if (!isNil(response[breakpoint]['background-size']))
			response[breakpoint][
				'background-size'
			] = `${response[breakpoint]['background-size']},cover`;
		else response[breakpoint]['background-size'] = 'cover';

		// Repeat
		if (bgImageRepeat)
			response[breakpoint]['background-repeat'] = bgImageRepeat;

		// Position
		if (bgImagePosition !== 'custom')
			response[breakpoint]['background-position'] = bgImagePosition;
		else {
			const bgImagePositionWidth = getBgImageLastBreakpointAttribute(
				'background-image-position-width'
			);
			const bgImagePositionWidthUnit = getBgImageLastBreakpointAttribute(
				'background-image-position-width-unit'
			);
			const bgImagePositionHeight = getBgImageLastBreakpointAttribute(
				'background-image-position-height'
			);
			const bgImagePositionHeightUnit = getBgImageLastBreakpointAttribute(
				'background-image-position-height-unit'
			);
			response[breakpoint][
				'background-position'
			] = `${bgImagePositionWidth}${bgImagePositionWidthUnit} ${bgImagePositionHeight}${bgImagePositionHeightUnit}`;
		}

		// Origin
		if (bgImageOrigin)
			response[breakpoint]['background-origin'] = bgImageOrigin;

		// Clip
		if (bgImageClip) response[breakpoint]['background-clip'] = bgImageClip;

		// Attachment
		if (bgImageAttachment) {
			if (!isNil(response[breakpoint]['background-attachment']))
				response[breakpoint][
					'background-attachment'
				] = `${response[breakpoint]['background-attachment']},${bgImageAttachment}`;
			else
				response[breakpoint]['background-attachment'] =
					bgImageAttachment;
		}
	} else {
		if (bgImageSize !== 'custom')
			response[breakpoint]['object-fit'] = bgImageSize;
		else response[breakpoint]['object-fit'] = 'cover';

		// Position
		if (bgImagePosition !== 'custom')
			response[breakpoint]['object-position'] = bgImagePosition;
		else {
			const bgImagePositionWidth = getBgImageLastBreakpointAttribute(
				'background-image-position-width'
			);
			const bgImagePositionWidthUnit = getBgImageLastBreakpointAttribute(
				'background-image-position-width-unit'
			);
			const bgImagePositionHeight = getBgImageLastBreakpointAttribute(
				'background-image-position-height'
			);
			const bgImagePositionHeightUnit = getBgImageLastBreakpointAttribute(
				'background-image-position-height-unit'
			);
			response[breakpoint][
				'object-position'
			] = `${bgImagePositionWidth}${bgImagePositionWidthUnit} ${bgImagePositionHeight}${bgImagePositionHeightUnit}`;
		}
	}

	// Opacity
	if (isNumber(bgImageOpacity)) response[breakpoint].opacity = bgImageOpacity;

	// Clip-path
	if (!isNil(bgImageClipPath))
		response[breakpoint]['clip-path'] = isEmpty(bgImageClipPath)
			? 'none'
			: bgImageClipPath;

	return response;
};

export const getVideoBackgroundObject = ({
	isHover = false,
	prefix = '',
	breakpoint,
	...props
}) => {
	const response = {
		label: 'Video Background',
		[breakpoint]: {},
	};

	const bgVideoOpacity = getLastBreakpointAttribute(
		`${prefix}background-video-opacity`,
		breakpoint,
		props,
		isHover
	);
	const bgVideoClipPath = getLastBreakpointAttribute(
		`${prefix}background-video-clip-path`,
		breakpoint,
		props,
		isHover
	);
	const bgVideoFallbackUrl = getLastBreakpointAttribute(
		`${prefix}background-video-fallbackURL`,
		breakpoint,
		props,
		isHover
	);

	// Opacity
	if (isNumber(bgVideoOpacity)) response[breakpoint].opacity = bgVideoOpacity;

	// Clip-path
	if (!isNil(bgVideoClipPath))
		response[breakpoint]['clip-path'] = isEmpty(bgVideoClipPath)
			? 'none'
			: bgVideoClipPath;

	// Fallback URL
	if (!isEmpty(bgVideoFallbackUrl)) {
		response[breakpoint].background = `url(${bgVideoFallbackUrl})`;
		response[breakpoint]['background-size'] = 'cover';
	}

	return response;
};

const getSVGWrapperBackgroundObject = ({
	breakpoint,
	isHover = false,
	...props
}) => {
	const response = {
		label: 'SVG Wrapper Background',
		[breakpoint]: {},
	};

	const bgSVGSize = getLastBreakpointAttribute(
		'background-svg-size',
		breakpoint,
		props,
		isHover
	);
	const bgSVGTop = getLastBreakpointAttribute(
		'background-svg-position-top',
		breakpoint,
		props,
		isHover
	);
	const bgSVGRight = getLastBreakpointAttribute(
		'background-svg-position-right',
		breakpoint,
		props,
		isHover
	);
	const bgSVGbottom = getLastBreakpointAttribute(
		'background-svg-position-bottom',
		breakpoint,
		props,
		isHover
	);
	const bgSVGLeft = getLastBreakpointAttribute(
		'background-svg-position-left',
		breakpoint,
		props,
		isHover
	);
	const bgSVGUnit = getLastBreakpointAttribute(
		'background-svg-position-unit',
		breakpoint,
		props,
		isHover
	);

	if (isNumber(bgSVGSize)) {
		const bgSVGSizeUnit = getLastBreakpointAttribute(
			'background-svg-size-unit',
			breakpoint,
			props,
			isHover
		);

		response[breakpoint].width = `${bgSVGSize}${bgSVGSizeUnit}`;
	}

	if (!isEmpty(bgSVGTop) || isNumber(bgSVGTop))
		response[breakpoint].top = `${bgSVGTop}${
			bgSVGTop !== 'auto' ? bgSVGUnit : ''
		}`;
	if (!isEmpty(bgSVGRight) || isNumber(bgSVGRight))
		response[breakpoint].right = `${bgSVGRight}${
			bgSVGRight !== 'auto' ? bgSVGUnit : ''
		}`;
	if (!isEmpty(bgSVGbottom) || isNumber(bgSVGbottom))
		response[breakpoint].bottom = `${bgSVGbottom}${
			bgSVGbottom !== 'auto' ? bgSVGUnit : ''
		}`;
	if (!isEmpty(bgSVGLeft) || isNumber(bgSVGLeft))
		response[breakpoint].left = `${bgSVGLeft}${
			bgSVGLeft !== 'auto' ? bgSVGUnit : ''
		}`;

	return response;
};

const getSVGBackgroundObject = ({
	blockStyle,
	breakpoint,
	isHover,
	...props
}) => {
	const response = {
		label: 'SVG Background',
		[breakpoint]: {},
	};

	const bgSVGPaletteStatus = getLastBreakpointAttribute(
		'background-palette-svg-color-status',
		breakpoint,
		props,
		isHover
	);

	if (bgSVGPaletteStatus) {
		const bgSVGPaletteColor = getLastBreakpointAttribute(
			'background-palette-svg-color',
			breakpoint,
			props,
			isHover
		);
		const bgSVGPaletteOpacity = getLastBreakpointAttribute(
			'background-palette-svg-opacity',
			breakpoint,
			props,
			isHover
		);

		response[breakpoint].fill = getColorRGBAString({
			firstVar: `color-${bgSVGPaletteColor}`,
			opacity: bgSVGPaletteOpacity,
			blockStyle,
		});
	} else {
		const bgSVGColor = getLastBreakpointAttribute(
			'background-svg-color',
			breakpoint,
			props,
			isHover
		);

		response[breakpoint].fill = bgSVGColor;
	}

	return response;
};

const getBackgroundLayers = ({
	response,
	layers,
	target,
	isHover = false,
	blockStyle,
	prefix,
	breakpoint,
}) => {
	layers.forEach(layer => {
		const { type } = layer;

		const layerTarget = `${target} > .maxi-background-displayer .maxi-background-displayer__${layer.id}`;

		switch (type) {
			case 'color':
				response[layerTarget] = {
					...response[layerTarget],
					[type]: {
						...merge(
							response?.[layerTarget]?.[type],
							getColorBackgroundObject({
								...getGroupAttributes(
									layer,
									'backgroundColor',
									isHover
								),
								isHover,
								prefix,
								blockStyle,
								breakpoint,
							}),
							getDisplayStyles(
								{
									...getGroupAttributes(
										layer,
										'display',
										isHover
									),
								},
								isHover
							)
						),
					},
				};
				break;
			case 'gradient':
				response[layerTarget] = {
					...response[layerTarget],
					[type]: {
						...merge(
							response?.[layerTarget]?.[type],
							getGradientBackgroundObject({
								...getGroupAttributes(
									layer,
									'backgroundGradient',
									isHover
								),
								isHover,
								prefix,
								breakpoint,
							}),
							getDisplayStyles(
								{
									...getGroupAttributes(
										layer,
										'display',
										isHover
									),
								},
								isHover
							)
						),
					},
				};
				break;
			case 'image': {
				const parallaxStatus = getAttributeValue({
					target: 'background-image-parallax-status',
					props: layer,
					prefix,
				});

				if (!parallaxStatus)
					response[layerTarget] = {
						...response[layerTarget],
						[type]: {
							...merge(
								response?.[layerTarget]?.[type],
								getImageBackgroundObject({
									...getGroupAttributes(
										layer,
										'backgroundImage',
										isHover
									),
									isHover,
									prefix,
									breakpoint,
									isParallax: parallaxStatus,
								}),
								getDisplayStyles(
									{
										...getGroupAttributes(
											layer,
											'display',
											isHover
										),
									},
									isHover
								)
							),
						},
					};
				else {
					response[layerTarget] = {
						...response[layerTarget],
						[type]: {
							...merge(
								response?.[layerTarget]?.[type],
								getDisplayStyles(
									{
										...getGroupAttributes(
											layer,
											'display',
											isHover
										),
									},
									isHover
								)
							),
						},
					};
					response[`${layerTarget} img`] = {
						...response[`${layerTarget} img`],
						[type]: {
							...merge(
								response?.[`${layerTarget} img`]?.[type],
								getImageBackgroundObject({
									...getGroupAttributes(
										layer,
										'backgroundImage',
										isHover
									),
									isHover,
									prefix,
									breakpoint,
									isParallax: parallaxStatus,
								}),
								getDisplayStyles(
									{
										...getGroupAttributes(
											layer,
											'display',
											isHover
										),
									},
									isHover
								)
							),
						},
					};
				}
				break;
			}
			case 'video':
				response[layerTarget] = {
					...response[layerTarget],
					[type]: {
						...merge(
							response?.[layerTarget]?.[type],
							getVideoBackgroundObject({
								...getGroupAttributes(
									layer,
									'backgroundVideo',
									isHover
								),
								isHover,
								prefix,
								breakpoint,
							}),
							getDisplayStyles(
								{
									...getGroupAttributes(
										layer,
										'display',
										isHover
									),
								},
								isHover
							)
						),
					},
				};
				break;
			case 'shape':
				response[layerTarget] = {
					...response[layerTarget],
					[type]: {
						...merge(
							response?.[layerTarget]?.[type],
							getSVGWrapperBackgroundObject({
								...getGroupAttributes(
									layer,
									'backgroundSVG',
									isHover
								),
								breakpoint,
								isHover,
							}),
							getDisplayStyles(
								{
									...getGroupAttributes(
										layer,
										'display',
										isHover
									),
								},
								isHover
							)
						),
					},
				};
				response[`${layerTarget} svg *`] = {
					...response[`${layerTarget} svg *`],
					[type]: {
						...merge(
							response?.[`${layerTarget} svg *`]?.[type],
							getSVGBackgroundObject({
								...getGroupAttributes(
									layer,
									'backgroundSVG',
									isHover
								),
								blockStyle,
								breakpoint,
								isHover,
							})
						),
					},
				};
				if (breakpoint === 'general') {
					response[`${layerTarget} > svg:first-child`] = {
						...response[`${layerTarget} > svg:first-child`],
						[type]: {
							...merge(
								response?.[
									`${layerTarget} > svg:first-child`
								]?.[type],
								...getImageShapeStyles(
									'svg',
									getGroupAttributes(
										layer,
										'imageShape',
										false,
										'background-svg-'
									),
									'background-svg-'
								)
							),
						},
					};
					response[`${layerTarget} > svg:first-child pattern image`] =
						{
							...response[
								`${layerTarget} > svg:first-child pattern image`
							],
							[type]: {
								...merge(
									response?.[
										`${layerTarget} > svg:first-child pattern image`
									]?.[type],
									...getImageShapeStyles(
										'image',
										getGroupAttributes(
											layer,
											'imageShape',
											false,
											'background-svg-'
										),
										'background-svg-'
									)
								),
							},
						};
				}
				break;
			default:
				break;
		}
	});

	return response;
};

export const getBlockBackgroundStyles = ({
	target: rawTarget,
	isHover = false,
	prefix = '',
	blockStyle,
	...props
}) => {
	const target = `${rawTarget ?? ''}${isHover ? ':hover' : ''}`;

	let response = {};

	if (isHover && !props[`${prefix}background-hover-status`]) return response;

	const layers = compact([
		...getAttributeValue({
			target: 'background-layers',
			props,
			prefix,
		}),
		...(isHover && [
			...getAttributeValue({
				target: 'background-layers',
				props,
				prefix,
				isHover,
			}),
		]),
	]);

	if (layers && layers.length > 0)
		BREAKPOINTS.forEach(breakpoint => {
			response = {
				...merge(
					{ ...response },
					{
						...getBackgroundLayers({
							response,
							layers,
							target,
							isHover,
							blockStyle,
							prefix,
							breakpoint,
						}),
					}
				),
			};
		});

	return response;
};

export const getBackgroundStyles = ({
	isHover = false,
	prefix = '',
	isButton = false,
	blockStyle: rawBlockStyle,
	isIconInherit = false,
	...props
}) => {
	const blockStyle = rawBlockStyle.replace('maxi-', '');

	const response = {};

	BREAKPOINTS.forEach(breakpoint => {
		const currentActiveMedia = getLastBreakpointAttribute(
			`${prefix}background-active-media`,
			breakpoint,
			props,
			isHover
		);

		if (!currentActiveMedia) return;

		merge(response, {
			...(currentActiveMedia === 'color' && {
				background: getColorBackgroundObject({
					...getGroupAttributes(
						props,
						'backgroundColor',
						isHover,
						prefix
					),
					blockStyle,
					isButton,
					breakpoint,
					isHover,
					prefix,
					isIconInherit,
				}),
			}),
			...(currentActiveMedia === 'gradient' && {
				background: getGradientBackgroundObject({
					...getGroupAttributes(
						props,
						'backgroundGradient',
						isHover,
						prefix
					),
					breakpoint,
					isHover,
					prefix,
				}),
			}),
		});
	});

	return response;
};
