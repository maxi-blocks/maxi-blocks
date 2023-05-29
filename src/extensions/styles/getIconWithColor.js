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
			target: ['_bs', `${prefix}i_on`, `${prefix}i_i`, `${prefix}i_c`],
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
				!attributes[getAttributeKey({ key: 't.sh' })])
		) {
			if (!paletteColor)
				paletteColor = getAttributesValue({
					target: `i-${type === 'stroke' ? 'str' : 'f'}_pc`,
					isHover,
					props: attributes,
					prefix,
				});
			if (!paletteOpacity)
				paletteOpacity = getAttributesValue({
					target: `i-${type === 'stroke' ? 'str' : 'f'}_po`,
					isHover,
					props: attributes,
					prefix,
				});
			if (!paletteStatus)
				paletteStatus = getAttributesValue({
					target: `i-${type === 'stroke' ? 'str' : 'f'}_ps`,
					isHover,
					props: attributes,
					prefix,
				});
			if (!color)
				color = getAttributesValue({
					target: `i-${type === 'stroke' ? 'str' : 'f'}_cc`,
					isHover,
					props: attributes,
					prefix,
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
					breakpoint: 'g',
					props: attributes,
					prefix,
				});
			if (!paletteOpacity)
				paletteOpacity = getAttributesValue({
					target: '_po',
					isHover,
					breakpoint: 'g',
					props: attributes,
					prefix,
				});
			if (!paletteStatus)
				paletteStatus = getAttributesValue({
					target: '_ps',
					isHover,
					breakpoint: 'g',
					props: attributes,
					prefix,
				});
			if (!color)
				color = getAttributesValue({
					target: '_cc',
					isHover,
					breakpoint: 'g',
					props: attributes,
					prefix,
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
