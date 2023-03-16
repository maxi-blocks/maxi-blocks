/**
 * Internal dependencies
 */
import getLastBreakpointAttribute from './getLastBreakpointAttribute';
import getAttributesValue from './getAttributesValue';

/**
 * External dependencies
 */
import { isNil } from 'lodash';

const getPaletteAttributes = ({ obj, prefix = '', breakpoint, isHover }) => {
	const getValue = key =>
		isNil(breakpoint)
			? getAttributesValue({
					target: key,
					prefix,
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
		paletteColor: getValue('palette-color'),
		paletteOpacity: getValue('palette-opacity'),
		color: getValue('color'),
	};
};

export default getPaletteAttributes;
