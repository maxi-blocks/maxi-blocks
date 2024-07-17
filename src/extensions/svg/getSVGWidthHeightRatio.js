/**
 * External dependencies
 */
import { round } from 'lodash';

const getSVGElement = async (selector, blockRef) =>
	new Promise(resolve => {
		const checkForSVG = () => {
			const svgElement = blockRef.current?.querySelector(selector);
			if (svgElement) {
				resolve(svgElement);
			} else {
				setTimeout(checkForSVG, 100);
			}
		};
		checkForSVG();
	});

const getSVGWidthHeightRatio = async (selector, blockRef) => {
	const svg = await getSVGElement(selector, blockRef);
	if (!svg) return undefined;
	const { width, height } = svg.getBBox();
	return round(width / height, 2);
};

export default getSVGWidthHeightRatio;
