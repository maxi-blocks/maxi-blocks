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

export const getSVGWrapperBackgroundObject = SVGOptions => {
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

export const getSVGBackgroundObject = SVGOptions => {
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
		[`${target} > .maxi-background-displayer .maxi-background-displayer__color`]: {
			background: { ...getColorBackgroundObject(JSON.parse(background)) },
		},
		[`${target} > .maxi-background-displayer .maxi-background-displayer__images`]: {
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
