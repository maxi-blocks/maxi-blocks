/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { select } from '@wordpress/data';

/**
 * External dependencies
 */
import invert from 'invert-color';

export const rgbToHex = color => {
	const rgb = color.match(
		/^rgba?[\s+]?\([\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?/i
	);

	return rgb && rgb.length === 4
		? `#${`0${parseInt(rgb[1], 10).toString(16)}`.slice(-2)}${`0${parseInt(
				rgb[2],
				10
		  ).toString(16)}`.slice(-2)}${`0${parseInt(rgb[3], 10).toString(
				16
		  )}`.slice(-2)}`
		: '';
};

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

export const svgAttributesReplacer = (blockStyle, svgCode, target = 'svg') => {
	const { getSelectedBlockClientId, getBlock } = select('core/block-editor');
	const clientId = getSelectedBlockClientId();
	const currentAttributes = getBlock(clientId).attributes;

	if (!currentAttributes) return false;

	const fillColor = !currentAttributes[`${target}-palette-fill-color-status`]
		? currentAttributes[`${target}-fill-color`]
		: `var(--maxi-${blockStyle}-icon-fill, var(--maxi-${blockStyle}-color-${
				currentAttributes[`${target}-palette-fill-color`]
		  }))` || '';

	const lineColor = !currentAttributes[`${target}-palette-line-color-status`]
		? currentAttributes[`${target}-line-color`]
		: `var(--maxi-${blockStyle}-icon-line, var(--maxi-${blockStyle}-color-${
				currentAttributes[`${target}-palette-line-color`]
		  }))` || '';

	const iconNoInheritColor = !currentAttributes[
		`${target}-palette-color-status`
	]
		? currentAttributes[`${target}-color`]
		: `var(--maxi-${blockStyle}-color-${
				currentAttributes[`${target}-palette-color`]
		  })` || '';

	const iconInheritColor = !currentAttributes['palette-color-status-general']
		? currentAttributes['color-general']
		: `var(--maxi-${blockStyle}-color-${currentAttributes['palette-color-general']})` ||
		  '';

	const iconColor = currentAttributes['icon-inherit']
		? iconInheritColor
		: iconNoInheritColor;

	const fillRegExp = new RegExp('fill:[^n]+?(?=})', 'g');
	const fillStr = `fill:${fillColor}`;

	const fillRegExp2 = new RegExp('[^-]fill="[^n]+?(?=")', 'g');
	const fillStr2 = ` fill="${fillColor}`;

	const strokeRegExp = new RegExp('stroke:[^n]+?(?=})', 'g');
	const strokeStr = `stroke:${target === 'icon' ? iconColor : lineColor}`;

	const strokeRegExp2 = new RegExp('[^-]stroke="[^n]+?(?=")', 'g');
	const strokeStr2 = ` stroke="${target === 'icon' ? iconColor : lineColor}`;

	return target === 'svg'
		? svgCode
				.replace(fillRegExp, fillStr)
				.replace(fillRegExp2, fillStr2)
				.replace(strokeRegExp, strokeStr)
				.replace(strokeRegExp2, strokeStr2)
		: target === 'icon'
		? svgCode
				.replace(strokeRegExp, strokeStr)
				.replace(strokeRegExp2, strokeStr2)
		: svgCode.replace(fillRegExp, fillStr).replace(fillRegExp2, fillStr2);
};

export const svgInvertColor = (blockStyle, target = 'svg') => {
	const { getSelectedBlockClientId, getBlock } = select('core/block-editor');
	const clientId = getSelectedBlockClientId();

	const currentAttributes = getBlock(clientId).attributes;

	const colorType =
		target === 'icon' ? '' : target === 'svg' ? '-line' : '-fill';

	const currentColor = !currentAttributes[
		`${target}-palette${colorType}-color-status`
	]
		? currentAttributes[`${target}${colorType}-color`]
		: `var(--maxi-${blockStyle}-icon-${colorType}, var(--maxi-${blockStyle}-color-${
				currentAttributes[`${target}-palette${colorType}-color`]
		  }))`;

	const currentItemColor = !currentAttributes[
		`${target}-palette${colorType}-color-status`
	]
		? rgbToHex(currentAttributes[`${target}${colorType}-color`])
		: window
				.getComputedStyle(document.documentElement)
				.getPropertyValue(
					currentColor
						.substr(currentColor.lastIndexOf('var(') + 4)
						.replaceAll(')', '')
				);

	return invert(currentItemColor, true);
};
