import createSelectors from './createSelectors';
import { __ } from '@wordpress/i18n';

const createIconSelector = (key, selector) => ({
	normal: {
		label: key,
		target: selector,
	},
	hover: {
		label: `${key} ${__('on hover', 'maxi-blocks')}`,
		target: `${selector}:hover`,
	},
	canvasHover: {
		label: `${key} ${__('on canvas hover', 'maxi-blocks')}`,
		target: `:hover ${selector}`,
	},
	svg: {
		label: `${key}'s svg`,
		target: `${selector} svg`,
	},
	hoverSvg: {
		label: `${key}'s svg ${__('on hover', 'maxi-blocks')}`,
		target: `${selector}:hover svg`,
	},
	canvasHoverSvg: {
		label: `${key}'s svg ${__('on canvas hover', 'maxi-blocks')}`,
		target: `:hover ${selector} svg`,
	},
	insideSvg: {
		label: __('everything inside svg (svg > *)', 'maxi-blocks'),
		target: `${selector} svg > *`,
	},
	hoverInsideSvg: {
		label: __(
			'everything inside svg on hover (:hover svg > *)',
			'maxi-blocks'
		),
		target: `${selector}:hover svg > *`,
	},
	canvasHoverInsideSvg: {
		label: __(
			'everything inside svg on canvas hover (:hover svg > *)',
			'maxi-blocks'
		),
		target: `:hover ${selector} svg > *`,
	},
	path: {
		label: __("svg's path", 'maxi-blocks'),
		target: `${selector} svg path`,
	},
	hoverPath: {
		label: __("svg's path on hover", 'maxi-blocks'),
		target: `${selector}:hover svg path`,
	},
	canvasHoverPath: {
		label: __("svg's path on canvas hover", 'maxi-blocks'),
		target: `:hover ${selector} svg path`,
	},
});

const createIconSelectors = selectors => ({
	...Object.fromEntries(
		Object.entries(selectors).map(([key, selector]) => [
			key,
			createIconSelector(key, selector),
		])
	),
	...createSelectors(selectors, true, true),
});

export default createIconSelectors;
