import { isNil } from 'lodash';

import getColorRGBAString from './getColorRGBAString';
import { setSVGContent, setSVGContentHover } from '../svg';

const getIconWithColor = (attributes, args = {}, prefix = '') => {
	const {
		blockStyle,
		[`${prefix}icon-only`]: iconOnly,
		[`${prefix}icon-inherit`]: iconInherit,
		[`${prefix}icon-content`]: iconContent,
	} = attributes;

	let {
		paletteColor,
		paletteOpacity,
		paletteStatus,
		color,
		isInherit,
		isIconOnly,
	} = args;
	const { isHover, type = 'stroke', rawIcon } = args;

	if (isNil(isInherit)) isInherit = iconInherit;
	if (isNil(isIconOnly)) isIconOnly = iconOnly;

	const useIconColor = isIconOnly || !isInherit;

	let lineColorStr = '';

	if (type === 'fill')
		lineColorStr = getColorRGBAString({
			firstVar: `icon-${type}${isHover ? '-hover' : ''}`,
			secondVar: `color-${paletteColor}${isHover ? '-hover' : ''}`,
			opacity: paletteOpacity,
			blockStyle,
		});
	else if (
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
			color = attributes[`icon-${type}-color${isHover ? '-hover' : ''}`];

		lineColorStr = getColorRGBAString({
			firstVar: `icon-${type}${isHover ? '-hover' : ''}`,
			secondVar: `color-${paletteColor}${isHover ? '-hover' : ''}`,
			opacity: paletteOpacity,
			blockStyle,
		});
	} else {
		if (!paletteColor)
			paletteColor =
				attributes[`palette-color-general${isHover ? '-hover' : ''}`];
		if (!paletteOpacity)
			paletteOpacity =
				attributes[`palette-opacity-general${isHover ? '-hover' : ''}`];
		if (!paletteStatus)
			paletteStatus =
				attributes[`palette-status-general${isHover ? '-hover' : ''}`];
		if (!color)
			color = attributes[`color-general${isHover ? '-hover' : ''}`];

		lineColorStr = getColorRGBAString({
			firstVar: `color-${paletteColor}${isHover ? '-hover' : ''}`,
			opacity: paletteOpacity,
			blockStyle,
		});
	}

	const icon = isHover
		? setSVGContentHover(
				rawIcon ?? iconContent,
				paletteStatus ? lineColorStr : color,
				type
		  )
		: setSVGContent(
				rawIcon ?? iconContent,
				paletteStatus ? lineColorStr : color,
				type
		  );

	return icon;
};

export default getIconWithColor;
