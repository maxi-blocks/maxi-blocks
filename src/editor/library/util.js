/**
 * WordPress dependencies
 */
import { select } from '@wordpress/data';

/**
 * Internal dependencies
 */
import { getBlockStyle, getPaletteAttributes } from '@extensions/styles';

/**
 * External dependencies
 */
import { isNil } from 'lodash';

export const rgbToHex = color => {
	if (isNil(color)) return '';

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
	const containerId = 'maxi-temporary-elem';
	let container = document.getElementById(containerId);

	if (!container) {
		container = document.createElement('div');
		container.setAttribute('id', containerId);
		container.style.position = 'absolute';
		container.style.left = '-9999px';
		container.style.top = '-9999px';
		container.style.width = '0';
		container.style.height = '0';
		container.style.overflow = 'hidden';
		document.body.append(container);
	}

	container.innerHTML = svgCode.trim();

	const svgElement = container.querySelector('svg');
	const bbox = svgElement.getBBox();

	svgElement.setAttribute(
		'viewBox',
		`${bbox.x}, ${bbox.y}, ${bbox.width}, ${bbox.height}`
	);
	svgElement.removeAttribute('width');
	svgElement.removeAttribute('height');

	const newSvgCode = svgElement.outerHTML;

	container.innerHTML = '';

	return newSvgCode;
};

export const svgAttributesReplacer = (svgCode, target = 'svg') => {
	const fillRegExp = /fill:[^n]+?(?=})/g;
	const fillStr = 'fill:var(--mibo)';

	const fillRegExp2 = /[^-]fill="[^n]+?(?=")/g;
	const fillStr2 = ' fill="var(--mibo)';

	const strokeRegExp = /stroke:[^n]+?(?=})/g;
	const strokeStr = 'stroke:#081219';

	const strokeRegExp2 = /[^-]stroke="[^n]+?(?=")/g;
	const strokeStr2 = ' stroke="#081219';

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

	const currentAttributes = getBlock(clientId)?.attributes;

	if (!currentAttributes) return null;

	const { receiveActiveStyleCardValue } = select('maxiBlocks/style-cards');

	const lineColorGlobal = receiveActiveStyleCardValue(
		'line-color',
		getBlockStyle(clientId),
		'icon'
	);
	const lineColorGlobalStatus = receiveActiveStyleCardValue(
		'line-color-global',
		getBlockStyle(clientId),
		'icon'
	);

	const colorType =
		target === 'icon' ? '' : target === 'svg' ? '-line' : '-fill';

	const iconPaletteAttr = getPaletteAttributes({
		obj: currentAttributes,
		prefix: 'icon-',
	});

	const iconPaletteStatus = iconPaletteAttr.paletteStatus;
	const iconPaletteColor = iconPaletteAttr.paletteColor;
	const iconColor = iconPaletteAttr.color;

	const iconInheritColor = currentAttributes['icon-inherit']
		? !iconPaletteStatus
			? rgbToHex(iconColor)
			: rgbToHex(
					`rgba(${getVarValue(
						`var(--maxi-${blockStyle}-color-${iconPaletteColor})`
					)}, 1)`
			  )
		: '';

	const { paletteStatus, paletteColor, color } = getPaletteAttributes({
		obj: currentAttributes,
		prefix: `${target}${colorType}-`,
	});

	const currentColor = !paletteStatus
		? rgbToHex(color)
		: rgbToHex(
				`rgba(${getVarValue(
					`var(--maxi-${blockStyle}-color-${paletteColor})`
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
