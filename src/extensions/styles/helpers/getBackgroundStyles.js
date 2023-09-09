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
import getPaletteAttributes from '../getPaletteAttributes';

/**
 * External dependencies
 */
import {
	compact,
	isEmpty,
	isNil,
	isNumber,
	merge,
	pickBy,
	round,
	toNumber,
} from 'lodash';

const BREAKPOINTS = ['general', 'xxl', 'xl', 'l', 'm', 's', 'xs'];

/**
 * Clean BackgroundControl object for being delivered for styling
 *
 * @param {Object} background BackgroundControl related object
 */
export const getColorBackgroundObject = ({
	isHover = false,
	prefix = '',
	blockStyle,
	isButton = false,
	isIcon = false,
	isIconInherit = false,
	breakpoint = 'general',
	scValues = {},
	backgroundColorProperty = 'background-color',
	...props
}) => {
	const hoverStatus = props[`${prefix}background-status-hover`];
	const {
		'hover-background-color-global': isActive,
		'hover-background-color-all': affectAll,
	} = scValues;
	const globalHoverStatus = isActive && affectAll;

	if (isHover && !isNil(hoverStatus) && !hoverStatus && !globalHoverStatus)
		return {};

	const response = {
		label: 'Background Color',
		[breakpoint]: {},
	};

	const {
		paletteStatus,
		paletteSCStatus,
		paletteColor,
		paletteOpacity,
		color,
	} = getPaletteAttributes({
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

	const isBgColorClipPathActive = getLastBreakpointAttribute({
		target: `${prefix}background-color-clip-path-status`,
		breakpoint,
		attributes: props,
		isHover,
	});

	if (!paletteStatus && !isEmpty(color))
		response[breakpoint][backgroundColorProperty] = color;
	else if (paletteStatus && (paletteColor || paletteOpacity)) {
		if (isButton && (!isHover || hoverStatus || globalHoverStatus))
			response[breakpoint].background = getColorRGBAString(
				paletteSCStatus
					? {
							firstVar: `color-${paletteColor}`,
							opacity: paletteOpacity,
							blockStyle,
					  }
					: {
							firstVar: `button-background-color${
								isHover ? '-hover' : ''
							}`,
							secondVar: `color-${paletteColor}`,
							opacity: paletteOpacity,
							blockStyle,
					  }
			);
		else
			response[breakpoint][backgroundColorProperty] = getColorRGBAString({
				firstVar: `color-${paletteColor}`,
				opacity: paletteOpacity,
				blockStyle,
			});
	}

	if (isIconInherit) {
		const hasBackground =
			!!props['background-active-media'] &&
			props['background-active-media'] !== 'none';

		if (hasBackground)
			response[breakpoint][backgroundColorProperty] =
				props['background-active-media'] !== '' && paletteStatus
					? getColorRGBAString(
							paletteSCStatus
								? {
										firstVar: `color-${paletteColor}`,
										opacity: paletteOpacity,
										blockStyle,
								  }
								: {
										firstVar: `button-background-color${
											isHover ? '-hover' : ''
										}`,
										secondVar: `color-${paletteColor}`,
										opacity: paletteOpacity,
										blockStyle,
								  }
					  )
					: color;
		else response[breakpoint][backgroundColorProperty] = '';
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
		const hasBackground =
			!!props['background-active-media'] &&
			props['background-active-media'] !== 'none';

		const { paletteColor, paletteOpacity, color } = getPaletteAttributes({
			obj: props,
			prefix: 'button-background-',
			isHover,
			breakpoint,
		});

		if (hasBackground)
			response[breakpoint].background = paletteStatus
				? getColorRGBAString({
						firstVar: `color-${paletteColor}`,
						opacity: paletteOpacity,
						blockStyle,
				  })
				: color;
		else response[breakpoint].background = '';
	}

	if (isBgColorClipPathActive)
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

	const bgGradientOpacity = getLastBreakpointAttribute({
		target: `${prefix}background-gradient-opacity`,
		breakpoint,
		attributes: props,
		isHover,
	});
	const bgGradient = getLastBreakpointAttribute({
		target: `${prefix}background-gradient`,
		breakpoint,
		attributes: props,
		isHover,
	});
	const bgGradientClipPath = getLastBreakpointAttribute({
		target: `${prefix}background-gradient-clip-path`,
		breakpoint,
		attributes: props,
		isHover,
	});

	const isbgGradientClipPathActive = getLastBreakpointAttribute({
		target: `${prefix}background-gradient-clip-path-status`,
		breakpoint,
		attributes: props,
		isHover,
	});

	if (
		(isIcon &&
			getLastBreakpointAttribute({
				target: `${prefix}background-active-media`,
				breakpoint,
				attributes: props,
				isHover,
			}) === 'gradient') ||
		!isIcon
	) {
		if (
			isNumber(bgGradientOpacity) &&
			!isEmpty(bgGradient) &&
			bgGradient !== 'undefined'
		) {
			response[breakpoint].background = bgGradient;

			if (bgGradientOpacity < 1) {
				const colorRegex =
					/rgba?\((\d{1,3}),\s*(\d{1,3}),\s*(\d{1,3})(?:,\s*(\d(?:\.\d+)?))?\)/g;

				const matches = bgGradient.match(colorRegex);
				if (matches) {
					matches.forEach(match => {
						let colorOpacity = 1;

						const isRgba = match.includes('rgba');
						if (isRgba)
							colorOpacity = toNumber(
								match.split(',')[3].replace(')', '')
							);

						const newMatch = match.replace(
							colorRegex,
							`rgba($1,$2,$3,${round(
								colorOpacity * bgGradientOpacity,
								2
							)})`
						);
						response[breakpoint].background = response[
							breakpoint
						].background.replace(match, newMatch);
					});
				}
			}
		} else if (!isIcon) {
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

		if (isbgGradientClipPathActive)
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
	ignoreMediaAttributes = false,
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

	if (isEmpty(bgImageUrl) && !ignoreMediaAttributes) return {};

	const getBgImageAttributeValue = (target, isHoverParam = isHover) =>
		getAttributeValue({
			target,
			isHover: isHoverParam,
			prefix,
			breakpoint,
			props,
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

	const bgImageClipPath = getLastBreakpointAttribute({
		target: `${prefix}background-image-clip-path`,
		breakpoint,
		attributes: props,
		isHover,
	});

	const isbgImageClipPathActive = getLastBreakpointAttribute({
		target: `${prefix}background-image-clip-path-status`,
		breakpoint,
		attributes: props,
		isHover,
	});

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
	if (isNumber(bgImageOpacity)) {
		response[breakpoint].opacity = bgImageOpacity;

		// To avoid image blinking on opacity hover
		if (!isHover) {
			const bgImageOpacity = getBgImageAttributeValue(
				'background-image-opacity',
				true
			);

			if (bgImageOpacity)
				response[breakpoint]['-webkit-transform'] =
					'translate3d(0,0,0)';
		}
	}

	// Clip-path
	if (isbgImageClipPathActive)
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

const getWrapperObject = ({
	breakpoint,
	isHover = false,
	prefix = '',
	setSameWidthAndHeight = false,
	...props
}) => {
	const response = {
		label: 'Background layer wrapper',
		[breakpoint]: {},
	};

	['width', 'height'].forEach(size => {
		const bgSize = getLastBreakpointAttribute({
			target: `${prefix}${size}`,
			breakpoint,
			attributes: props,
			isHover,
		});

		if (isNumber(bgSize)) {
			const bgSVGSizeUnit = getLastBreakpointAttribute({
				target: `${prefix}${size}-unit`,
				breakpoint,
				attributes: props,
				isHover,
			});

			if (!(setSameWidthAndHeight && size === 'height'))
				response[breakpoint][size] = `${bgSize}${bgSVGSizeUnit}`;
		}
	});

	const keyWords = ['top', 'right', 'bottom', 'left'];

	keyWords.forEach(keyWord => {
		const positionValue = getLastBreakpointAttribute({
			target: `${prefix}position-${keyWord}`,
			breakpoint,
			attributes: props,
			isHover,
		});

		const positionUnit = getLastBreakpointAttribute({
			target: `${prefix}position-${keyWord}-unit`,
			breakpoint,
			attributes: props,
			isHover,
		});

		if (!isNil(positionValue) && !isNil(positionUnit)) {
			response[breakpoint][keyWord] =
				positionValue === 'auto'
					? 'auto'
					: `${positionValue}${positionUnit}`;
		}
	});

	return !isEmpty(response[breakpoint]) ? response : {};
};

const getSVGBackgroundObject = ({
	blockStyle,
	breakpoint,
	isHover,
	...props
}) => {
	const response = {
		label: 'Icon background',
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
	ignoreMediaAttributes,
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
							getWrapperObject({
								...getGroupAttributes(
									layer,
									'backgroundColor',
									isHover
								),
								breakpoint,
								prefix: 'background-color-wrapper-',
								isHover,
							}),
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
							getWrapperObject({
								...getGroupAttributes(
									layer,
									'backgroundGradient',
									isHover
								),
								breakpoint,
								prefix: 'background-gradient-wrapper-',
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
									...(!isHover &&
										pickBy(
											getGroupAttributes(
												layer,
												'backgroundImage',
												true
											),
											(value, key) =>
												key.includes(
													'background-image-opacity'
												) && key.includes('-hover')
										)),
									isHover,
									prefix,
									breakpoint,
									isParallax: parallaxStatus,
									ignoreMediaAttributes,
								}),
								getWrapperObject({
									...getGroupAttributes(
										layer,
										'backgroundImage',
										isHover
									),
									breakpoint,
									prefix: 'background-image-wrapper-',
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
							getWrapperObject({
								...getGroupAttributes(
									layer,
									'backgroundVideo',
									isHover
								),
								breakpoint,
								prefix: 'background-video-wrapper-',
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
				break;
			case 'shape':
				response[layerTarget] = {
					...response[layerTarget],
					[type]: {
						...merge(
							response?.[layerTarget]?.[type],
							getWrapperObject({
								...getGroupAttributes(
									layer,
									'backgroundSVG',
									isHover
								),
								breakpoint,
								prefix: 'background-svg-',
								isHover,
								setSameWidthAndHeight: true,
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
										isHover,
										'background-svg-'
									),
									'background-svg-',
									false,
									isHover
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

	const getBorderValue = (target, breakpoint, forceIsHover = null) => {
		const lastValue = getLastBreakpointAttribute({
			target: `border-${target}-width`,
			breakpoint,
			attributes: props,
			avoidXXL: !isHover,
			isHover: forceIsHover ?? isHover,
		});

		return isNumber(lastValue) ? lastValue : 2;
	};

	const border = getBorderStyles({
		obj: borderProps,
		blockStyle,
		isHover,
	});

	!isEmpty(props) &&
		breakpoints.forEach(breakpoint => {
			let widthTop;
			let widthBottom;
			let widthLeft;
			let widthRight;

			if (
				props[`border-style-${breakpoint}`] !== 'none' &&
				((props['border-style-general'] &&
					props['border-style-general'] !== 'none') ||
					props[`border-style-${breakpoint}`])
			) {
				widthTop = getBorderValue('top', breakpoint);
				widthBottom = getBorderValue('bottom', breakpoint);
				widthLeft = getBorderValue('left', breakpoint);
				widthRight = getBorderValue('right', breakpoint);
			}

			const widthUnit =
				getLastBreakpointAttribute({
					target: 'border-unit-width',
					breakpoint,
					attributes: props,
				}) || 'px';

			if (
				border[breakpoint]['border-style'] ||
				Number.isFinite(widthTop) ||
				Number.isFinite(widthBottom) ||
				Number.isFinite(widthLeft) ||
				Number.isFinite(widthRight)
			) {
				const getSize = (width, target) => {
					if (!Number.isFinite(width)) return null;

					if (isHover) {
						const isSameThanNormal =
							getBorderValue(target, breakpoint, false) === width;

						if (isSameThanNormal) {
							return null;
						}
					}
					return { [target]: -round(width, 2) + widthUnit };
				};

				size[breakpoint] = {
					...getSize(widthTop, 'top'),
					...getSize(widthBottom, 'bottom'),
					...getSize(widthLeft, 'left'),
					...getSize(widthRight, 'right'),
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
				size[breakpoint]?.top
			)
				delete size[breakpoint]?.top;
			if (
				size[breakpoints[breakpoints.indexOf(breakpoint) - 1]]?.left ===
				size[breakpoint]?.left
			)
				delete size[breakpoint]?.left;
			if (
				size[breakpoints[breakpoints.indexOf(breakpoint) - 1]]
					?.bottom === size[breakpoint]?.bottom
			)
				delete size[breakpoint]?.bottom;
			if (
				size[breakpoints[breakpoints.indexOf(breakpoint) - 1]]
					?.right === size[breakpoint]?.right
			)
				delete size[breakpoint]?.right;

			if (
				isEmpty(size[breakpoints[breakpoints.indexOf(breakpoint) - 1]])
			) {
				delete size[breakpoints[breakpoints.indexOf(breakpoint) - 1]];
			}
			if (isEmpty(size[breakpoint])) {
				delete size[breakpoint];
			}
		});

	return { border, ...(!isEmpty(size) && { size }) };
};

const getBasicResponseObject = ({
	target,
	isHover,
	prefix,
	blockStyle,
	rowBorderRadius,
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
	const rowBorderRadiusObj = getGeneralBackgroundStyles(
		rowBorderRadius,
		{ ...rowBorderRadius },
		blockStyle,
		isHover
	);
	// TODO: check this merge, as rowBorderRadiusObj is modified.
	// At the end, mergedBorderObj is equal to rowBorderRadiusObj.
	const mergedBorderObj = merge(rowBorderRadiusObj, borderObj);

	return {
		[`${target} > .maxi-background-displayer`]:
			includeBorder && !isEmpty(borderObj.general)
				? mergedBorderObj
				: rowBorderRadiusObj,
	};
};

export const getBlockBackgroundStyles = ({
	target: rawTarget,
	isHover = false,
	prefix = '',
	blockStyle,
	rowBorderRadius = {},
	ignoreMediaAttributes,
	...props
}) => {
	const target = `${rawTarget ?? ''}${isHover ? ':hover' : ''}`;

	let response = getBasicResponseObject({
		target,
		isHover,
		prefix,
		blockStyle,
		rowBorderRadius,
		...props,
	});

	if (isHover && !props[`${prefix}block-background-status-hover`])
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
							ignoreMediaAttributes,
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
	blockStyle,
	isIconInherit = false,
	scValues = {},
	backgroundColorProperty,
	...props
}) => {
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
					backgroundColorProperty,
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
