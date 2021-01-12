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
export const getColorBackgroundObject = ({ isHover = false, ...props }) => {
	const response = {
		label: 'Background Color',
		general: {},
	};

	if (!isEmpty(props[`background-color${isHover ? '-hover' : ''}`]))
		response.general['background-color'] =
			props[`background-color${isHover ? '-hover' : ''}`];
	if (!isEmpty(props[`background-color-clip-path${isHover ? '-hover' : ''}`]))
		response.general['clip-path'] =
			props[`background-color-clip-path${isHover ? '-hover' : ''}`];

	return response;
};

export const getGradientBackgroundObject = ({ isHover = false, ...props }) => {
	const response = {
		label: 'Background Color',
		general: {},
	};

	if (!isNil(props[`background-gradient-opacity${isHover ? '-hover' : ''}`]))
		response.general.opacity =
			props[`background-gradient-opacity${isHover ? '-hover' : ''}`];
	if (!isEmpty(props[`background-gradient${isHover ? '-hover' : ''}`]))
		response.general.background =
			props[`background-gradient${isHover ? '-hover' : ''}`];
	if (
		!isEmpty(
			props[`background-gradient-clip-path${isHover ? '-hover' : ''}`]
		)
	)
		response.general['clip-path'] =
			props[`background-gradient-clip-path${isHover ? '-hover' : ''}`];

	return response;
};

export const getImageBackgroundObject = ({ isHover = false, ...props }) => {
	const response = {
		label: 'Background Image',
		general: {},
	};

	if (isEmpty(props[`background-image-mediaURL${isHover ? '-hover' : ''}`]))
		return {};

	// Image
	if (
		props[`background-image-size${isHover ? '-hover' : ''}`] === 'custom' &&
		!isNil(props['background-image-crop'])
	) {
		response.general[
			'background-image'
		] = `url('${props['background-image-crop'].image.source_url}')`;
	} else if (
		(props[`background-image-size${isHover ? '-hover' : ''}`] ===
			'custom' &&
			isNil(props['background-image-crop'])) ||
		(props[`background-image-size${isHover ? '-hover' : ''}`] !==
			'custom' &&
			!isNil(
				props[`background-image-mediaURL${isHover ? '-hover' : ''}`]
			))
	) {
		response.general['background-image'] = `url('${
			props[`background-image-mediaURL${isHover ? '-hover' : ''}`]
		}')`;
	}

	// Size
	if (props[`background-image-size${isHover ? '-hover' : ''}`] !== 'custom') {
		if (!isNil(response.general['background-size']))
			response.general['background-size'] = `${
				response.general['background-size']
			},${props[`background-image-size${isHover ? '-hover' : ''}`]}`;
		else
			response.general['background-size'] =
				props[`background-image-size${isHover ? '-hover' : ''}`];
	} else if (!isNil(response.general['background-size']))
		response.general[
			'background-size'
		] = `${response.general['background-size']},cover`;
	else response.general['background-size'] = 'cover';

	// Repeat
	if (props[`background-image-repeat${isHover ? '-hover' : ''}`]) {
		response.general['background-repeat'] =
			props[`background-image-repeat${isHover ? '-hover' : ''}`];
	}

	// Position
	if (
		props[`background-image-position${isHover ? '-hover' : ''}`] !==
		'custom'
	)
		response.general['background-position'] =
			props[`background-image-position${isHover ? '-hover' : ''}`];
	else
		response.general['background-position'] = `${
			props[`background-image-position-width${isHover ? '-hover' : ''}`] +
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
	if (props[`background-image-origin${isHover ? '-hover' : ''}`]) {
		response.general['background-origin'] =
			props[`background-image-origin${isHover ? '-hover' : ''}`];
	}
	// Clip
	if (props[`background-image-clip${isHover ? '-hover' : ''}`]) {
		response.general['background-clip'] =
			props[`background-image-clip${isHover ? '-hover' : ''}`];
	}
	// Attachment
	if (props[`background-image-attachment${isHover ? '-hover' : ''}`]) {
		if (!isNil(response.general['background-attachment']))
			response.general['background-attachment'] = `${
				response.general['background-attachment']
			},${
				props[`background-image-attachment${isHover ? '-hover' : ''}`]
			}`;
		else
			response.general['background-attachment'] =
				props[`background-image-attachment${isHover ? '-hover' : ''}`];
	}
	if (!isNil(props[`background-image-opacity${isHover ? '-hover' : ''}`]))
		response.general.opacity =
			props[`background-image-opacity${isHover ? '-hover' : ''}`];

	if (!isEmpty(props[`background-image-clip-path${isHover ? '-hover' : ''}`]))
		response.general['clip-path'] =
			props[`background-image-clip-path${isHover ? '-hover' : ''}`];

	return response;
};

export const getVideoBackgroundObject = ({ isHover = false, ...props }) => {
	const response = {
		label: 'Video Background',
		general: {},
	};

	if (!isNil(props[`background-video-opacity${isHover ? '-hover' : ''}`]))
		response.general.opacity =
			props[`background-video-opacity${isHover ? '-hover' : ''}`];

	if (!isEmpty(props[`background-video-clip-path${isHover ? '-hover' : ''}`]))
		response.general['clip-path'] =
			props[`background-video-clip-path${isHover ? '-hover' : ''}`];

	if (
		!isEmpty(
			props[`background-video-fallbackURL${isHover ? '-hover' : ''}`]
		)
	) {
		response.general.background = `url(${
			props[`background-video-fallbackURL${isHover ? '-hover' : ''}`]
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

const setBackgroundLayers = (response, layers, target, isHover = false) => {
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
								// isHover
							),
						},
					},
				});
				break;
			case 'gradient':
				Object.assign(response, {
					[layerTarget]: {
						backgroundGradient: {
							...getColorBackgroundObject(
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
					[`${layerTarget} svg`]: {
						backgroundSVG: {
							...getSVGBackgroundObject(
								getGroupAttributes(layer, 'backgroundSVG')
							),
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

const getBackgroundStyles = ({ target, isHover = false, ...props }) => {
	let response = {
		[`${target}${isHover ? ':hover' : ''} > .maxi-background-displayer`]: {
			border: getBorderStyles({
				...getGroupAttributes(props, 'borderRadius', isHover),
			}),
		},
	};

	switch (props[`background-active-media${isHover ? '-hover' : ''}`]) {
		case 'layers':
			if (
				props[`background-layers${isHover ? '-hover' : ''}`] &&
				props[`background-layers${isHover ? '-hover' : ''}`].length > 0
			) {
				response = setBackgroundLayers(
					response,
					props[`background-layers${isHover ? '-hover' : ''}`],
					target,
					isHover
				);
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
							'backgroundColor',
							isHover
						),
						isHover,
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
					...getImageBackgroundObject(
						getGroupAttributes(props, 'backgroundImage', isHover),
						isHover
					),
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
					...getVideoBackgroundObject(
						getGroupAttributes(props, 'backgroundVideo', isHover),
						isHover
					),
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
					...getGradientBackgroundObject(
						getGroupAttributes(
							props,
							'backgroundGradient',
							isHover
						),
						isHover
					),
				},
			};
			break;
		case 'shape':
			response[
				`${target}${
					isHover ? ':hover' : ''
				} > .maxi-background-displayer .maxi-background-displayer__svg`
			] = {
				SVGBackground: {
					...getSVGWrapperBackgroundObject(
						getGroupAttributes(props, 'backgroundSVG', isHover),
						isHover
					),
				},
			};
			response[
				`${target}${
					isHover ? ':hover' : ''
				} > .maxi-background-displayer .maxi-background-displayer__svg svg`
			] = {
				SVGBackground: {
					...getSVGBackgroundObject(
						getGroupAttributes(props, 'backgroundSVG', isHover),
						isHover
					),
				},
			};
			break;
		default:
			break;
	}

	return response;
};

export default getBackgroundStyles;
