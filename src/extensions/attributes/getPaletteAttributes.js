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
					target: key,
					breakpoint,
					attributes: obj,
					isHover,
					prefix,
			  });

	return {
		paletteStatus: getValue('_ps'),
		paletteColor: getValue('_pc'),
		paletteOpacity: getValue('_po'),
		color: getValue('_cc'),
	};
};

export default getPaletteAttributes;
