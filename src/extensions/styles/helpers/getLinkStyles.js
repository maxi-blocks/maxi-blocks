/**
 * Internal dependencies
 */
import getColorRGBAString from '../getColorRGBAString';
import getPaletteAttributes from '../getPaletteAttributes';
import getAttributeKey from '../getAttributeKey';

/**
 * External dependencies
 */
import { isBoolean, isNil } from 'lodash';

const getLinkStyles = (obj, target, blockStyle) => {
	const breakpoints = ['general', 'xxl', 'xl', 'l', 'm', 's', 'xs'];
	const response = {};

	const getTextDecoration = (breakpoint, isHover = false) => {
		const hoverStatus = obj['typography-status-hover'];
		const value =
			obj[`${isHover ? 'hover-' : ''}text-decoration-${breakpoint}`];
		return !isNil(value) && (hoverStatus || !isHover) ? value : null;
	};

	breakpoints.forEach(breakpoint => {
		const decoration = getTextDecoration(breakpoint);
		const hoverDecoration = getTextDecoration(breakpoint, true);

		['visited', 'active', '', 'hover'].forEach(state => {
			const statePrefix = state ? `${state}-` : '';
			const selector =
				state === 'hover'
					? `${target}:hover`
					: `${target}${state ? `:${state}` : ''}`;

			const { paletteStatus, paletteColor, paletteOpacity, color } =
				getPaletteAttributes({
					obj,
					prefix: `link-${statePrefix}`,
					breakpoint,
				});

			if (paletteStatus && paletteColor) {
				response[selector] = {
					...response[selector],
					link: {
						...response[selector]?.link,
						[breakpoint]: {
							'text-decoration':
								state === 'hover'
									? hoverDecoration
									: decoration,
							color: getColorRGBAString({
								firstVar: `color-${paletteColor}`,
								opacity: paletteOpacity,
								blockStyle,
							}),
						},
					},
				};
			} else if (!paletteStatus && color) {
				response[selector] = {
					...response[selector],
					link: {
						...response[selector]?.link,
						[breakpoint]: {
							'text-decoration':
								state === 'hover'
									? hoverDecoration
									: decoration,
							color,
						},
					},
				};
			}
		});
	});

	return response;
};

export default getLinkStyles;
