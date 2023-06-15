/**
 * Internal dependencies
 */
import getLastBreakpointAttribute from './getLastBreakpointAttribute';
import getAttributeValue from './getAttributeValue';

/**
 * External dependencies
 */
import { isNil } from 'lodash';

const getPaletteAttributes = ({ obj, prefix = '', breakpoint, isHover }) => {
	const getValue = key =>
		isNil(breakpoint)
			? getAttributeValue({
					target: `${prefix}${key}`,
					props: obj,
					isHover,
			  })
			: getLastBreakpointAttribute({
					target: `${prefix}${key}`,
					breakpoint,
					attributes: obj,
					isHover,
			  });

	return {
		paletteStatus: getValue('palette-status'),
		paletteSCStatus: getValue('palette-sc-status'),
		paletteColor: getValue('palette-color'),
		paletteOpacity: getValue('palette-opacity'),
		color: getValue('color'),
	};
};

export default getPaletteAttributes;
