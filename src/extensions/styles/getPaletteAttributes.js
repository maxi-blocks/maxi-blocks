/**
 * Internal dependencies
 */
import getLastBreakpointAttribute from './getLastBreakpointAttribute';

/**
 * External dependencies
 */
import { isNil, isBoolean } from 'lodash';

const getPaletteAttributes = ({ obj, prefix = '', breakpoint, isHover }) => {
	if (isNil(breakpoint)) {
		const hoverFrag = isHover ? '-hover' : '';

		const {
			[`${prefix}palette-status${hoverFrag}`]: rawPaletteStatus,
			[`${prefix}palette-status`]: nonHoverPaletteStatus,
			[`${prefix}palette-color${hoverFrag}`]: paletteColor,
			[`${prefix}palette-opacity${hoverFrag}`]: paletteOpacity,
			[`${prefix}color${hoverFrag}`]: color,
		} = obj;

		const paletteStatus =
			isHover && isBoolean(rawPaletteStatus)
				? rawPaletteStatus
				: nonHoverPaletteStatus;
		return { paletteStatus, paletteColor, paletteOpacity, color };
	}

	const getValue = key =>
		getLastBreakpointAttribute(`${prefix}${key}`, breakpoint, obj, isHover);

	return {
		paletteStatus: getValue('palette-status'),
		paletteColor: getValue('palette-color'),
		paletteOpacity: getValue('palette-opacity'),
		color: getValue('color'),
	};
};

export default getPaletteAttributes;
