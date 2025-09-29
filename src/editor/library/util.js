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

export const svgAttributesReplacer = (svgCode, target = 'svg') => {
	// Attempt to resolve colors from active style card and current block
	try {
		const { getSelectedBlockClientId, getBlock } =
			select('core/block-editor');
		const clientId = getSelectedBlockClientId();
		const currentAttributes = getBlock(clientId)?.attributes || {};
		const blockStyle = getBlockStyle(clientId);
		// Choose prefixes based on requested target so we align with block attributes
		const strokePrefix =
			target === 'icon' ? 'icon-stroke-' : `${target}-line-`;
		const fillPrefix = target === 'icon' ? 'icon-fill-' : `${target}-fill-`;

		const {
			paletteStatus: strokePaletteStatus,
			paletteColor: strokePaletteColor,
			color: strokeDirectColor,
		} = getPaletteAttributes({
			obj: currentAttributes,
			prefix: strokePrefix,
		});

		const {
			paletteStatus: fillPaletteStatus,
			paletteColor: fillPaletteColor,
			paletteSCStatus: fillPaletteSCStatus,
			color: fillDirectColor,
		} = getPaletteAttributes({
			obj: currentAttributes,
			prefix: fillPrefix,
		});

		const resolvedStroke = strokePaletteStatus
			? `rgba(var(--maxi-${blockStyle}-color-${strokePaletteColor}),1)`
			: strokeDirectColor || '#081219';
		const resolvedFill =
			fillPaletteStatus || fillPaletteSCStatus
				? `rgba(var(--maxi-${blockStyle}-color-${fillPaletteColor}),1)`
				: fillDirectColor || 'currentColor';

		const fillRegExp = /fill:[^n]+?(?=})/g;
		const fillStr = `fill:${resolvedFill}`;
		const fillRegExp2 = /[^-]fill="[^n]+?(?=")/g;
		const fillStr2 = ` fill="${resolvedFill}`;
		const strokeRegExp = /stroke:[^n]+?(?=})/g;
		const strokeStr = `stroke:${resolvedStroke}`;
		const strokeRegExp2 = /[^-]stroke="[^n]+?(?=")/g;
		const strokeStr2 = ` stroke="${resolvedStroke}`;

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
			: svgCode
					.replace(fillRegExp, fillStr)
					.replace(fillRegExp2, fillStr2);
	} catch (err) {
		// Fallback to prior behavior
		const fillRegExp = /fill:[^n]+?(?=})/g;
		const fillStr = 'fill:var(--maxi-icon-block-orange)';
		const fillRegExp2 = /[^-]fill="[^n]+?(?=")/g;
		const fillStr2 = ' fill="var(--maxi-icon-block-orange)';
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
			: svgCode
					.replace(fillRegExp, fillStr)
					.replace(fillRegExp2, fillStr2);
	}
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
