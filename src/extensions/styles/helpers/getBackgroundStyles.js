/**
 * Internal dependencies
 */
import getAttributeValue from '../getAttributeValue';
import getBorderStyles from './getBorderStyles';
import getColorRGBAString from '../getColorRGBAString';
import getGroupAttributes from '../getGroupAttributes';
import getLastBreakpointAttribute from '../getLastBreakpointAttribute';
import getDisplayStyles from './getDisplayStyles';

/**
 * External dependencies
 */
import { isEmpty, isNil, round, isNumber, merge, cloneDeep } from 'lodash';
import { getSVGClassName } from '../../svg/utils';

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
	const currentBgPaletteColor = getAttributeValue({
		target: 'background-palette-color',
		props,
		prefix,
		isHover,
		breakpoint,
	});
	const currentBgPaletteOpacity = getAttributeValue({
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
	else if (
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
						secondVar: `color-${currentBgPaletteColor}`,
						opacity: currentBgPaletteOpacity,
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

	if (isNumber(bgGradientOpacity))
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
	const getBgImageLastBreakpointAttribute = target =>
		getLastBreakpointAttribute(prefix + target, breakpoint, props, isHover);

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
		`${prefix}background-video-fallbackURL`,
		breakpoint,
		props,
		isHover
	);

	// Opacity
	if (isNumber(bgVideoOpacity))
		response[breakpoint].opacity = bgVideoOpacity / 100;

	// Clip-path
	if (!isEmpty(bgVideoClipPath))
		response[breakpoint]['clip-path'] = bgVideoClipPath;

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
			opacity: bgSVGPaletteOpacity,
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
	prefix,
	breakpoint,
}) => {
	layers.forEach(layer => {
		const { type } = layer;

		const layerTarget = `${target}${
			isHover ? ':hover' : ''
		} > .maxi-background-displayer .maxi-background-displayer__${layer.id}`;

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
							getDisplayStyles({
								...getGroupAttributes(layer, 'display'),
							})
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
							getDisplayStyles({
								...getGroupAttributes(layer, 'display'),
							})
						),
					},
				};
				break;
			case 'image':
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
							}),
							getDisplayStyles({
								...getGroupAttributes(layer, 'display'),
							})
						),
					},
				};
				break;
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
							getDisplayStyles({
								...getGroupAttributes(layer, 'display'),
							})
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
								...getGroupAttributes(layer, 'backgroundSVG'),
								breakpoint,
							}),
							getDisplayStyles({
								...getGroupAttributes(layer, 'display'),
							})
						),
					},
				};
				response[`${layerTarget} svg *`] = {
					...response[`${layerTarget} svg *`],
					[type]: {
						...merge(
							response?.[`${layerTarget} svg *`]?.[type],
							getSVGBackgroundObject({
								...getGroupAttributes(layer, 'backgroundSVG'),
								blockStyle,
								breakpoint,
							}),
							getDisplayStyles({
								...getGroupAttributes(layer, 'display'),
							})
						),
					},
				};
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
	const response = cloneDeep({
		...(obj.layers && { ...obj.layers }),
	});

	delete obj.layers;

	const targets = {
		border: `${target} > .maxi-background-displayer`,
		color: `${target} > .maxi-background-displayer .maxi-background-displayer__color`,
		gradient: `${target} > .maxi-background-displayer .maxi-background-displayer__gradient`,
		image: `${target} > .maxi-background-displayer .maxi-background-displayer__images`,
		video: `${target} > .maxi-background-displayer .maxi-background-displayer__video-player`,
		svg: {
			wrapper: `${target} > .maxi-background-displayer .maxi-background-displayer__svg`,
			svg: `${target} > .maxi-background-displayer .maxi-background-displayer__svg`, // Originally comes with ` *`
		},
	};

	Object.entries(targets).forEach(([key, val]) => {
		if (key === 'svg') {
			if (obj[key] && !isEmpty(obj[key])) {
				Object.keys(obj[key]).forEach(SVGClassName => {
					response[
						`${val.wrapper}.maxi-background-displayer__svg--${SVGClassName}`
					] = obj[key][SVGClassName].wrapper;
					response[
						`${val.svg}.maxi-background-displayer__svg--${SVGClassName} *`
					] = obj[key][SVGClassName].svg;
				});
			}
		} else if (obj[key] && !isEmpty(obj[key])) response[val] = obj[key];
	});

	if (response.layer)
		Object.entries(response.layer).forEach(([key, val]) => {
			response[key] = val;

			delete response.layer.key;
		});

	return response;
};

const getBasicResponseObject = ({ isHover, prefix, blockStyle, ...props }) => {
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
		...(includeBorder && { ...borderObj }),
	};
};

const getResponseActiveMedia = ({
	target,
	activeMedia,
	response: rawResponse,
	isHover,
	prefix,
	blockStyle,
	breakpoint,
	SVGClassName,
	...props
}) => {
	const response = cloneDeep(rawResponse);

	switch (activeMedia) {
		case 'layers': {
			const layers = getAttributeValue({
				target: 'background-layers',
				props,
				isHover,
				prefix,
			});

			if (layers && layers.length > 0) {
				return {
					...setBackgroundLayers({
						response,
						layers,
						target,
						isHover,
						blockStyle,
						prefix,
						breakpoint,
					}),
				};
			}

			return {};
		}
		case 'color':
			return {
				...getColorBackgroundObject({
					...getGroupAttributes(props, 'backgroundColor', isHover),
					isHover,
					prefix,
					blockStyle,
					breakpoint,
				}),
			};

		case 'gradient':
			return {
				...{
					...getGradientBackgroundObject({
						...getGroupAttributes(
							props,
							'backgroundGradient',
							isHover
						),
						isHover,
						prefix,
						breakpoint,
					}),
				},
			};

		case 'image':
			return {
				...getImageBackgroundObject({
					...getGroupAttributes(props, 'backgroundImage', isHover),
					isHover,
					prefix,
					breakpoint,
				}),
			};

		case 'video':
			return {
				...getVideoBackgroundObject({
					...getGroupAttributes(props, 'backgroundVideo', isHover),
					isHover,
					prefix,
					breakpoint,
				}),
			};

		case 'svg':
			return {
				[SVGClassName]: {
					wrapper: {
						...response.svg?.[SVGClassName]?.wrapper,
						...{
							...getSVGWrapperBackgroundObject({
								...getGroupAttributes(
									props,
									'backgroundSVG',
									isHover
								),
								breakpoint,
								isHover,
							}),
						},
					},
					svg: {
						...response.svg?.[SVGClassName]?.svg,
						...{
							...getSVGBackgroundObject({
								...getGroupAttributes(
									props,
									'backgroundSVG',
									isHover
								),
								blockStyle,
								breakpoint,
								isHover,
							}),
						},
					},
				},
			};
		default:
			return {};
	}
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

	const response = getBasicResponseObject({
		isHover,
		prefix,
		blockStyle,
		...props,
	});

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
		const SVGClassName =
			activeMedia === 'svg'
				? getSVGClassName(
						getLastBreakpointAttribute(
							'background-svg-SVGElement',
							breakpoint,
							props,
							isHover
						)
				  )
				: null;

		const activeMediaContent = getResponseActiveMedia({
			target,
			activeMedia,
			response,
			isHover,
			prefix,
			blockStyle,
			breakpoint,
			SVGClassName,
			...props,
		});

		if (activeMedia === 'svg')
			response.svg = {
				...response.svg,
				[SVGClassName]: {
					...response.svg?.[SVGClassName],
					wrapper: {
						...response.svg?.[SVGClassName]?.wrapper,
						...activeMediaContent[SVGClassName].wrapper,
					},
					svg: {
						...response.svg?.[SVGClassName]?.svg,
						...activeMediaContent[SVGClassName].svg,
					},
				},
			};
		else
			response[activeMedia] = {
				...merge(
					{ ...response[activeMedia] },
					{ ...activeMediaContent }
				),
			};

		// Ensures different active medias to be visible
		if (
			currentActiveMedia &&
			currentActiveMedia !== 'layers' &&
			currentActiveMedia !== lastActiveMedia
		) {
			// Hide
			if (lastActiveMedia === 'svg')
				response.svg[
					getSVGClassName(
						getLastBreakpointAttribute(
							'background-svg-SVGElement',
							prevBreakpoint,
							props,
							isHover
						)
					)
				].wrapper[breakpoint] = {
					display: 'none',
				};
			else
				response[lastActiveMedia][breakpoint] = {
					...response[lastActiveMedia][breakpoint],
					display: 'none',
				};
			// Show
			if (activeMedia === 'svg')
				response.svg[SVGClassName].wrapper[breakpoint] = {
					...response.svg[[SVGClassName]].wrapper[breakpoint],
					display: 'block',
				};
			else
				response[activeMedia][breakpoint] = {
					...response[activeMedia][breakpoint],
					display: 'block',
				};
		} else if (breakpoint === 'general')
			if (currentActiveMedia === 'svg')
				response.svg[SVGClassName].wrapper.general = {
					...response.svg[SVGClassName].wrapper.general,
					display: 'block',
				};
			else
				response[activeMedia].general = {
					...response[activeMedia].general,
					display: 'block',
				};
	});

	return setTargetsToStyles(target, response);
};

export default getBackgroundStyles;
