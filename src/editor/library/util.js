/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { useSelect } from '@wordpress/data';

export const placeholderImage = async () => {
	const ajaxurl = wp.ajax.settings.url;
	try {
		const response = await fetch(
			`${
				window.location.origin + ajaxurl
			}?action=maxi_upload_placeholder_image`
		);
		const data = await response.json();
		if (data.error === '404') {
			console.warn(
				__(
					"Can't upload the placeholder image, check directory's permissions",
					'maxi-blocks'
				)
			);
			return null;
		}
		return data;
	} catch (err) {
		console.error(
			__(`Error uploading the placeholder image: ${err}`, 'maxi-blocks')
		);
	}
	return null;
};

export const imageUploader = async (imageSrc, usePlaceholderImage) => {
	const ajaxurl = wp.ajax.settings.url;
	try {
		if (usePlaceholderImage) return placeholderImage();

		const response = await fetch(
			`${
				window.location.origin + ajaxurl
			}?action=maxi_upload_pattern_image&maxi_image_to_upload=${imageSrc}`
		);

		if (!response.ok) {
			console.warn(
				__(
					'The Cloud server is down, using the placeholder image',
					'maxi-blocks'
				)
			);
			return placeholderImage();
		}

		const data = await response.json();
		if (data.error === '404') {
			console.warn(
				__(
					'The original image not found (404) on the Cloud Site, using the placeholder image',
					'maxi-blocks'
				)
			);
			return placeholderImage();
		}
		return data;
	} catch (err) {
		console.error(__(`Error uploading the image: ${err}`, 'maxi-blocks'));
	}
	return null;
};

export const svgAttributesReplacer = (
	blockStyle,
	svgCode,
	currentAttributes
) => {
	const fillColor = !currentAttributes['svg-palette-fill-color-status']
		? currentAttributes['svg-fill-color']
		: `var(--maxi-${blockStyle}-icon-fill, var(--maxi-${blockStyle}-color-${currentAttributes['svg-palette-fill-color']}))`;

	const lineColor = !currentAttributes['svg-palette-line-color-status']
		? currentAttributes['svg-line-color']
		: `var(--maxi-${blockStyle}-icon-line, var(--maxi-${blockStyle}-color-${currentAttributes['svg-palette-line-color']}))`;

	const fillRegExp = new RegExp('fill:[^n]+?(?=})', 'g');
	const fillStr = `fill:${fillColor}`;

	const fillRegExp2 = new RegExp('[^-]fill="[^n]+?(?=")', 'g');
	const fillStr2 = ` fill="${fillColor}`;

	const strokeRegExp = new RegExp('stroke:[^n]+?(?=})', 'g');
	const strokeStr = `stroke:${lineColor}`;

	const strokeRegExp2 = new RegExp('[^-]stroke="[^n]+?(?=")', 'g');
	const strokeStr2 = ` stroke="${lineColor}`;

	return svgCode
		.replace(fillRegExp, fillStr)
		.replace(fillRegExp2, fillStr2)
		.replace(strokeRegExp, strokeStr)
		.replace(strokeRegExp2, strokeStr2);
};
