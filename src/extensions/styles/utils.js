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
		if (key !== 'label') {
			let boxShadowString = '';
			isNumber(value.shadowHorizontal) &&
				(boxShadowString += `${value.shadowHorizontal}px `);
			isNumber(value.shadowVertical) &&
				(boxShadowString += `${value.shadowVertical}px `);
			isNumber(value.shadowBlur) &&
				(boxShadowString += `${value.shadowBlur}px `);
			isNumber(value.shadowSpread) &&
				(boxShadowString += `${value.shadowSpread}px `);
			!isNil(value.shadowColor) && (boxShadowString += value.shadowColor);
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

	if (!isEmpty(shapeDivider.colorOptions.color))
		response.general.fill = shapeDivider.colorOptions.color;

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
export const getColorBackgroundObject = background => {
	const response = {
		label: background.label,
		general: {},
	};

	if (!isNil(background.colorOptions.gradientOpacity.opacity))
		response.general.opacity =
			background.colorOptions.gradientOpacity.opacity.general.opacity;
	if (!isEmpty(background.colorOptions.gradient))
		response.general.background = background.colorOptions.activeColor;
	if (!isEmpty(background.colorOptions.color))
		response.general['background-color'] =
			background.colorOptions.activeColor;
	if (!isEmpty(background.colorOptions.clipPath))
		response.general['clip-path'] = background.colorOptions.clipPath;

	return response;
};

export const getColorOverlayObject = overlay => {
	const response = {
		label: 'Overlay',
		general: {},
	};

	if (!isNil(overlay.overlayOptions.gradientOpacity.opacity))
		response.general.opacity =
			overlay.overlayOptions.gradientOpacity.opacity.general.opacity;

	if (!isEmpty(overlay.overlayOptions.color))
		response.general['background-color'] =
			overlay.overlayOptions.activeColor;

	if (!isEmpty(overlay.overlayOptions.gradient))
		response.general.background = overlay.overlayOptions.activeColor;

	return response;
};

export const getImageBackgroundObject = background => {
	const response = {
		label: background.label,
		general: {},
	};

	const { imageOptions } = background;

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
			if (!isEmpty(background.colorOptions.gradient))
				response.general[
					'background-image'
				] = `${response.general['background-image']}, ${background.colorOptions.gradient}`;
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
			if (!isEmpty(background.colorOptions.gradient))
				response.general[
					'background-image'
				] = `${response.general['background-image']}, ${background.colorOptions.gradient}`;
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

export const setBackgroundStyles = (
	target,
	background,
	backgroundHover,
	overlay,
	overlayHover
) => {
	const response = {
		[`${target}>.maxi-background-displayer .maxi-background-displayer__color`]: {
			background: { ...getColorBackgroundObject(JSON.parse(background)) },
		},
		[`${target}>.maxi-background-displayer .maxi-background-displayer__images`]: {
			imageBackground: {
				...getImageBackgroundObject(JSON.parse(background)),
			},
		},
		[`${target}:hover>.maxi-background-displayer .maxi-background-displayer__images`]: {
			imageBackgroundHover: {
				...getImageBackgroundObject(JSON.parse(backgroundHover)),
			},
		},
		[`${target}>.maxi-background-displayer .maxi-background-displayer__video-player`]: {
			videoBackground: {
				...getVideoBackgroundObject(
					JSON.parse(background).videoOptions
				),
			},
		},

		[`${target}:hover>.maxi-background-displayer .maxi-background-displayer__video-player`]: {
			videoBackgroundHover: {
				...getVideoBackgroundObject(
					JSON.parse(backgroundHover).videoOptions
				),
			},
		},
		[`${target}>.maxi-background-displayer .maxi-background-displayer__svg`]: {
			SVGBackground: {
				...getSVGWrapperBackgroundObject(
					JSON.parse(background).SVGOptions
				),
			},
		},
		[`${target}>.maxi-background-displayer .maxi-background-displayer__svg svg`]: {
			SVGBackground: {
				...getSVGBackgroundObject(JSON.parse(background).SVGOptions),
			},
		},
	};

	if (!isNil(overlay)) {
		response[
			`${target}>.maxi-background-displayer .maxi-background-displayer__overlay`
		] = {
			overlay: { ...getColorOverlayObject(JSON.parse(overlay)) },
		};
	}

	if (JSON.parse(backgroundHover).status) {
		response[
			`${target}:hover>.maxi-background-displayer .maxi-background-displayer__color`
		] = {
			backgroundHover: {
				...getColorBackgroundObject(JSON.parse(backgroundHover)),
			},
		};
	} else {
		response[
			`${target}:hover>.maxi-background-displayer .maxi-background-displayer__color`
		] = {
			backgroundHover: {},
		};
	}

	if (!isNil(overlay) && !!JSON.parse(overlayHover).status) {
		response[
			`${target}:hover>.maxi-background-displayer .maxi-background-displayer__overlay`
		] = {
			overlayHover: {
				...getColorOverlayObject(JSON.parse(overlayHover)),
			},
		};
	} else {
		response[
			`${target}:hover>.maxi-background-displayer .maxi-background-displayer__overlay`
		] = {
			overlayHover: {},
		};
	}

	return response;
};

export const setTextCustomFormats = (target, typography, typographyHover) => {
	let response = {};

	const { customFormats } = JSON.parse(typography);
	const { customFormats: customFormatsHover } = JSON.parse(typographyHover);

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

		response[key].display = 'block';

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
		[`${target} .maxi-container-arrow`]: {
			arrow: { ...getArrowObject(JSON.parse(arrow)) },
			shadow: { ...getDropShadowObject(JSON.parse(boxShadow)) },
		},
		[`${target} .maxi-container-arrow:after`]: {
			background: { ...getArrowColorObject(JSON.parse(background)) },
		},
		[`${target} .maxi-container-arrow:before`]: {
			border: { ...getArrowBorderObject(JSON.parse(border)) },
		},
	};
};
