/**
 * Internal dependencies
 */
import getGroupAttributes from '../getGroupAttributes';
import getBorderStyles from './getBorderStyles';

/**
 * External dependencies
 */
import { isEmpty, isNil } from 'lodash';

/**
 * Clean BackgroundControl object for being delivered for styling
 *
 * @param {Object} background BackgroundControl related object
 *
 */
export const getColorBackgroundObject = ({
	isHover = false,
	prefix = '',
	...props
}) => {
	const response = {
		label: 'Background Color',
		general: {},
	};

	if (!isEmpty(props[`${prefix}background-color${isHover ? '-hover' : ''}`]))
		response.general['background-color'] =
			props[`${prefix}background-color${isHover ? '-hover' : ''}`];
	if (
		!isEmpty(
			props[
				`${prefix}background-color-clip-path${isHover ? '-hover' : ''}`
			]
		)
	)
		response.general['clip-path'] =
			props[
				`${prefix}background-color-clip-path${isHover ? '-hover' : ''}`
			];

	return response;
};

export const getGradientBackgroundObject = ({
	isHover = false,
	prefix = '',
	...props
}) => {
	const response = {
		label: 'Background Color',
		general: {},
	};

	if (
		!isNil(
			props[
				`${prefix}background-gradient-opacity${isHover ? '-hover' : ''}`
			]
		)
	)
		response.general.opacity =
			props[
				`${prefix}background-gradient-opacity${isHover ? '-hover' : ''}`
			];
	if (
		!isEmpty(
			props[`${prefix}background-gradient${isHover ? '-hover' : ''}`]
		)
	)
		response.general.background =
			props[`${prefix}background-gradient${isHover ? '-hover' : ''}`];
	if (
		!isEmpty(
			props[
				`${prefix}background-gradient-clip-path${
					isHover ? '-hover' : ''
				}`
			]
		)
	)
		response.general['clip-path'] =
			props[
				`${prefix}background-gradient-clip-path${
					isHover ? '-hover' : ''
				}`
			];

	return response;
};

export const getImageBackgroundObject = ({
	isHover = false,
	prefix = '',
	...props
}) => {
	const response = {
		label: 'Background Image',
		general: {},
	};

	if (
		isEmpty(
			props[
				`${prefix}background-image-mediaURL${isHover ? '-hover' : ''}`
			]
		)
	)
		return {};

	// Image
	if (
		props[`${prefix}background-image-size${isHover ? '-hover' : ''}`] ===
			'custom' &&
		!isNil(props['background-image-crop'])
	) {
		response.general[
			'background-image'
		] = `url('${props['background-image-crop'].image.source_url}')`;
	} else if (
		(props[`${prefix}background-image-size${isHover ? '-hover' : ''}`] ===
			'custom' &&
			isNil(props['background-image-crop'])) ||
		(props[`${prefix}background-image-size${isHover ? '-hover' : ''}`] !==
			'custom' &&
			!isNil(
				props[
					`${prefix}background-image-mediaURL${
						isHover ? '-hover' : ''
					}`
				]
			))
	) {
		response.general['background-image'] = `url('${
			props[
				`${prefix}background-image-mediaURL${isHover ? '-hover' : ''}`
			]
		}')`;
	}

	// Size
	if (
		props[`${prefix}background-image-size${isHover ? '-hover' : ''}`] !==
		'custom'
	) {
		if (!isNil(response.general['background-size']))
			response.general['background-size'] = `${
				response.general['background-size']
			},${
				props[
					`${prefix}background-image-size${isHover ? '-hover' : ''}`
				]
			}`;
		else
			response.general['background-size'] =
				props[
					`${prefix}background-image-size${isHover ? '-hover' : ''}`
				];
	} else if (!isNil(response.general['background-size']))
		response.general[
			'background-size'
		] = `${response.general['background-size']},cover`;
	else response.general['background-size'] = 'cover';

	// Repeat
	if (props[`${prefix}background-image-repeat${isHover ? '-hover' : ''}`]) {
		response.general['background-repeat'] =
			props[`${prefix}background-image-repeat${isHover ? '-hover' : ''}`];
	}

	// Position
	if (
		props[
			`${prefix}background-image-position${isHover ? '-hover' : ''}`
		] !== 'custom'
	)
		response.general['background-position'] =
			props[
				`${prefix}background-image-position${isHover ? '-hover' : ''}`
			];
	else
		response.general['background-position'] = `${
			props[
				`${prefix}background-image-position-width${
					isHover ? '-hover' : ''
				}`
			] +
			props[
				`background-image-position-width-unit${isHover ? '-hover' : ''}`
			]
		} ${
			props[
				`background-image-position-height${isHover ? '-hover' : ''}`
			] +
			props[
				`background-image-position-height-unit${
					isHover ? '-hover' : ''
				}`
			]
		}`;
	// Origin
	if (props[`${prefix}background-image-origin${isHover ? '-hover' : ''}`]) {
		response.general['background-origin'] =
			props[`${prefix}background-image-origin${isHover ? '-hover' : ''}`];
	}
	// Clip
	if (props[`${prefix}background-image-clip${isHover ? '-hover' : ''}`]) {
		response.general['background-clip'] =
			props[`${prefix}background-image-clip${isHover ? '-hover' : ''}`];
	}
	// Attachment
	if (
		props[`${prefix}background-image-attachment${isHover ? '-hover' : ''}`]
	) {
		if (!isNil(response.general['background-attachment']))
			response.general['background-attachment'] = `${
				response.general['background-attachment']
			},${
				props[
					`${prefix}background-image-attachment${
						isHover ? '-hover' : ''
					}`
				]
			}`;
		else
			response.general['background-attachment'] =
				props[
					`${prefix}background-image-attachment${
						isHover ? '-hover' : ''
					}`
				];
	}
	if (
		!isNil(
			props[`${prefix}background-image-opacity${isHover ? '-hover' : ''}`]
		)
	)
		response.general.opacity =
			props[
				`${prefix}background-image-opacity${isHover ? '-hover' : ''}`
			];

	if (
		!isEmpty(
			props[
				`${prefix}background-image-clip-path${isHover ? '-hover' : ''}`
			]
		)
	)
		response.general['clip-path'] =
			props[
				`${prefix}background-image-clip-path${isHover ? '-hover' : ''}`
			];

	return response;
};

export const getVideoBackgroundObject = ({
	isHover = false,
	prefix = '',
	...props
}) => {
	const response = {
		label: 'Video Background',
		general: {},
	};

	if (
		!isNil(
			props[`${prefix}background-video-opacity${isHover ? '-hover' : ''}`]
		)
	)
		response.general.opacity =
			props[
				`${prefix}background-video-opacity${isHover ? '-hover' : ''}`
			];

	if (
		!isEmpty(
			props[
				`${prefix}background-video-clip-path${isHover ? '-hover' : ''}`
			]
		)
	)
		response.general['clip-path'] =
			props[
				`${prefix}background-video-clip-path${isHover ? '-hover' : ''}`
			];

	if (
		!isEmpty(
			props[
				`${prefix}background-video-fallbackURL${
					isHover ? '-hover' : ''
				}`
			]
		)
	) {
		response.general.background = `url(${
			props[
				`${prefix}background-video-fallbackURL${
					isHover ? '-hover' : ''
				}`
			]
		})`;
		response.general['background-size'] = 'cover';
	}

	return response;
};

const getSVGWrapperBackgroundObject = SVGOptions => {
	const response = {
		label: 'SVG Wrapper Background',
		general: {},
	};

	if (SVGOptions['background-svg-size'])
		response.general.height = `${SVGOptions['background-svg-size']}${SVGOptions['background-svg-size--unit']}`;

	if (SVGOptions['background-svg-top'])
		response.general.top = `${SVGOptions['background-svg-top']}${SVGOptions['background-svg-top--unit']}`;

	if (SVGOptions['background-svg-left'])
		response.general.left = `${SVGOptions['background-svg-left']}${SVGOptions['background-svg-left--unit']}`;

	return response;
};

const getSVGBackgroundObject = SVGOptions => {
	const response = {
		label: 'SVG Background',
		general: {},
	};

	if (SVGOptions['background-svg-size'])
		response.general.height = `${SVGOptions['background-svg-size']}${SVGOptions['background-svg-size--unit']}`;

	return response;
};

const setBackgroundLayers = ({
	response,
	layers,
	target,
	isHover = false,
	prefix = '',
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
							...getColorBackgroundObject(
								getGroupAttributes(layer, 'backgroundColor')
							),
							prefix,
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
							prefix,
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
							prefix,
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
							prefix,
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
							prefix,
						},
					},
					[`${layerTarget} svg`]: {
						backgroundSVG: {
							...getSVGBackgroundObject(
								getGroupAttributes(layer, 'backgroundSVG')
							),
							prefix,
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

const getBackgroundStyles = ({
	target,
	isHover = false,
	prefix = '',
	groupAttrNames = {
		background: 'background',
		backgroundColor: 'backgroundColor',
		backgroundImage: 'backgroundImage',
		backgroundVideo: 'backgroundVideo',
		backgroundGradient: 'backgroundGradient',
		backgroundSVG: 'backgroundSVG',
		borderRadius: 'borderRadius',
	},
	...props
}) => {
	if (isHover && !props[`${prefix}background-status-hover`]) return {};

	let response = {
		[`${target}${isHover ? ':hover' : ''} > .maxi-background-displayer`]: {
			border: getBorderStyles({
				...getGroupAttributes(
					props,
					groupAttrNames.borderRadius,
					isHover
				),
			}),
		},
	};

	switch (
		props[`${prefix}background-active-media${isHover ? '-hover' : ''}`]
	) {
		case 'layers':
			if (
				props[`${prefix}background-layers${isHover ? '-hover' : ''}`] &&
				props[`${prefix}background-layers${isHover ? '-hover' : ''}`]
					.length > 0
			) {
				response = setBackgroundLayers({
					response,
					layers:
						props[
							`${prefix}background-layers${
								isHover ? '-hover' : ''
							}`
						],
					target,
					isHover,
					prefix,
				});
			}
			break;
		case 'color':
			response[
				`${target}${
					isHover ? ':hover' : ''
				} > .maxi-background-displayer .maxi-background-displayer__color`
			] = {
				background: {
					...getColorBackgroundObject({
						...getGroupAttributes(
							props,
							groupAttrNames.backgroundColor,
							isHover
						),
						isHover,
						prefix,
					}),
				},
			};
			break;
		case 'image':
			response[
				`${target}${
					isHover ? ':hover' : ''
				} > .maxi-background-displayer .maxi-background-displayer__images`
			] = {
				imageBackground: {
					...getImageBackgroundObject({
						...getGroupAttributes(
							props,
							groupAttrNames.backgroundImage,
							isHover
						),
						isHover,
						prefix,
					}),
				},
			};
			break;
		case 'video':
			response[
				`${target}${
					isHover ? ':hover' : ''
				} > .maxi-background-displayer .maxi-background-displayer__video-player`
			] = {
				videoBackground: {
					...getVideoBackgroundObject({
						...getGroupAttributes(
							props,
							groupAttrNames.backgroundVideo,
							isHover
						),
						isHover,
						prefix,
					}),
				},
			};
			break;
		case 'gradient':
			response[
				`${target}${
					isHover ? ':hover' : ''
				} > .maxi-background-displayer .maxi-background-displayer__color`
			] = {
				background: {
					...getGradientBackgroundObject({
						...getGroupAttributes(
							props,
							groupAttrNames.backgroundGradient,
							isHover
						),
						isHover,
						prefix,
					}),
				},
			};
			break;
		case 'svg':
			response[
				`${target}${
					isHover ? ':hover' : ''
				} > .maxi-background-displayer .maxi-background-displayer__svg`
			] = {
				SVGBackground: {
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
			};
			response[
				`${target}${
					isHover ? ':hover' : ''
				} > .maxi-background-displayer .maxi-background-displayer__svg svg`
			] = {
				SVGBackground: {
					...getSVGBackgroundObject({
						...getGroupAttributes(
							props,
							groupAttrNames.backgroundSVG,
							isHover
						),
						isHover,
						prefix,
					}),
				},
			};
			break;
		default:
			break;
	}

	return response;
};

export default getBackgroundStyles;
