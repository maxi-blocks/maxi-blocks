/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

const getAreaLabel = iconContent => {
	const defaultLabel = __('Icon', 'maxi-blocks');

	if (!iconContent) return defaultLabel;

	const svgClass = iconContent.match(/ class="(.+?(?=))"/)?.[1];

	if (!svgClass) return defaultLabel;

	const replaceForLabel = svgClass =>
		svgClass
			.replace('-line-maxi-svg', '')
			.replace('-fill-maxi-svg', '')
			.replace('-shape-maxi-svg', '')
			.replaceAll('-', ' ');

	const ariaLabel = `${replaceForLabel(svgClass)} icon`;

	return __(`${ariaLabel}`, 'maxi-blocks') || defaultLabel;
};

export default getAreaLabel;
