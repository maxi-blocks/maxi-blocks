/**
 * Internal dependencies
 */
import { getSVGWidthStyles } from './getSVGStyles';

const getIconSize = (
	obj,
	isHover = false,
	prefix = '',
	iconWidthHeightRatio = 1
) =>
	getSVGWidthStyles({
		obj,
		isHover,
		prefix: `${prefix}icon-`,
		iconWidthHeightRatio,
		disableHeight: false,
	});

export default getIconSize;
