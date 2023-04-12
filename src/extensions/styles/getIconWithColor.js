/**
 * Internal dependencies
 */
import getColorRGBAString from './getColorRGBAString';
import { setSVGContent, setSVGContentHover } from '../svg';
import getAttributeKey from '../attributes/getAttributeKey';
import { getAttributesValue } from '../attributes';

/**
 * External dependencies
 */
import { isArray, isNil } from 'lodash';

const getIconWithColor = (attributes, args = {}, prefix = '') => {
	const [blockStyle, iconOnly, iconInherit, iconContent] = getAttributesValue(
		{
			target: [
				'_bs',
				`${prefix}icon-only`,
				`${prefix}icon-inherit`,
				`${prefix}icon-content`,
			],
			props: attributes,
		}
	);

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
			(isHover &&
				!useIconColor &&
				!attributes[getAttributeKey('typography-status-hover')])
		) {
			if (!paletteColor)
				paletteColor = getAttributesValue({
					target: `icon-${type}-palette-color`,
					isHover,
					props: attributes,
				});
			if (!paletteOpacity)
				paletteOpacity = getAttributesValue({
					target: `icon-${type}-palette-opacity`,
					isHover,
					props: attributes,
				});
			if (!paletteStatus)
				paletteStatus = getAttributesValue({
					target: `icon-${type}-palette-status`,
					isHover,
					props: attributes,
				});
			if (!color)
				color = getAttributesValue({
					target: `icon-${type}-color`,
					isHover,
					props: attributes,
				});

			lineColorStr = getColorRGBAString({
				firstVar: `icon-${type}${isHover ? '-hover' : ''}`,
				secondVar: `color-${paletteColor}${isHover ? '-hover' : ''}`,
				opacity: paletteOpacity,
				blockStyle,
			});
		} else {
			if (!paletteColor)
				paletteColor = getAttributesValue({
					target: '_pc',
					isHover,
					breakpoint: 'general',
					props: attributes,
				});
			if (!paletteOpacity)
				paletteOpacity = getAttributesValue({
					target: '_po',
					isHover,
					breakpoint: 'general',
					props: attributes,
				});
			if (!paletteStatus)
				paletteStatus = getAttributesValue({
					target: '_ps',
					isHover,
					breakpoint: 'general',
					props: attributes,
				});
			if (!color)
				color = getAttributesValue({
					target: '_cc',
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
