/**
 * External dependencies
 */
import classnames from 'classnames';

export const getImageResizerClassName = captionType =>
	classnames(
		'maxi-image-block__resizer',
		captionType &&
			captionType !== 'none' &&
			'maxi-image-block__resizer--has-caption'
	);

const responsiveImageSourceBreakpoints = ['xxl', 'xl', 'l', 'm', 's', 'xs'];
const responsiveImageSizeTargets = [
	'imageSize',
	'mediaURL',
	'mediaWidth',
	'mediaHeight',
	'cropOptions',
];

export const escapeCSSString = value =>
	String(value).replace(/[\u0000-\u001f\u007f"\\<>&]/g, char => {
		if (char === '"') return '\\"';
		if (char === '\\') return '\\\\';
		if (char === '\n') return '\\a ';
		if (char === '\r') return '\\d ';
		if (char === '\f') return '\\c ';

		return `\\${char.charCodeAt(0).toString(16)} `;
	});

export const getCSSURL = value => `url("${escapeCSSString(value)}")`;

export const getResponsiveImageFallback = attributes => ({
	mediaURL: attributes.mediaURL ?? attributes['mediaURL-general'],
	mediaWidth: attributes.mediaWidth ?? attributes['mediaWidth-general'],
	mediaHeight: attributes.mediaHeight ?? attributes['mediaHeight-general'],
});

export const getResetResponsiveImageSizeAttributes = () =>
	responsiveImageSourceBreakpoints.reduce((response, breakpoint) => {
		responsiveImageSizeTargets.forEach(target => {
			response[`${target}-${breakpoint}`] = undefined;
		});

		return response;
	}, {});

export const getResponsiveImageReplacementStyles = attributes => {
	if (attributes['dc-status']) return {};

	const { mediaURL: fallbackURL } = getResponsiveImageFallback(attributes);
	const response = {};

	responsiveImageSourceBreakpoints.forEach(breakpoint => {
		const mediaURL = attributes[`mediaURL-${breakpoint}`];
		const hasExplicitImageSize =
			attributes[`imageSize-${breakpoint}`] !== undefined &&
			attributes[`imageSize-${breakpoint}`] !== null;

		if (!mediaURL || (mediaURL === fallbackURL && !hasExplicitImageSize))
			return;

		response[breakpoint] = {
			content: getCSSURL(mediaURL),
		};
	});

	return Object.keys(response).length ? { imageSize: response } : {};
};
