/**
 * Some ESLint deactivated rules. This file needs to be refactored
 */
/* eslint-disable no-continue */

/**
 * WordPress dependencies
 */
const { select } = wp.data;
const { getBlockAttributes } = wp.blocks;

/**
 * External dependencies
 */
import { isEmpty, isNil, isNumber, isString } from 'lodash';

/**
 * Returns default property of the block
 *
 * @param {string} clientId Block's client id
 * @param {string} prop Claimed property to return
 */
export const getDefaultProp = (clientId, prop) => {
	const { getBlockName, getSelectedBlockClientId } = select(
		'core/block-editor'
	);
	const blockName = clientId
		? getBlockName(clientId)
		: getBlockName(getSelectedBlockClientId());

	if (prop) return getBlockAttributes(blockName)[prop];
	return getBlockAttributes(blockName);
};

/**
 * Gets an object base on Maxi Blocks breakpoints schema and looks for the last set value
 * for a concrete property in case is not set for the requested breakpoint
 */
export const getLastBreakpointValue = (obj, prop, breakpoint = 'general') => {
	if (!isNil(obj[breakpoint][prop]) && !isEmpty(obj[breakpoint][prop]))
		return obj[breakpoint][prop];
	if (!isNil(obj[breakpoint][prop]) && isNumber(obj[breakpoint][prop]))
		return obj[breakpoint][prop];

	const objectKeys = Object.keys(obj);
	const breakpointIndex = objectKeys.indexOf(breakpoint) - 1;

	if (breakpointIndex === 0) return obj[breakpoint][prop];

	let i = breakpointIndex;

	do {
		if (
			!isNil(obj[objectKeys[i]][prop]) &&
			!isEmpty(obj[objectKeys[i]][prop])
		)
			return obj[objectKeys[i]][prop];
		if (
			!isNil(obj[objectKeys[i]][prop]) &&
			isNumber(obj[objectKeys[i]][prop])
		)
			return obj[objectKeys[i]][prop];
		i -= 1;
	} while (i > 0);

	return obj[breakpoint][prop];
};

export const getDropShadowObject = boxShadow => {
	const response = {
		label: 'Drop Shadow',
		general: {},
		xxl: {},
		xl: {},
		l: {},
		m: {},
		s: {},
		xs: {},
	};

	Object.entries(boxShadow).forEach(([key, value]) => {
		if (key !== 'label') {
			let boxShadowString = '';
			isNumber(value.shadowHorizontal) &&
				(boxShadowString += `${value.shadowHorizontal}px `);
			isNumber(value.shadowVertical) &&
				(boxShadowString += `${value.shadowVertical}px `);
			isNumber(value.shadowBlur) &&
				(boxShadowString += `${value.shadowBlur}px `);
			!isNil(value.shadowColor) && (boxShadowString += value.shadowColor);

			response[key].filter = `drop-shadow(${boxShadowString.trim()})`;
		}
	});

	return response;
};

export const getBoxShadowObject = boxShadow => {
	const response = {
		label: boxShadow.label,
		general: {},
		xxl: {},
		xl: {},
		l: {},
		m: {},
		s: {},
		xs: {},
	};

	Object.entries(boxShadow).forEach(([key, value]) => {
		if (key !== 'label' && key !== 'status') {
			let boxShadowString = '';

			if (value.shadowHorizontal !== '') {
				isNumber(value.shadowHorizontal) &&
					(boxShadowString += `${value.shadowHorizontal}px `);
			} else {
				boxShadowString += '0 ';
			}

			if (value.shadowVertical !== '') {
				isNumber(value.shadowVertical) &&
					(boxShadowString += `${value.shadowVertical}px `);
			} else {
				boxShadowString += '0 ';
			}

			if (value.shadowBlur !== '') {
				isNumber(value.shadowBlur) &&
					(boxShadowString += `${value.shadowBlur}px `);
			} else {
				boxShadowString += '0 ';
			}

			if (value.shadowSpread !== '') {
				isNumber(value.shadowSpread) &&
					(boxShadowString += `${value.shadowSpread}px `);
			} else {
				boxShadowString += '0 ';
			}

			!isNil(value.shadowColor) && (boxShadowString += value.shadowColor);

			if (
				value.shadowHorizontal !== '' ||
				value.shadowVertical !== '' ||
				value.shadowBlur !== '' ||
				value.shadowSpread !== ''
			)
				response[key]['box-shadow'] = boxShadowString.trim();
		}
	});

	return response;
};

export const getAlignmentTextObject = alignment => {
	const response = {
		label: alignment.label,
		general: {},
		xxl: {},
		xl: {},
		l: {},
		m: {},
		s: {},
		xs: {},
	};

	Object.entries(alignment).forEach(([key, value]) => {
		if (!isNil(value.alignment)) {
			switch (value.alignment) {
				case 'left':
					response[key]['text-align'] = 'left';
					break;
				case 'center':
					response[key]['text-align'] = 'center';
					break;
				case 'right':
					response[key]['text-align'] = 'right';
					break;
				case 'justify':
					response[key]['text-align'] = 'justify';
					break;
				default:
					return false;
			}
		}

		return false;
	});

	return response;
};

export const getAlignmentFlexObject = alignment => {
	const response = {
		label: alignment.label,
		general: {},
		xxl: {},
		xl: {},
		l: {},
		m: {},
		s: {},
		xs: {},
	};

	Object.entries(alignment).forEach(([key, value]) => {
		if (!isNil(value.alignment)) {
			switch (value.alignment) {
				case 'left':
					response[key]['align-items'] = 'flex-start';
					break;
				case 'center':
				case 'justify':
					response[key]['align-items'] = 'center';
					break;
				case 'right':
					response[key]['align-items'] = 'flex-end';
					break;
				default:
					return false;
			}
		}

		return false;
	});

	return response;
};

export const getOpacityObject = opacity => {
	const response = {
		label: opacity.label,
		general: {},
		xxl: {},
		xl: {},
		l: {},
		m: {},
		s: {},
		xs: {},
	};

	Object.entries(opacity).forEach(([key, value]) => {
		if (isNumber(value.opacity)) {
			response[key].opacity = value.opacity;
		}
	});

	return response;
};

export const getColumnSizeObject = columnSize => {
	const response = {
		label: columnSize.label,
		general: {},
		xxl: {},
		xl: {},
		l: {},
		m: {},
		s: {},
		xs: {},
	};

	Object.entries(columnSize).forEach(([key, value]) => {
		if (isNumber(value.size)) {
			response[key].width = `${value.size}%`;
			response[key]['flex-basis'] = `${value.size}%`;
		}
	});

	return response;
};

export const getShapeDividerObject = shapeDivider => {
	const response = {
		label: 'Shape Divider',
		general: {},
	};

	if (!isNil(shapeDivider.opacity))
		response.general.opacity = shapeDivider.opacity.general.opacity;

	if (!isNil(shapeDivider.height))
		response.general.height = `${shapeDivider.height}${shapeDivider.heightUnit}`;

	return response;
};

export const getShapeDividerSVGObject = shapeDivider => {
	const response = {
		label: 'Shape Divider SVG',
		general: {},
	};

	const { background } = shapeDivider;

	if (!isEmpty(background.colorOptions.color))
		response.general.fill = background.colorOptions.color;

	return response;
};

export const getTransformObject = transform => {
	const response = {
		label: 'Transform',
		general: {
			transform: '',
			'transform-origin': '',
		},
		xxl: {
			transform: '',
			'transform-origin': '',
		},
		xl: {
			transform: '',
			'transform-origin': '',
		},
		l: {
			transform: '',
			'transform-origin': '',
		},
		m: {
			transform: '',
			'transform-origin': '',
		},
		s: {
			transform: '',
			'transform-origin': '',
		},
		xs: {
			transform: '',
			'transform-origin': '',
		},
	};

	Object.keys(transform).forEach(key => {
		if (key === 'label') return;

		if (isNumber(getLastBreakpointValue(transform, 'scaleX', key)))
			response[key].transform += `scaleX(${
				getLastBreakpointValue(transform, 'scaleX', key) / 100
			}) `;
		if (isNumber(getLastBreakpointValue(transform, 'scaleY', key)))
			response[key].transform += `scaleY(${
				getLastBreakpointValue(transform, 'scaleY', key) / 100
			}) `;
		if (isNumber(getLastBreakpointValue(transform, 'translateX', key)))
			response[key].transform += `translateX(${getLastBreakpointValue(
				transform,
				'translateX',
				key
			)}${getLastBreakpointValue(transform, 'translateXUnit', key)}) `;
		if (isNumber(getLastBreakpointValue(transform, 'translateY', key)))
			response[key].transform += `translateY(${getLastBreakpointValue(
				transform,
				'translateY',
				key
			)}${getLastBreakpointValue(transform, 'translateYUnit', key)}) `;
		if (isNumber(getLastBreakpointValue(transform, 'rotateX', key)))
			response[key].transform += `rotateX(${getLastBreakpointValue(
				transform,
				'rotateX',
				key
			)}deg) `;
		if (isNumber(getLastBreakpointValue(transform, 'rotateY', key)))
			response[key].transform += `rotateY(${getLastBreakpointValue(
				transform,
				'rotateY',
				key
			)}deg) `;
		if (isNumber(getLastBreakpointValue(transform, 'rotateZ', key)))
			response[key].transform += `rotateZ(${getLastBreakpointValue(
				transform,
				'rotateZ',
				key
			)}deg) `;
		if (isNumber(getLastBreakpointValue(transform, 'originX', key)))
			response[key]['transform-origin'] += `${getLastBreakpointValue(
				transform,
				'originX',
				key
			)}% `;
		if (isNumber(getLastBreakpointValue(transform, 'originY', key)))
			response[key]['transform-origin'] += `${getLastBreakpointValue(
				transform,
				'originY',
				key
			)}% `;
		if (isString(getLastBreakpointValue(transform, 'originX', key)))
			response[key]['transform-origin'] += `${getLastBreakpointValue(
				transform,
				'originX',
				key
			)} `;
		if (isString(getLastBreakpointValue(transform, 'originY', key)))
			response[key]['transform-origin'] += `${getLastBreakpointValue(
				transform,
				'originY',
				key
			)} `;
	});

	return response;
};

/**
 * Clean BackgroundControl object for being delivered for styling
 *
 * @param {Object} background BackgroundControl related object
 *
 */
export const getColorBackgroundObject = colorOptions => {
	const response = {
		label: 'Background Color',
		general: {},
	};

	if (
		!isNil(colorOptions.gradientOpacity) &&
		!isNil(colorOptions.gradientOpacity.opacity)
	)
		response.general.opacity =
			colorOptions.gradientOpacity.opacity.general.opacity;
	if (!isEmpty(colorOptions.gradient))
		response.general.background = colorOptions.activeColor;
	if (!isEmpty(colorOptions.color))
		response.general['background-color'] = colorOptions.activeColor;
	if (!isEmpty(colorOptions.clipPath))
		response.general['clip-path'] = colorOptions.clipPath;

	return response;
};

export const getImageBackgroundObject = imageOptions => {
	const response = {
		label: 'Background Image',
		general: {},
	};

	if (!isNil(imageOptions.opacity))
		response.general.opacity = imageOptions.opacity.general.opacity;

	if (!isEmpty(imageOptions.clipPath))
		response.general['clip-path'] = imageOptions.clipPath;

	imageOptions.items.forEach(option => {
		if (isNil(option) || isEmpty(option.imageData.mediaURL)) return;
		// Image
		if (
			option.sizeSettings.size === 'custom' &&
			!isNil(option.imageData.cropOptions)
		) {
			if (!isNil(response.general['background-image']))
				response.general[
					'background-image'
				] = `${response.general['background-image']},url('${option.imageData.cropOptions.image.source_url}')`;
			else
				response.general[
					'background-image'
				] = `url('${option.imageData.cropOptions.image.source_url}')`;
		} else if (
			(option.sizeSettings.size === 'custom' &&
				isNil(option.imageData.cropOptions)) ||
			(option.sizeSettings.size !== 'custom' &&
				!isNil(option.imageData.mediaURL))
		) {
			if (!isNil(response.general['background-image']))
				response.general[
					'background-image'
				] = `${response.general['background-image']},url('${option.imageData.mediaURL}')`;
			else
				response.general[
					'background-image'
				] = `url('${option.imageData.mediaURL}')`;
		}
		// Size
		if (option.sizeSettings.size !== 'custom') {
			if (!isNil(response.general['background-size']))
				response.general[
					'background-size'
				] = `${response.general['background-size']},${option.sizeSettings.size}`;
			else response.general['background-size'] = option.sizeSettings.size;
		} else if (!isNil(response.general['background-size']))
			response.general[
				'background-size'
			] = `${response.general['background-size']},cover`;
		else response.general['background-size'] = 'cover';
		// Repeat
		if (option.repeat) {
			if (!isNil(response.general['background-repeat']))
				response.general[
					'background-repeat'
				] = `${response.general['background-repeat']},${option.repeat}`;
			else response.general['background-repeat'] = option.repeat;
		}
		// Position
		if (option.positionOptions.position !== 'custom') {
			if (!isNil(response.general['background-position']))
				response.general[
					'background-position'
				] = `${response.general['background-position']},${option.positionOptions.position}`;
			else
				response.general['background-position'] =
					option.positionOptions.position;
		} else if (!isNil(response.general['background-position']))
			response.general['background-position'] = `
                        ${response.general['background-position']},
                        ${
							option.positionOptions.width +
							option.positionOptions.widthUnit
						} ${
				option.positionOptions.height +
				option.positionOptions.heightUnit
			}`;
		else
			response.general['background-position'] = `${
				option.positionOptions.width + option.positionOptions.widthUnit
			} ${
				option.positionOptions.height +
				option.positionOptions.heightUnit
			}`;
		// Origin
		if (option.origin) {
			if (!isNil(response.general['background-origin']))
				response.general[
					'background-origin'
				] = `${response.general['background-origin']},${option.origin}`;
			else response.general['background-origin'] = option.origin;
		}
		// Clip
		if (option.clip) {
			if (!isNil(response.general['background-clip']))
				response.general[
					'background-clip'
				] = `${response.general['background-clip']},${option.clip}`;
			else response.general['background-clip'] = option.clip;
		}
		// Attachment
		if (option.attachment) {
			if (!isNil(response.general['background-attachment']))
				response.general[
					'background-attachment'
				] = `${response.general['background-attachment']},${option.attachment}`;
			else response.general['background-attachment'] = option.attachment;
		}
	});

	return response;
};

export const getVideoBackgroundObject = videoOptions => {
	const response = {
		label: 'Video Background',
		general: {},
	};

	if (!isNil(videoOptions.opacity))
		response.general.opacity = videoOptions.opacity.general.opacity;

	if (!isEmpty(videoOptions.clipPath))
		response.general['clip-path'] = videoOptions.clipPath;

	if (!isEmpty(videoOptions.fallbackURL)) {
		response.general.background = `url(${videoOptions.fallbackURL})`;
		response.general['background-size'] = 'cover';
	}

	return response;
};

const getSVGWrapperBackgroundObject = SVGOptions => {
	const response = {
		label: 'SVG Wrapper Background',
		general: {},
	};

	if (SVGOptions.position)
		response.general = {
			...response.general,
			...SVGOptions.position.general,
		};
	if (SVGOptions.size)
		response.general = { ...response.general, ...SVGOptions.size.general };

	return response;
};

const getSVGBackgroundObject = SVGOptions => {
	const response = {
		label: 'SVG Background',
		general: {},
	};

	if (SVGOptions.size) response.general.height = `${SVGOptions.size}%`;

	return response;
};

const setBackgroundLayers = (
	response,
	backgourndLayers,
	backgourndHoverlayers,
	hoverStatus,
	target
) => {
	backgourndHoverlayers.layers.forEach(layer => {
		const layerHoverTarget = `${target}:hover > .maxi-background-displayer .maxi-background-displayer__${layer.id}`;

		switch (layer.type) {
			case 'color':
			case 'gradient':
				hoverStatus && backgourndHoverlayers.status
					? (response[layerHoverTarget] = {
							backgroundHover: {
								...getColorBackgroundObject(layer.options),
							},
					  })
					: (response[layerHoverTarget] = {
							backgroundHover: {},
					  });

				break;
			default:
				break;
		}
	});

	backgourndLayers.layers.forEach(layer => {
		const layerTarget = `${target} > .maxi-background-displayer .maxi-background-displayer__${layer.id}`;

		switch (layer.type) {
			case 'color':
			case 'gradient':
				Object.assign(response, {
					[layerTarget]: {
						background: {
							...getColorBackgroundObject(layer.options),
						},
					},
				});
				break;
			case 'image':
				Object.assign(response, {
					[layerTarget]: {
						imageBackground: {
							...getImageBackgroundObject(layer.options),
						},
					},
				});
				break;
			case 'video':
				Object.assign(response, {
					[layerTarget]: {
						videoBackground: {
							...getVideoBackgroundObject(layer.options),
						},
					},
				});
				break;
			case 'shape':
				Object.assign(response, {
					[layerTarget]: {
						SVGBackground: {
							...getSVGWrapperBackgroundObject(layer.options),
						},
					},
					[`${layerTarget} svg`]: {
						SVGBackground: {
							...getSVGBackgroundObject(layer.options),
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

export const setBackgroundStyles = ({
	target,
	background,
	backgroundHover,
}) => {
	let response = {};
	if (backgroundHover.status) {
		response[
			`${target}:hover > .maxi-background-displayer .maxi-background-displayer__color`
		] = {
			backgroundHover: {
				...getColorBackgroundObject(backgroundHover.colorOptions),
			},
		};
	} else {
		response[
			`${target}:hover > .maxi-background-displayer .maxi-background-displayer__color`
		] = {
			backgroundHover: {},
		};
	}
	if (background.layersOptions && !!background.layersOptions.status) {
		response = setBackgroundLayers(
			response,
			background.layersOptions,
			backgroundHover.layersOptions,
			backgroundHover.status,
			target
		);
	} else {
		response = Object.assign(response, {
			[`${target} > .maxi-background-displayer .maxi-background-displayer__color`]: {
				background: {
					...getColorBackgroundObject(background.colorOptions),
				},
			},
			[`${target} > .maxi-background-displayer .maxi-background-displayer__images`]: {
				imageBackground: {
					...getImageBackgroundObject(background.imageOptions),
				},
			},
			[`${target} > .maxi-background-displayer .maxi-background-displayer__video-player`]: {
				videoBackground: {
					...getVideoBackgroundObject(background.videoOptions),
				},
			},
			[`${target} > .maxi-background-displayer .maxi-background-displayer__svg`]: {
				SVGBackground: {
					...getSVGWrapperBackgroundObject(background.SVGOptions),
				},
			},
			[`${target} > .maxi-background-displayer .maxi-background-displayer__svg svg`]: {
				SVGBackground: {
					...getSVGBackgroundObject(background.SVGOptions),
				},
			},
		});
	}

	return response;
};

export const setTextCustomFormats = (target, typography, typographyHover) => {
	let response = {};

	const { customFormats } = typography;
	const { customFormats: customFormatsHover } = typographyHover;

	customFormats &&
		Object.entries(customFormats).forEach(([key, value]) => {
			target.forEach(el => {
				const format = {
					[`${el} .${key}`]: {
						customFormat: value,
					},
					[`${el} .${key} *`]: {
						customFormat: value,
					},
				};

				response = Object.assign(response, format);
			});
		});
	customFormatsHover &&
		Object.entries(customFormatsHover).forEach(([key, value]) => {
			target.forEach(el => {
				const format = {
					[`${el} .${key}:hover`]: {
						customFormat: value,
					},
					[`${el} .${key}:hover *`]: {
						customFormat: value,
					},
				};

				response = Object.assign(response, format);
			});
		});

	return response;
};

export const getArrowBorderObject = border => {
	const response = {
		label: 'Arrow Border',
		general: {},
	};

	if (!isEmpty(border.general['border-color']))
		response.general.background = border.general['border-color'];
	if (border.borderWidth.general['border-bottom-width'] !== '') {
		response.general.top = `calc(${
			border.borderWidth.general['border-bottom-width'] / 2
		}${border.borderWidth.general.unit})`;
		response.general.left = `calc(${
			border.borderWidth.general['border-bottom-width'] / 2
		}${border.borderWidth.general.unit})`;
		response.general.width = `calc(50% + ${
			border.borderWidth.general['border-bottom-width'] * 2
		}${border.borderWidth.general.unit})`;
		response.general.height = `calc(50% + ${
			border.borderWidth.general['border-bottom-width'] * 2
		}${border.borderWidth.general.unit})`;
	}

	return response;
};

export const getArrowObject = arrow => {
	const response = {
		label: arrow.label,
		general: {},
		xxl: {},
		xl: {},
		l: {},
		m: {},
		s: {},
		xs: {},
	};

	if (!arrow.active) return response;

	Object.entries(arrow).forEach(([key, value]) => {
		if (key === 'label' || key === 'active') return;

		const width = `${value.width}${value.widthUnit}`;

		response[key].display = 'block';
		response[key].width = `${width}`;
		response[key].height = `${width}`;

		if (value.side === 'top') {
			response[key].left = `${value.position}%`;
			response[key].top = `-${(Math.sqrt(2) * value.width) / 2}${
				value.widthUnit
			}`;
		}
		if (value.side === 'right') {
			response[key].top = `${value.position}%`;
			response[key].left = `calc(100% + ${Math.floor(
				(Math.sqrt(2) * value.width) / 2
			)}${value.widthUnit})`;
		}
		if (value.side === 'bottom') {
			response[key].left = `${value.position}%`;
			response[key].top = `calc(100% + ${Math.floor(
				(Math.sqrt(2) * value.width) / 2
			)}${value.widthUnit})`;
		}
		if (value.side === 'left') {
			response[key].top = `${value.position}%`;
			response[key].left = `-${Math.floor(
				(Math.sqrt(2) * value.width) / 2
			)}${value.widthUnit}`;
		}
	});

	return response;
};

export const getArrowColorObject = background => {
	const response = {
		label: 'Arrow Color',
		general: {},
	};

	if (!isEmpty(background.colorOptions.gradient))
		response.general.background = background.colorOptions.activeColor;
	if (!isEmpty(background.colorOptions.color))
		response.general['background-color'] =
			background.colorOptions.activeColor;

	return response;
};

export const setArrowStyles = (
	target,
	arrow,
	background,
	border,
	boxShadow
) => {
	return {
		[`${target} > .maxi-container-arrow`]: {
			arrow: { ...getArrowObject(arrow) },
			shadow: { ...getDropShadowObject(boxShadow) },
		},
		[`${target} > .maxi-container-arrow:after`]: {
			background: { ...getArrowColorObject(background) },
		},
		[`${target} > .maxi-container-arrow:before`]: {
			border: { ...getArrowBorderObject(border) },
		},
	};
};

export const getIconObject = icon => {
	const response = {
		label: icon.label,
		general: {},
		xxl: {},
		xl: {},
		l: {},
		m: {},
		s: {},
		xs: {},
	};

	Object.entries(icon).forEach(([key, value]) => {
		if (['label', 'position', 'icon', 'customPadding'].includes(key))
			return;

		if (value['font-size']) {
			response[key]['font-size'] =
				value['font-size'] + value['font-sizeUnit'];
		}

		if (value.color) {
			response[key].color = value.color;
		}

		if (value.spacing) {
			if (icon.position === 'left') {
				response[key]['margin-right'] = `${value.spacing}px`;
			}

			if (icon.position === 'right') {
				response[key]['margin-left'] = `${value.spacing}px`;
			}
		}
	});
	return response;
};
