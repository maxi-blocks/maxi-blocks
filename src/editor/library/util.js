/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { select } from '@wordpress/data';

/**
 * Internal dependencies
 */
import { getColorRGBAString, getBlockStyle } from '../../extensions/styles';

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

export const fitSvg = svgCode => {
	const template = document.createElement('div');

	template.setAttribute('id', 'maxi-temporary-elem');
	template.innerHTML = svgCode.trim();
	document.querySelector('body').append(template);

	const bbox = document.querySelector('#maxi-temporary-elem svg').getBBox();

	const SVGElement = document.querySelector('#maxi-temporary-elem svg');
	SVGElement.setAttribute(
		'viewBox',
		`${bbox.x}, ${bbox.y}, ${bbox.width}, ${bbox.height}`
	);
	SVGElement.removeAttribute('width');
	SVGElement.removeAttribute('height');

	const newSvgCode = document.querySelector(
		'#maxi-temporary-elem svg'
	).outerHTML;

	document.querySelector('#maxi-temporary-elem').remove();

	return newSvgCode;
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

	const fillColor = !currentAttributes[`${target}-fill-palette-status`]
		? currentAttributes[`${target}-fill-color`]
		: getColorRGBAString({
				firstVar: 'icon-fill',
				secondVar: `color-${
					currentAttributes[`${target}-fill-palette-color`]
				}`,
				opacity: currentAttributes[`${target}-fill-palette-opacity`],
				blockStyle,
		  }) || '';

	const lineColor = !currentAttributes[`${target}-line-palette-status`]
		? currentAttributes[`${target}-line-color`]
		: getColorRGBAString({
				firstVar: 'icon-line',
				secondVar: `color-${
					currentAttributes[`${target}-line-palette-color`]
				}`,
				opacity: currentAttributes[`${target}-line-palette-opacity`],
				blockStyle,
		  }) || '';

	const shapeFillColor = !currentAttributes[`${target}-fill-palette-status`]
		? currentAttributes[`${target}-fill-color`]
		: getColorRGBAString({
				firstVar: 'shape-fill',
				secondVar: `color-${
					currentAttributes[`${target}-fill-palette-color`]
				}`,
				opacity: 100,
				blockStyle,
		  }) || '';

	const iconNoInheritColor = !currentAttributes[`${target}-palette-status`]
		? currentAttributes[`${target}-color`]
		: getColorRGBAString({
				firstVar: 'color',
				secondVar: `color-${
					currentAttributes[`${target}-palette-color`]
				}`,
				opacity: 100,
				blockStyle,
		  }) || '';

	const iconInheritColor = !currentAttributes['palette-status-general']
		? currentAttributes['color-general']
		: getColorRGBAString({
				firstVar: 'color',
				secondVar: `color-${currentAttributes['palette-color-general']}`,
				opacity: 100,
				blockStyle,
		  }) || '';

	const iconColor = currentAttributes['icon-inherit']
		? iconInheritColor
		: iconNoInheritColor;

	const fillRegExp = new RegExp('fill:[^n]+?(?=})', 'g');
	const fillStr = `fill:${target === 'shape' ? shapeFillColor : fillColor}`;

	const fillRegExp2 = new RegExp('[^-]fill="[^n]+?(?=")', 'g');
	const fillStr2 = ` fill="${
		target === 'shape' ? shapeFillColor : fillColor
	}`;

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

export const isColorLight = color => {
	const hex = color.replace('#', '');
	const colorRed = parseInt(hex.substr(0, 2), 16);
	const colorGreen = parseInt(hex.substr(2, 2), 16);
	const colorBlue = parseInt(hex.substr(4, 2), 16);
	const brightness =
		(colorRed * 299 + colorGreen * 587 + colorBlue * 114) / 1000;
	return brightness > 155;
};

export const getVarValue = currentColor => {
	return window
		.getComputedStyle(document.documentElement)
		.getPropertyValue(
			currentColor
				.substr(currentColor.lastIndexOf('var(') + 4)
				.replaceAll(')', '')
		);
};

export const svgCurrentColorStatus = (blockStyle, target = 'svg') => {
	const { getSelectedBlockClientId, getBlock } = select('core/block-editor');
	const clientId = getSelectedBlockClientId();

	const currentAttributes = getBlock(clientId).attributes;

	const { receiveStyleCardValue } = select('maxiBlocks/style-cards');

	const lineColorGlobal = receiveStyleCardValue(
		'line',
		getBlockStyle(clientId),
		'icon'
	);
	const lineColorGlobalStatus = receiveStyleCardValue(
		'line-global',
		getBlockStyle(clientId),
		'icon'
	);

	const colorType =
		target === 'icon' ? '' : target === 'svg' ? '-line' : '-fill';

	const iconInheritColor = currentAttributes['icon-inherit']
		? !currentAttributes['palette-status-general']
			? rgbToHex(currentAttributes['color-general'])
			: rgbToHex(
					`rgba(${getVarValue(
						`var(--maxi-${blockStyle}-color-${currentAttributes['palette-color-general']})`
					)}, 1)`
			  )
		: '';

	const currentColor = !currentAttributes[
		`${target}-${colorType}-palette-status`
	]
		? rgbToHex(currentAttributes[`${target}${colorType}-color`])
		: rgbToHex(
				`rgba(${getVarValue(
					`var(--maxi-${blockStyle}-color-${
						currentAttributes[`${target}-palette${colorType}-color`]
					})`
				)},1)`
		  );

	return target === 'svg' && lineColorGlobalStatus
		? isColorLight(rgbToHex(lineColorGlobal))
		: isColorLight(
				target === 'icon' && currentAttributes['icon-inherit']
					? iconInheritColor
					: currentColor
		  );
};
