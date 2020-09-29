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

	for (const [key, value] of Object.entries(boxShadow)) {
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
	}

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

		response[key].visibility = 'visible';
		if (!isEmpty(value.side)) {
			switch (value.side) {
				case 'top':
					response[key].bottom = '100%';
					break;
				case 'right':
					response[key].left = '100%';
					break;
				case 'bottom':
					response[key].top = '100%';
					break;
				case 'left':
					response[key].right = '0%';
					break;
				default:
					response[key].bottom = '100%';
					break;
			}
		}
		if (isNumber(value.position))
			switch (value.side) {
				case 'top':
					response[key].left = `${value.position}%`;
					break;
				case 'right':
					response[key].top = `${value.position}%`;
					break;
				case 'bottom':
					response[key].left = `${value.position}%`;
					break;
				case 'left':
					response[key].top = `${value.position}%`;
					break;
				default:
					response[key].left = '50%';
					break;
			}
		if (!isEmpty(value.color)) {
			switch (value.side) {
				case 'top':
					response[key][
						'border-color'
					] = `transparent transparent ${value.color} transparent`;
					break;
				case 'right':
					response[key][
						'border-color'
					] = `transparent transparent transparent ${value.color}`;
					break;
				case 'bottom':
					response[key][
						'border-color'
					] = `${value.color} transparent transparent transparent`;
					break;
				case 'left':
					response[key][
						'border-color'
					] = `transparent ${value.color} transparent transparent`;
					break;
				default:
					response[key][
						'border-color'
					] = `transparent transparent ${value.color} transparent`;
					break;
			}
		}
		if (isNumber(value.width) && isNumber(value.height)) {
			const width = `${value.width / 2}${value.widthUnit}`;
			const height = `${value.height}${value.heightUnit}`;

			switch (value.side) {
				case 'top':
					response[key][
						'border-width'
					] = `0 ${width} ${height} ${width}`;
					break;
				case 'right':
					response[key][
						'border-width'
					] = `${width} 0 ${width} ${height}`;
					break;
				case 'bottom':
					response[key][
						'border-width'
					] = `${height} ${width} 0 ${width}`;
					break;
				case 'left':
					response[key][
						'border-width'
					] = `${width} ${height} ${width} 0`;
					break;
				default:
					response[key][
						'border-width'
					] = `0 ${width} ${height} ${width}`;
					break;
			}
		}
	});

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

	if (!isEmpty(background.colorOptions.gradient))
		response.general.background = background.colorOptions.activeColor;
	if (!isEmpty(background.colorOptions.color))
		response.general['background-color'] =
			background.colorOptions.activeColor;
	if (!isEmpty(background.colorOptions.clipPath))
		response.general['clip-path'] = background.colorOptions.clipPath;

	return response;
};

export const getColorOverlayObject = background => {
	const response = {
		label: 'Overlay',
		general: {},
	};

	if (!isNil(background.overlayOptions.opacity))
		response.general.opacity =
			background.overlayOptions.opacity.general.opacity;

	if (!isEmpty(background.overlayOptions.color))
		response.general['background-color'] =
			background.overlayOptions.activeColor;

	if (!isEmpty(background.overlayOptions.gradient))
		response.general.background = background.overlayOptions.activeColor;

	return response;
};

export const getImageBackgroundObject = background => {
	const response = {
		label: background.label,
		general: {},
	};

	if (!isEmpty(background.clipPathImage))
		response.general['clip-path'] = background.clipPathImage;

	background.imageOptions.forEach(option => {
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

	if (!isNil(videoOptions.fill))
		response.general['object-fit'] = videoOptions.fill;

	if (!isNil(videoOptions.position))
		response.general['object-position'] = videoOptions.position;

	if (!isNil(videoOptions.width))
		response.general.width = `${videoOptions.width}${videoOptions.widthUnit}`;

	if (!isNil(videoOptions.height))
		response.general.height = `${videoOptions.height}${videoOptions.heightUnit}`;

	if (!isEmpty(videoOptions.clipPath))
		response.general['clip-path'] = videoOptions.clipPath;

	return response;
};

export const setBackgroundStyles = (target, background, backgroundHover) => {
	return {
		[`${target}>.maxi-background-displayer .maxi-background-displayer__overlay`]: {
			overlay: { ...getColorOverlayObject(JSON.parse(background)) },
		},
		[`${target}:hover>.maxi-background-displayer .maxi-background-displayer__overlay`]: {
			overlayHover: {
				...getColorOverlayObject(JSON.parse(backgroundHover)),
			},
		},
		[`${target}>.maxi-background-displayer .maxi-background-displayer__color`]: {
			background: { ...getColorBackgroundObject(JSON.parse(background)) },
		},
		[`${target}:hover>.maxi-background-displayer .maxi-background-displayer__color`]: {
			backgroundHover: {
				...getColorBackgroundObject(JSON.parse(backgroundHover)),
			},
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
		[`${target}>.maxi-background-displayer .maxi-background-displayer__video-player video`]: {
			videoBackground: {
				...getVideoBackgroundObject(
					JSON.parse(background).videoOptions
				),
			},
		},
		[`${target}:hover>.maxi-background-displayer .maxi-background-displayer__video-player video`]: {
			videoBackgroundHover: {
				...getVideoBackgroundObject(
					JSON.parse(backgroundHover).videoOptions
				),
			},
		},
	};
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
