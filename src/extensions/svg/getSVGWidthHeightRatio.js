/**
 * External dependencies
 */
import { round } from 'lodash';

const getSVGWidthHeightRatio = svg => {
	if (!svg) return 1;

	const { width, height } = svg.getBBox();
	console.log('width: ', width);
	console.log('height: ', height);
	console.log('round(width / height, 2): ', round(width / height, 2));
	return round(width / height, 2);
};

export default getSVGWidthHeightRatio;
