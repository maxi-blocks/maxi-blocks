/**
 * External dependencies
 */
import { round } from 'lodash';

const getSVGWidthHeightRatio = svg => {
	if (!svg) return 1;

	const { width, height } = svg.getBBox();
	return round(width / height, 2);
};

export default getSVGWidthHeightRatio;
