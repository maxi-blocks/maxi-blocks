import { isArray, isNil } from 'lodash';

import getColorRGBAString from './getColorRGBAString';
import { setSVGContent, setSVGContentHover } from '../svg';

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
		let { paletteColor, paletteOpacity, paletteStatus, color } = args;

		let lineColorStr = '';

		if (
			type === 'fill' ||
			useIconColor ||
			(isHover && !useIconColor && !attributes['typography-status-hover'])
		) {
			if (!paletteColor)
				paletteColor =
					attributes[
						`icon-${type}-palette-color${isHover ? '-hover' : ''}`
					];
			if (!paletteOpacity)
				paletteOpacity =
					attributes[
						`icon-${type}-palette-opacity${isHover ? '-hover' : ''}`
					];
			if (!paletteStatus)
				paletteStatus =
					attributes[
						`icon-${type}-palette-status${isHover ? '-hover' : ''}`
					];
			if (!color)
				color =
					attributes[`icon-${type}-color${isHover ? '-hover' : ''}`];

			lineColorStr = getColorRGBAString({
				firstVar: `icon-${type}${isHover ? '-hover' : ''}`,
				secondVar: `color-${paletteColor}${isHover ? '-hover' : ''}`,
				opacity: paletteOpacity,
				blockStyle,
			});
		} else {
			if (!paletteColor)
				paletteColor =
					attributes[
						`palette-color-general${isHover ? '-hover' : ''}`
					];
			if (!paletteOpacity)
				paletteOpacity =
					attributes[
						`palette-opacity-general${isHover ? '-hover' : ''}`
					];
			if (!paletteStatus)
				paletteStatus =
					attributes[
						`palette-status-general${isHover ? '-hover' : ''}`
					];
			if (!color)
				color = attributes[`color-general${isHover ? '-hover' : ''}`];

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
