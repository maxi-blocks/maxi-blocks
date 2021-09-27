/**
 * Internal dependencies
 */
import getAttributeValue from '../getAttributeValue';
import getBorderStyles from './getBorderStyles';
import getColorRGBAString from '../getColorRGBAString';
import getGroupAttributes from '../getGroupAttributes';
import getLastBreakpointAttribute from '../getLastBreakpointAttribute';

/**
 * External dependencies
 */
import { isEmpty, isNil, round } from 'lodash';

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
	isIconInherit = false,
	breakpoint,
	...props
}) => {
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
	const bgPaletteColor = getAttributeValue({
		target: 'background-palette-color',
		props,
		prefix,
		isHover,
		breakpoint,
	});
	const bgPaletteOpacity = getAttributeValue({
		target: 'background-palette-opacity',
		props,
		prefix,
		isHover,
		breakpoint,
	});
	const bgColor = getAttributeValue({
		target: 'background-color',
		props,
		prefix,
		isHover,
		breakpoint,
	});
	const bgClipPath = getAttributeValue({
		target: 'background-color-clip-path',
		props,
		prefix,
		isHover,
		breakpoint,
	});

	if (!bgPaletteStatus && !isEmpty(bgColor))
		response[breakpoint]['background-color'] = bgColor;
	else if (bgPaletteStatus && (bgPaletteColor || bgPaletteOpacity)) {
		if (isButton)
			response[breakpoint]['background-color'] = getColorRGBAString({
				firstVar: `color${isHover ? '-hover' : ''}`,
				secondVar: `color-${bgPaletteColor}`,
				opacity: bgPaletteOpacity,
				blockStyle,
			});
		else
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
						secondVar: `color-${bgPaletteColor}`,
						opacity: bgPaletteOpacity,
						blockStyle,
				  })
				: bgColor;
	}

	if (!isEmpty(bgClipPath)) response[breakpoint]['clip-path'] = bgClipPath;

	return response;
};

export const getGradientBackgroundObject = ({
	isHover = false,
	prefix = '',
	breakpoint,
	...props
}) => {
	const response = {
		label: 'Background Gradient',
		[breakpoint]: {},
	};

	const bgGradientOpacity = getAttributeValue({
		target: 'background-gradient-opacity',
		props,
		prefix,
		isHover,
		breakpoint,
	});
	const bgGradient = getAttributeValue({
		target: 'background-gradient',
		props,
		prefix,
		isHover,
		breakpoint,
	});
	const bgGradientClipPath = getAttributeValue({
		target: 'background-gradient-clip-path',
		props,
		prefix,
		isHover,
		breakpoint,
	});

	if (!isNil(bgGradientOpacity) && !isEmpty(bgGradientOpacity))
		response[breakpoint].opacity = bgGradientOpacity;
	if (!isEmpty(bgGradient)) response[breakpoint].background = bgGradient;
	if (!isEmpty(bgGradientClipPath))
		response[breakpoint]['clip-path'] = bgGradientClipPath;

	return response;
};

export const getImageBackgroundObject = ({
	isHover = false,
	prefix = '',
	breakpoint,
	...props
}) => {
	const response = {
		label: 'Background Image',
		[breakpoint]: {},
	};

	const getBgImageAttributeValue = target =>
		getAttributeValue({
			target,
			props,
			prefix,
			isHover,
			breakpoint,
		});

	const bgImageUrl = getBgImageAttributeValue('background-image-mediaURL');

	if (isEmpty(bgImageUrl)) return {};

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

	// Image
	if (bgImageSize === 'custom' && !isNil(bgImageCropOptions)) {
		response[breakpoint][
			'background-image'
		] = `url('${bgImageCropOptions.image.source_url}')`;
	} else if (
		(bgImageSize === 'custom' && isNil(bgImageCropOptions)) ||
		(bgImageSize !== 'custom' && !isNil(bgImageUrl))
	) {
		response[breakpoint]['background-image'] = `url('${bgImageUrl}')`;
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
		const bgImagePositionWidth = getBgImageAttributeValue(
			'background-image-position-width'
		);
		const bgImagePositionWidthUnit = getBgImageAttributeValue(
			'background-image-position-width-unit'
		);
		const bgImagePositionHeight = getBgImageAttributeValue(
			'background-image-position-height'
		);
		const bgImagePositionHeightUnit = getBgImageAttributeValue(
			'background-image-position-height-unit'
		);
		response[breakpoint]['background-position'] = `${
			bgImagePositionWidth + bgImagePositionWidthUnit
		} ${bgImagePositionHeight + bgImagePositionHeightUnit}`;
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
		else response[breakpoint]['background-attachment'] = bgImageAttachment;
	}

	// Opacity
	if (!isNil(bgImageOpacity) && !isEmpty(bgImageOpacity))
		response[breakpoint].opacity = bgImageOpacity;

	// Clip-path
	if (!isEmpty(bgImageClipPath))
		response[breakpoint]['clip-path'] = bgImageClipPath;

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
		`${prefix}background-video-fallbackUrl`,
		breakpoint,
		props,
		isHover
	);

	// Opacity
	if (!isNil(bgVideoOpacity) && !isEmpty(bgVideoOpacity))
		response[breakpoint].opacity = bgVideoOpacity;

	// Clip-path
	if (!isEmpty(bgVideoClipPath))
		response[breakpoint]['clip-path'] = bgVideoClipPath;

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
		'background-svg-top',
		breakpoint,
		props,
		isHover
	);
	const bgSVGLeft = getLastBreakpointAttribute(
		'background-svg-left',
		breakpoint,
		props,
		isHover
	);

	if (bgSVGSize) {
		const bgSVGSizeUnit = getLastBreakpointAttribute(
			'background-svg-size--unit',
			breakpoint,
			props,
			isHover
		);

		response[breakpoint].width = `${bgSVGSize}${bgSVGSizeUnit}`;
	}

	if (bgSVGTop) {
		const bgSVGTopUnit = getLastBreakpointAttribute(
			'background-svg-top--unit',
			breakpoint,
			props,
			isHover
		);

		response[breakpoint].top = `${bgSVGTop}${bgSVGTopUnit}`;
	}

	if (bgSVGLeft) {
		const bgSVGLeftUnit = getLastBreakpointAttribute(
			'background-svg-left--unit',
			breakpoint,
			props,
			isHover
		);

		response[breakpoint].left = `${bgSVGLeft}${bgSVGLeftUnit}`;
	}

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
			opacity: props[bgSVGPaletteOpacity],
			blockStyle,
		});
	}

	return response;
};

const setBackgroundLayers = ({
	response,
	layers,
	target,
	isHover = false,
	blockStyle,
}) => {
	layers.forEach(layer => {
		const layerTarget = `${target}${
			isHover ? ':hover' : ''
		} > .maxi-background-displayer .maxi-background-displayer__${layer.id}`;

		switch (layer.type) {
			case 'color':
				Object.assign(response, {
					[layerTarget]: {
						backgroundColor: {
							...getColorBackgroundObject({
								...getGroupAttributes(layer, 'backgroundColor'),
								blockStyle,
							}),
						},
					},
				});
				break;
			case 'gradient':
				Object.assign(response, {
					[layerTarget]: {
						backgroundGradient: {
							...getGradientBackgroundObject(
								getGroupAttributes(layer, 'backgroundGradient')
							),
						},
					},
				});
				break;
			case 'image':
				Object.assign(response, {
					[layerTarget]: {
						backgroundImage: {
							...getImageBackgroundObject(
								getGroupAttributes(layer, 'backgroundImage')
							),
						},
					},
				});
				break;
			case 'video':
				Object.assign(response, {
					[layerTarget]: {
						backgroundVideo: {
							...getVideoBackgroundObject(
								getGroupAttributes(layer, 'backgroundVideo')
							),
						},
					},
				});
				break;
			case 'shape':
				Object.assign(response, {
					[layerTarget]: {
						backgroundSVG: {
							...getSVGWrapperBackgroundObject(
								getGroupAttributes(layer, 'backgroundSVG')
							),
						},
					},
					[`${layerTarget} svg *`]: {
						backgroundSVG: {
							...getSVGBackgroundObject({
								...getGroupAttributes(layer, 'backgroundSVG'),
								blockStyle,
							}),
						},
					},
				});
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

	breakpoints.forEach(breakpoint => {
		const widthTop =
			getLastBreakpointAttribute('border-top-width', breakpoint, props) ||
			0;
		const widthBottom =
			getLastBreakpointAttribute(
				'border-bottom-width',
				breakpoint,
				props
			) || 0;
		const widthLeft =
			getLastBreakpointAttribute(
				'border-left-width',
				breakpoint,
				props
			) || 0;
		const widthRight =
			getLastBreakpointAttribute(
				'border-right-width',
				breakpoint,
				props
			) || 0;
		const widthUnit =
			getLastBreakpointAttribute(
				'border-unit-width',
				breakpoint,
				props
			) || 'px';
		const horizontalWidth =
			round(widthTop / 2, 2) - round(widthBottom / 2, 2);
		const verticalWidth =
			round(widthLeft / 2, 2) - round(widthRight / 2, 2);

		if (!!verticalWidth || !!horizontalWidth || isHover)
			size[breakpoint] = {
				transform: `translate(calc(-50% - ${verticalWidth}${widthUnit}), calc(-50% - ${horizontalWidth}${widthUnit}))`,
			};
	});

	const border = getBorderStyles({
		obj: borderProps,
		parentBlockStyle: blockStyle,
		isHover,
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
				size[breakpoints[breakpoints.indexOf(breakpoint) - 1]]
					?.transform === size[breakpoint]?.transform
			)
				delete size[breakpoint];
		});

	return { border, ...(!isEmpty(size) && { size }) };
};

const getBackgroundActiveMedia = (props, prefix = '', isHover = false) => {
	const response = {};
	const target = `${prefix}background-active-media`;

	Object.entries(props).forEach(([key, val]) => {
		if (!key.includes(target) || !val) return;

		const breakpoint = key.replace(`${target}-`, '').replace('-hover', '');
		const lastValue = getLastBreakpointAttribute(
			target,
			breakpoint !== 'general'
				? BREAKPOINTS[BREAKPOINTS.indexOf(breakpoint) - 1]
				: breakpoint,
			props,
			isHover
		);

		if (breakpoint === 'general' || lastValue !== val)
			response[breakpoint] = val;
	});

	return response;
};

const setTargetsToStyles = (target, obj) => {
	const response = {};

	const targets = {
		border: `${target} > .maxi-background-displayer`,
		color: `${target} > .maxi-background-displayer .maxi-background-displayer__color`,
		gradient: `${target} > .maxi-background-displayer .maxi-background-displayer__gradient`,
		image: `${target} > .maxi-background-displayer .maxi-background-displayer__images`,
		video: `${target} > .maxi-background-displayer .maxi-background-displayer__video-player`,
		svg: {
			wrapper: `${target} > .maxi-background-displayer .maxi-background-displayer__svg`,
			svg: `${target} > .maxi-background-displayer .maxi-background-displayer__svg *`,
		},
	};

	Object.entries(targets).forEach(([key, val]) => {
		if (key === 'svg') {
			if (
				obj[key] &&
				obj[key].wrapper &&
				obj[key].svg &&
				!isEmpty(obj[key].wrapper) &&
				!isEmpty(obj[key].svg)
			) {
				response[val.wrapper] = obj[key].wrapper;
				response[val.svg] = obj[key].svg;
			}
		} else if (obj[key] && !isEmpty(obj[key])) response[val] = obj[key];
	});

	return response;
};

const getBackgroundStyles = ({
	target: rawTarget,
	isHover = false,
	prefix = '',
	groupAttrNames = {
		background: 'background',
		backgroundColor: 'backgroundColor',
		backgroundImage: 'backgroundImage',
		backgroundVideo: 'backgroundVideo',
		backgroundGradient: 'backgroundGradient',
		backgroundSVG: 'backgroundSVG',
		border: 'border',
		borderRadius: 'borderRadius',
		borderWidth: 'borderWidth',
	},
	blockStyle,
	...props
}) => {
	const target = `${rawTarget ?? ''}${isHover ? ':hover' : ''}`;

	const includeBorder =
		!isHover || (isHover && props[`${prefix}border-status-hover`]);
	const borderObj =
		includeBorder &&
		getGeneralBackgroundStyles(
			props,
			{
				...getGroupAttributes(
					props,
					[
						groupAttrNames.border,
						groupAttrNames.borderRadius,
						groupAttrNames.borderWidth,
					],
					isHover
				),
			},
			blockStyle,
			isHover
		);

	const response = {
		...(includeBorder && { ...borderObj }),
	};

	if (isHover && !props[`${prefix}background-status-hover`]) return response;

	const activeMedias = getBackgroundActiveMedia(props, prefix);

	BREAKPOINTS.forEach(breakpoint => {
		const activeMedia = getLastBreakpointAttribute(
			'',
			breakpoint,
			activeMedias
		);
		const currentActiveMedia = getAttributeValue({
			target: 'background-active-media',
			props,
			isHover,
			breakpoint,
			prefix,
		});
		const prevBreakpoint =
			breakpoint !== 'general'
				? BREAKPOINTS[BREAKPOINTS.indexOf(breakpoint) - 1]
				: breakpoint;
		const lastActiveMedia = getLastBreakpointAttribute(
			'',
			prevBreakpoint,
			activeMedias
		);

		if (!response[activeMedia]) {
			if (activeMedia === 'svg')
				response[activeMedia] = {
					wrapper: {},
					svg: {},
				};
			else response[activeMedia] = {};
		}

		switch (activeMedia) {
			// case 'layers':
			// 	if (
			// 		props[
			// 			`${prefix}background-layers${isHover ? '-hover' : ''}`
			// 		] &&
			// 		props[
			// 			`${prefix}background-layers${isHover ? '-hover' : ''}`
			// 		].length > 0
			// 	) {
			// 		response = setBackgroundLayers({
			// 			response,
			// 			layers: props[
			// 				`${prefix}background-layers${
			// 					isHover ? '-hover' : ''
			// 				}`
			// 			],
			// 			target,
			// 			isHover,
			// 			blockStyle,
			// 		});
			// 	}
			// 	break;
			case 'color':
				response.color = {
					...response.color,
					...getColorBackgroundObject({
						...getGroupAttributes(
							props,
							groupAttrNames.backgroundColor,
							isHover
						),
						isHover,
						prefix,
						blockStyle,
						breakpoint,
					}),
				};
				break;
			case 'gradient':
				response.gradient = {
					...response.gradient,
					...{
						...getGradientBackgroundObject({
							...getGroupAttributes(
								props,
								groupAttrNames.backgroundGradient,
								isHover
							),
							isHover,
							prefix,
							breakpoint,
						}),
					},
				};
				break;
			case 'image':
				response.image = {
					...response.image,
					...getImageBackgroundObject({
						...getGroupAttributes(
							props,
							groupAttrNames.backgroundImage,
							isHover
						),
						isHover,
						prefix,
						breakpoint,
					}),
				};
				break;
			case 'video':
				response.video = {
					...response.video,
					...getVideoBackgroundObject({
						...getGroupAttributes(
							props,
							groupAttrNames.backgroundVideo,
							isHover
						),
						isHover,
						prefix,
						breakpoint,
					}),
				};
				break;
			case 'svg':
				response.svg = {
					wrapper: {
						...response.svg.wrapper,
						...{
							...getSVGWrapperBackgroundObject({
								...getGroupAttributes(
									props,
									groupAttrNames.backgroundSVG,
									isHover
								),
								isHover,
								prefix,
							}),
						},
					},
					svg: {
						...response.svg.svg,
						...{
							...getSVGBackgroundObject({
								...getGroupAttributes(
									props,
									groupAttrNames.backgroundSVG,
									isHover
								),
								blockStyle,
								breakpoint,
								isHover,
							}),
						},
					},
				};
				break;
			default:
				break;
		}

		// Ensures different active medias to be visible
		if (currentActiveMedia && currentActiveMedia !== lastActiveMedia) {
			if (lastActiveMedia === 'svg')
				response[lastActiveMedia].wrapper[breakpoint] = {
					display: 'none',
				};
			if (activeMedia === 'svg')
				response[activeMedia].wrapper[breakpoint] = {
					...response[activeMedia][breakpoint],
					display: 'block',
				};
			else {
				response[lastActiveMedia][breakpoint] = { display: 'none' };
				response[activeMedia][breakpoint] = {
					...response[activeMedia][breakpoint],
					display: 'block',
				};
			}
		} else if (breakpoint === 'general')
			if (currentActiveMedia === 'svg')
				response[activeMedia].wrapper.general = {
					...response[activeMedia][breakpoint],
					display: 'block',
				};
			else
				response[activeMedia].general = {
					...response[activeMedia][breakpoint],
					display: 'block',
				};
	});

	return setTargetsToStyles(target, response);
};

export default getBackgroundStyles;
