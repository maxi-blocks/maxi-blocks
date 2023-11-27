import createSelectors from './createSelectors';

const createIconSelector = (key, selector) => ({
	normal: {
		label: key,
		target: selector,
	},
	hover: {
		label: `${key} on hover`,
		target: `${selector}:hover`,
	},
	canvasHover: {
		label: `${key} on canvas hover`,
		target: `:hover ${selector}`,
	},
	svg: {
		label: `${key}'s svg`,
		target: `${selector} svg`,
	},
	hoverSvg: {
		label: `${key}'s svg on hover`,
		target: `${selector}:hover svg`,
	},
	canvasHoverSvg: {
		label: `${key}'s svg on canvas hover`,
		target: `:hover ${selector} svg`,
	},
	insideSvg: {
		label: 'everything inside svg (svg > *)',
		target: `${selector} svg > *`,
	},
	hoverInsideSvg: {
		label: 'everything inside svg on hover (:hover svg > *)',
		target: `${selector}:hover svg > *`,
	},
	canvasHoverInsideSvg: {
		label: 'everything inside svg on canvas hover (:hover svg > *)',
		target: `:hover ${selector} svg > *`,
	},
	path: {
		label: "svg's path",
		target: `${selector} svg path`,
	},
	hoverPath: {
		label: "svg's path on hover",
		target: `${selector}:hover svg path`,
	},
	canvasHoverPath: {
		label: "svg's path on canvas hover",
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
