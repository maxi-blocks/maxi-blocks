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
	const getAttributeValueMemo = {};
	const getLastBreakpointAttributeMemo = {};

	const getValue = key => {
		const target = `${prefix}${key}`;

		if (isNil(breakpoint)) {
			if (!getAttributeValueMemo[target]) {
				getAttributeValueMemo[target] = getAttributeValue({
					target,
					props: obj,
					isHover,
				});
			}
			return getAttributeValueMemo[target];
		}
		const memoKey = `${target}-${breakpoint}`;
		if (!getLastBreakpointAttributeMemo[memoKey]) {
			getLastBreakpointAttributeMemo[memoKey] =
				getLastBreakpointAttribute({
					target,
					breakpoint,
					attributes: obj,
					isHover,
				});
		}
		return getLastBreakpointAttributeMemo[memoKey];
	};

	return {
		paletteStatus: getValue('palette-status'),
		paletteSCStatus: getValue('palette-sc-status'),
		paletteColor: getValue('palette-color'),
		paletteOpacity: getValue('palette-opacity'),
		color: getValue('color'),
	};
};

export default getPaletteAttributes;
