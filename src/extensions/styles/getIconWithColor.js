import { isArray, isNil } from 'lodash';

import getColorRGBAString from './getColorRGBAString';
import { setSVGContent, setSVGContentHover } from '@extensions/svg';
import getAttributeValue from './getAttributeValue';

const getIconWithColor = (attributes, args = {}, prefix = '') => {
	const {
		blockStyle,
		[`${prefix}icon-only`]: iconOnly,
		[`${prefix}icon-inherit`]: iconInherit,
		[`${prefix}icon-content`]: iconContent,
	} = attributes;

	let { isInherit, isIconOnly } = args;
	const { isHover, type: rawType = ['stroke'], rawIcon } = args;
	const types = isArray(rawType) ? rawType : [rawType];

	if (isNil(isInherit)) isInherit = iconInherit;
	if (isNil(isIconOnly)) isIconOnly = iconOnly;

	const useIconColor = isIconOnly || !isInherit;

	let icon = rawIcon ?? iconContent;

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
			(isHover && !useIconColor && !attributes['typography-status-hover'])
		) {
			if (!paletteColor)
				paletteColor = getAttributeValue({
					target: `icon-${type}-palette-color`,
					isHover,
					props: attributes,
				});
			if (!paletteOpacity)
				paletteOpacity = getAttributeValue({
					target: `icon-${type}-palette-opacity`,
					isHover,
					props: attributes,
				});
			if (!paletteStatus)
				paletteStatus = getAttributeValue({
					target: `icon-${type}-palette-status`,
					isHover,
					props: attributes,
				});
			if (!paletteSCStatus)
				paletteSCStatus = getAttributeValue({
					target: `icon-${type}-palette-sc-status`,
					isHover,
					props: attributes,
				});
			if (!color)
				color = getAttributeValue({
					target: `icon-${type}-color`,
					isHover,
					props: attributes,
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
					props: attributes,
				});
			if (!paletteOpacity)
				paletteOpacity = getAttributeValue({
					target: 'palette-opacity',
					isHover,
					breakpoint: 'general',
					props: attributes,
				});
			if (!paletteStatus)
				paletteStatus = getAttributeValue({
					target: 'palette-status',
					isHover,
					breakpoint: 'general',
					props: attributes,
				});
			if (!color)
				color = getAttributeValue({
					target: 'color',
					isHover,
					breakpoint: 'general',
					props: attributes,
				});

			lineColorStr = getColorRGBAString({
				firstVar: `color-${paletteColor}${isHover ? '-hover' : ''}`,
				opacity: paletteOpacity,
				blockStyle,
			});
		}

		icon = isHover
			? setSVGContentHover(
					icon,
					paletteStatus ? lineColorStr : color,
					type
			  )
			: setSVGContent(icon, paletteStatus ? lineColorStr : color, type);
	});

	return icon;
};

export default getIconWithColor;
