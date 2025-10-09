/**
 * WordPress dependencies
 */
import { select } from '@wordpress/data';

/**
 * Internal dependencies
 */
import {
	getBlockStyle,
	getPaletteAttributes,
	getColorRGBAString,
} from '@extensions/styles';

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

export const svgAttributesReplacer = (
	svgCode,
	target = 'svg',
	iconType = null
) => {
	const { getSelectedBlockClientId, getBlock } = select('core/block-editor');
	const clientId = getSelectedBlockClientId();
	const block = clientId ? getBlock(clientId) : null;
	const currentAttributes = block?.attributes;
	const blockStyle = getBlockStyle(clientId);

	const fallbackFill = 'var(--maxi-icon-block-orange)';
	const fallbackStroke = '#081219';

	let resolvedFill = fallbackFill;
	let resolvedStroke = fallbackStroke;

	if (currentAttributes) {
		let fillPrefix;
		let strokePrefix;

		if (target === 'svg') {
			// For SVG target, always use svg-fill- and svg-line-
			fillPrefix = 'svg-fill-';
			strokePrefix = 'svg-line-';
		} else if (target === 'image-shape') {
			// For image-shape target, use just 'list-' for both fill and stroke
			fillPrefix = 'list-';
			strokePrefix = 'list-';
		} else if (target === 'icon' && iconType) {
			// Handle specific iconType cases
			switch (iconType) {
				case 'video-icon-play':
					fillPrefix = 'play-icon-fill-';
					strokePrefix = 'play-icon-stroke-';
					break;
				case 'video-icon-close':
					fillPrefix = 'close-icon-fill-';
					strokePrefix = 'close-icon-stroke-';
					break;
				case 'accordion-icon-active':
					fillPrefix = 'active-icon-fill-';
					strokePrefix = 'active-icon-stroke-';
					break;
				case 'image-shape':
					// Use just 'list-' for both fill and stroke
					fillPrefix = 'list-';
					strokePrefix = 'list-';
					break;
				case 'search-icon-close':
					fillPrefix = 'close-icon-fill-';
					strokePrefix = 'close-icon-stroke-';
					break;
				default:
					// Fallback for other iconType cases
					fillPrefix = 'icon-fill-';
					strokePrefix = 'icon-stroke-';
					break;
			}
		} else {
			// Default case for icon target without iconType
			fillPrefix = 'icon-fill-';
			strokePrefix = 'icon-stroke-';
		}

		const {
			paletteStatus: fillPaletteStatus,
			paletteSCStatus: fillPaletteSCStatus,
			paletteColor: fillPaletteColor,
			paletteOpacity: fillPaletteOpacity,
			color: fillDirectColor,
		} = getPaletteAttributes({
			obj: currentAttributes,
			prefix: fillPrefix,
		});

		const {
			paletteStatus: strokePaletteStatus,
			paletteSCStatus: strokePaletteSCStatus,
			paletteColor: strokePaletteColor,
			paletteOpacity: strokePaletteOpacity,
			color: strokeDirectColor,
		} = getPaletteAttributes({
			obj: currentAttributes,
			prefix: strokePrefix,
		});

		const fillPaletteColorVar =
			fillPaletteColor != null ? `color-${fillPaletteColor}` : null;
		const fillPaletteSCColor = fillPaletteColorVar;
		const strokePaletteColorVar =
			strokePaletteColor != null ? `color-${strokePaletteColor}` : null;
		const strokePaletteSCColor = strokePaletteColorVar;

		resolvedFill =
			fillPaletteColorVar && (fillPaletteStatus || fillPaletteSCStatus)
				? getColorRGBAString(
						fillPaletteSCStatus
							? {
									firstVar: fillPaletteSCColor,
									opacity: fillPaletteOpacity,
									blockStyle,
							  }
							: {
									firstVar:
										target === 'icon'
											? 'icon-fill'
											: 'svg-fill',
									secondVar: fillPaletteColorVar,
									opacity: fillPaletteOpacity,
									blockStyle,
							  }
				  )
				: fillDirectColor || fallbackFill;

		resolvedStroke =
			strokePaletteColorVar &&
			(strokePaletteStatus || strokePaletteSCStatus)
				? getColorRGBAString(
						strokePaletteSCStatus
							? {
									firstVar: strokePaletteSCColor,
									opacity: strokePaletteOpacity,
									blockStyle,
							  }
							: {
									firstVar:
										target === 'icon'
											? 'icon-stroke'
											: 'svg-stroke',
									secondVar: strokePaletteColorVar,
									opacity: strokePaletteOpacity,
									blockStyle,
							  }
				  )
				: strokeDirectColor || fallbackStroke;
	}

	const fillRegExp = /fill:[^n]+?(?=})/g;
	const fillStr = `fill:${resolvedFill}`;

	const fillRegExp2 = /[^-]fill="[^n]+?(?=")/g;
	const fillStr2 = ` fill="${resolvedFill}`;

	const strokeRegExp = /stroke:[^n]+?(?=})/g;
	const strokeStr = `stroke:${resolvedStroke}`;

	const strokeRegExp2 = /[^-]stroke="[^n]+?(?=")/g;
	const strokeStr2 = ` stroke="${resolvedStroke}`;

	return svgCode
		.replace(fillRegExp, fillStr)
		.replace(fillRegExp2, fillStr2)
		.replace(strokeRegExp, strokeStr)
		.replace(strokeRegExp2, strokeStr2);
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
