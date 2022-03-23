/**
 * Internal dependencies
 */
import getAttributeValue from '../getAttributeValue';
import getBorderStyles from './getBorderStyles';
import getColorRGBAString from '../getColorRGBAString';
import getDisplayStyles from './getDisplayStyles';
import getGroupAttributes from '../getGroupAttributes';
import getImageShapeStyles from './getImageShapeStyles';
import getLastBreakpointAttribute from '../getLastBreakpointAttribute';

/**
 * External dependencies
 */
import { isEmpty, isNil, isNumber, merge, compact, round } from 'lodash';
import getPaletteAttributes from '../getPaletteAttributes';

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
	scValues = {},
	...props
}) => {
	const hoverStatus = props[`${prefix}background-hover-status`];
	const {
		'hover-background-color-global': isActive,
		'hover-background-color-all': affectAll,
	} = scValues;
	const globalHoverStatus = isActive && affectAll;

	if (
		isHover &&
		!isNil(hoverStatus) &&
		!hoverStatus &&
		!isNil(globalHoverStatus) &&
		!globalHoverStatus
	)
		return {};

	const blockStyle = rawBlockStyle.replace('maxi-', '');

	const response = {
		label: 'Background Color',
		[breakpoint]: {},
	};

	const { paletteStatus, paletteColor, paletteOpacity, color } =
		getPaletteAttributes({
			obj: props,
			prefix: `${prefix}background-`,
			isHover,
			breakpoint,
		});

	const bgClipPath = getLastBreakpointAttribute({
		target: `${prefix}background-color-clip-path`,
		breakpoint,
		attributes: props,
		isHover,
	});

	if (!paletteStatus && !isEmpty(color))
		response[breakpoint]['background-color'] = color;
	else if (paletteStatus && (paletteColor || paletteOpacity)) {
		if (isButton && (!isHover || hoverStatus || globalHoverStatus))
			response[breakpoint].background = getColorRGBAString({
				firstVar: `button-background-color${isHover ? '-hover' : ''}`,
				secondVar: `color-${paletteColor}`,
				opacity: paletteOpacity,
				blockStyle,
			});
		else
			response[breakpoint]['background-color'] = getColorRGBAString({
				firstVar: `color-${paletteColor}`,
				opacity: paletteOpacity,
				blockStyle,
			});
	}

	if (isIconInherit) {
		response[breakpoint]['background-color'] =
			props['background-active-media'] !== '' && paletteStatus
				? getColorRGBAString({
						firstVar: `button-background-color${
							isHover ? '-hover' : ''
						}`,
						secondVar: `color-${paletteColor}`,
						opacity: paletteOpacity,
						blockStyle,
				  })
				: color;
	}

	if (!isIconInherit && isIcon)
		response[breakpoint].background = paletteStatus
			? getColorRGBAString({
					firstVar: `color-${paletteColor}`,
					opacity: paletteOpacity,
					blockStyle,
			  })
			: color;
	else if (isIcon) {
		const { paletteColor, paletteOpacity, color } = getPaletteAttributes({
			obj: props,
			prefix: 'button-background-',
			isHover,
			breakpoint,
		});

		response[breakpoint].background = paletteStatus
			? getColorRGBAString({
					firstVar: `color-${paletteColor}`,
					opacity: paletteOpacity,
					blockStyle,
			  })
			: color;
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
	blockStyle,
	isButton,
	isIconInherit,
	scValues,
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
	const bgGradient = getLastBreakpointAttribute({
		target: `${prefix}background-gradient`,
		breakpoint,
		attributes: props,
		isHover,
	});
	const bgGradientClipPath = getAttributeValue({
		target: 'background-gradient-clip-path',
		props,
		prefix,
		isHover,
		breakpoint,
	});

	if (
		isIcon &&
		getLastBreakpointAttribute({
			target: `${prefix}background-active-media`,
			breakpoint,
			attributes: props,
			isHover,
		}) === 'gradient'
	) {
		if (isNumber(bgGradientOpacity))
			response[breakpoint].opacity = bgGradientOpacity;
		if (!isEmpty(bgGradient)) response[breakpoint].background = bgGradient;
	} else if (!isIcon) {
		if (isNumber(bgGradientOpacity))
			response[breakpoint].opacity = bgGradientOpacity;
		if (!isEmpty(bgGradient) && bgGradient !== 'undefined') {
			response[breakpoint].background = bgGradient;
		} else {
			const colorBackground = getColorBackgroundObject({
				...getGroupAttributes(
					props,
					['background', 'backgroundColor'],
					isHover,
					prefix
				),
				blockStyle,
				isButton,
				breakpoint,
				isHover,
				prefix,
				isIconInherit,
				scValues,
			});

			const background =
				colorBackground[breakpoint].background ??
				colorBackground[breakpoint]['background-color'];

			if (background) response[breakpoint].background = background;
		}
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
		getLastBreakpointAttribute({
			target: prefix + target,
			breakpoint,
			attributes: props,
			isHover,
		});

	const bgImageSize = getLastBreakpointAttribute({
		target: `${prefix}background-image-size`,
		breakpoint,
		attributes: props,
		isHover,
	});
	const bgImageCropOptions = getBgImageAttributeValue(
		'background-image-crop-options'
	);
	const bgImageRepeat = getBgImageAttributeValue('background-image-repeat');
	const bgImagePosition = getLastBreakpointAttribute({
		target: `${prefix}background-image-position`,
		breakpoint,
		attributes: props,
		isHover,
	});
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

	const bgVideoOpacity = getLastBreakpointAttribute({
		target: `${prefix}background-video-opacity`,
		breakpoint,
		attributes: props,
		isHover,
	});
	const bgVideoClipPath = getLastBreakpointAttribute({
		target: `${prefix}background-video-clip-path`,
		breakpoint,
		attributes: props,
		isHover,
	});
	const bgVideoFallbackUrl = getLastBreakpointAttribute({
		target: `${prefix}background-video-fallbackURL`,
		breakpoint,
		attributes: props,
		isHover,
	});

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

	const bgSVGSize = getLastBreakpointAttribute({
		target: 'background-svg-size',
		breakpoint,
		attributes: props,
		isHover,
	});
	const bgSVGTop = getLastBreakpointAttribute({
		target: 'background-svg-position-top',
		breakpoint,
		attributes: props,
		isHover,
	});
	const bgSVGRight = getLastBreakpointAttribute({
		target: 'background-svg-position-right',
		breakpoint,
		attributes: props,
		isHover,
	});
	const bgSVGbottom = getLastBreakpointAttribute({
		target: 'background-svg-position-bottom',
		breakpoint,
		attributes: props,
		isHover,
	});
	const bgSVGLeft = getLastBreakpointAttribute({
		target: 'background-svg-position-left',
		breakpoint,
		attributes: props,
		isHover,
	});
	const bgSVGUnit = getLastBreakpointAttribute({
		target: 'background-svg-position-unit',
		breakpoint,
		attributes: props,
		isHover,
	});

	if (isNumber(bgSVGSize)) {
		const bgSVGSizeUnit = getLastBreakpointAttribute({
			target: 'background-svg-size-unit',
			breakpoint,
			attributes: props,
			isHover,
		});

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

	const { paletteStatus, paletteColor, paletteOpacity, color } =
		getPaletteAttributes({
			obj: props,
			prefix: 'background-svg-',
			isHover,
			breakpoint,
		});

	if (paletteStatus)
		response[breakpoint].fill = getColorRGBAString({
			firstVar: `color-${paletteColor}`,
			opacity: paletteOpacity,
			blockStyle,
		});
	else response[breakpoint].fill = color;

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

		const layerTarget = `${target} > .maxi-background-displayer .maxi-background-displayer__${layer.order}`;

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

const getGeneralBackgroundStyles = (
	props,
	borderProps,
	blockStyle,
	isHover
) => {
	const breakpoints = ['general', 'xxl', 'xl', 'l', 'm', 's', 'xs'];
	const size = {};

	const getBorderValue = (target, breakpoint) => {
		const lastValue = getLastBreakpointAttribute({
			target: `border-${target}-width`,
			breakpoint,
			attributes: props,
			isHover,
		});

		return isNumber(lastValue) ? lastValue : 2;
	};

	const border = getBorderStyles({
		obj: borderProps,
		parentBlockStyle: blockStyle,
		isHover,
	});

	breakpoints.forEach(breakpoint => {
		const widthTop = getBorderValue('top', breakpoint);
		const widthBottom = getBorderValue('bottom', breakpoint);
		const widthLeft = getBorderValue('left', breakpoint);
		const widthRight = getBorderValue('right', breakpoint);
		const widthUnit =
			getLastBreakpointAttribute({
				target: 'border-unit-width',
				breakpoint,
				attributes: props,
			}) || 'px';
		const horizontalWidth =
			round(widthTop / 2, 2) + round(widthBottom / 2, 2);
		const verticalWidth =
			round(widthLeft / 2, 2) + round(widthRight / 2, 2);

		if (border[breakpoint]['border-style']) {
			size[breakpoint] = {
				...((!!horizontalWidth || isHover) && {
					top: -horizontalWidth + widthUnit,
				}),
				...((!!verticalWidth || isHover) && {
					left: -verticalWidth + widthUnit,
				}),
			};
		}
	});

	breakpoints.forEach(breakpoint => {
		if (border[breakpoint]['border-top-width'])
			border[breakpoint]['border-top-style'] =
				border[breakpoint]['border-style'];

		if (border[breakpoint]['border-right-width'])
			border[breakpoint]['border-right-style'] =
				border[breakpoint]['border-style'];

		if (border[breakpoint]['border-bottom-width'])
			border[breakpoint]['border-bottom-style'] =
				border[breakpoint]['border-style'];

		if (border[breakpoint]['border-left-width'])
			border[breakpoint]['border-left-style'] =
				border[breakpoint]['border-style'];
	});

	delete border.general['border-style'];

	// Clean size object
	if (!isEmpty(size))
		[...breakpoints].reverse().forEach(breakpoint => {
			if (
				size[breakpoints[breakpoints.indexOf(breakpoint) - 1]]?.top ===
					size[breakpoint]?.top ||
				size[breakpoints[breakpoints.indexOf(breakpoint) - 1]]?.left ===
					size[breakpoint]?.left
			)
				delete size[breakpoint];
		});

	return { border, ...(!isEmpty(size) && { size }) };
};

const getBasicResponseObject = ({
	target,
	isHover,
	prefix,
	blockStyle,
	...props
}) => {
	const includeBorder =
		!isHover || (isHover && props[`${prefix}border-status-hover`]);

	const borderObj =
		includeBorder &&
		getGeneralBackgroundStyles(
			props,
			{
				...getGroupAttributes(
					props,
					['border', 'borderRadius', 'borderWidth'],
					isHover
				),
			},
			blockStyle,
			isHover
		);

	return {
		...(includeBorder && {
			[`${target} > .maxi-background-displayer`]: { ...borderObj },
		}),
	};
};

export const getBlockBackgroundStyles = ({
	target: rawTarget,
	isHover = false,
	prefix = '',
	blockStyle,
	...props
}) => {
	const target = `${rawTarget ?? ''}${isHover ? ':hover' : ''}`;

	let response = getBasicResponseObject({
		target,
		isHover,
		prefix,
		blockStyle,
		...props,
	});

	if (isHover && !props[`${prefix}block-background-hover-status`])
		return response;

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
	scValues = {},
	...props
}) => {
	const blockStyle = rawBlockStyle.replace('maxi-', '');

	const response = {};

	BREAKPOINTS.forEach(breakpoint => {
		const currentActiveMedia = getLastBreakpointAttribute({
			target: `${prefix}background-active-media`,
			breakpoint,
			attributes: props,
			isHover,
		});

		if (!currentActiveMedia) return;

		merge(response, {
			...(currentActiveMedia === 'color' && {
				background: getColorBackgroundObject({
					...getGroupAttributes(
						props,
						['background', 'backgroundColor'],
						isHover,
						prefix
					),
					blockStyle,
					isButton,
					breakpoint,
					isHover,
					prefix,
					isIconInherit,
					scValues,
				}),
			}),
			...(currentActiveMedia === 'gradient' && {
				background: getGradientBackgroundObject({
					...getGroupAttributes(
						props,
						['backgroundColor', 'backgroundGradient'],
						isHover,
						prefix
					),
					blockStyle,
					isButton,
					breakpoint,
					isHover,
					prefix,
					isIconInherit,
					scValues,
				}),
			}),
		});
	});

	return response;
};
