import { isArray, isNil } from 'lodash';

import getColorRGBAString from './getColorRGBAString';
import { setSVGColor } from '@extensions/svg';
import getAttributeValue from './getAttributeValue';

const getIconWithColor = (props, args = {}, prefix = '') => {
	// Destructure specific icon-related attributes from props
	const { blockStyle, [`${prefix}icon-content`]: iconContent } = props;

	let { isInherit, isIconOnly } = args;
	const { rawIcon: rawIconArg } = args;
	const { isHover, type: rawType = ['stroke'] } = args;
	const types = isArray(rawType) ? rawType : [rawType];

	if (isNil(isInherit)) {
		isInherit = props[`${prefix}icon-inherit`];
	}
	if (isNil(isIconOnly)) {
		isIconOnly = props[`${prefix}icon-only`];
	}

	const useIconColor = isIconOnly || !isInherit;

	let icon = rawIconArg || iconContent;

	types.forEach(type => {
		let {
			paletteColor,
			paletteOpacity,
			paletteStatus,
			paletteSCStatus,
			color,
		} = args;

		let lineColorStr = '';

		if (
			type === 'fill' ||
			useIconColor ||
			(isHover && !useIconColor && !props['typography-status-hover'])
		) {
			if (!paletteColor)
				paletteColor = getAttributeValue({
					target: `icon-${type}-palette-color`,
					isHover,
					props,
				});
			if (!paletteOpacity)
				paletteOpacity = getAttributeValue({
					target: `icon-${type}-palette-opacity`,
					isHover,
					props,
				});
			if (!paletteStatus)
				paletteStatus = getAttributeValue({
					target: `icon-${type}-palette-status`,
					isHover,
					props,
				});
			if (!paletteSCStatus)
				paletteSCStatus = getAttributeValue({
					target: `icon-${type}-palette-sc-status`,
					isHover,
					props,
				});
			if (!color)
				color = getAttributeValue({
					target: `icon-${type}-color`,
					isHover,
					props,
				});

			lineColorStr = getColorRGBAString(
				paletteSCStatus
					? {
							firstVar: `color-${paletteColor}${
								isHover ? '-hover' : ''
							}`,
							opacity: paletteOpacity,
							blockStyle,
					  }
					: {
							firstVar: `icon-${type}${isHover ? '-hover' : ''}`,
							secondVar: `color-${paletteColor}${
								isHover ? '-hover' : ''
							}`,
							opacity: paletteOpacity,
							blockStyle,
					  }
			);
		} else {
			if (!paletteColor)
				paletteColor = getAttributeValue({
					target: 'palette-color',
					isHover,
					breakpoint: 'general',
					props,
				});
			if (!paletteOpacity)
				paletteOpacity = getAttributeValue({
					target: 'palette-opacity',
					isHover,
					breakpoint: 'general',
					props,
				});
			if (!paletteStatus)
				paletteStatus = getAttributeValue({
					target: 'palette-status',
					isHover,
					breakpoint: 'general',
					props,
				});
			if (!color)
				color = getAttributeValue({
					target: 'color',
					isHover,
					breakpoint: 'general',
					props,
				});

			lineColorStr = getColorRGBAString({
				firstVar: `color-${paletteColor}${isHover ? '-hover' : ''}`,
				opacity: paletteOpacity,
				blockStyle,
			});
		}

		icon = setSVGColor({
			svg: icon,
			color: paletteStatus ? lineColorStr : color,
			type,
		});
	});

	return icon;
};

export default getIconWithColor;
