import createSelectors from './createSelectors';

const createIconSelector = (key, selector) => ({
	normal: {
		label: key,
		target: selector,
	},
	svg: {
		label: `${key}'s svg`,
		target: `${selector} svg`,
	},
	insideSvg: {
		label: 'everything inside svg (svg > *)',
		target: `${selector} svg > *`,
	},
	path: {
		label: "svg's path",
		target: `${selector} svg path`,
	},
	hover: {
		label: `${key} on hover`,
		target: `${selector}:hover`,
	},
	hoverSvg: {
		label: `${key}'s svg on hover`,
		target: `${selector}:hover svg`,
	},
	hoverInsideSvg: {
		label: 'everything inside svg on hover (:hover svg > *)',
		target: `${selector}:hover svg > *`,
	},
	hoverPath: {
		label: "svg's path on hover",
		target: `${selector}:hover svg path`,
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
