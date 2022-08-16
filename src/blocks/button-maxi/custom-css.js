import { createSelectors } from '../../extensions/styles/custom-css';

const selectorsButton = {
	...createSelectors({
		canvas: {
			label: 'canvas',
			target: '',
		},
		button: {
			label: 'button',
			target: ' .maxi-button-block__button',
		},
	}),
	icon: {
		normal: {
			label: 'icon',
			target: ' .maxi-button-block__icon',
		},
		svg: {
			label: "icon's svg",
			target: ' .maxi-button-block__icon svg',
		},
		insideSvg: {
			label: 'everything inside svg (svg > *)',
			target: ' .maxi-button-block__icon svg > *',
		},
		path: {
			label: "svg's path",
			target: ' .maxi-button-block__icon svg path',
		},
		hover: {
			label: 'icon on hover',
			target: ' .maxi-button-block__icon:hover',
		},
		hoverSvg: {
			label: "icon's svg on hover",
			target: ' .maxi-button-block__icon:hover svg',
		},
		hoverInsideSvg: {
			label: 'everything inside svg on hover (:hover svg > *)',
			target: ' .maxi-button-block__icon:hover svg > *',
		},
		hoverPath: {
			label: "svg's path on hover",
			target: ' .maxi-button-block__icon:hover svg path',
		},
	},
};

const categoriesButton = [
	'canvas',
	'before canvas',
	'after canvas',
	'button',
	'before button',
	'after button',
	'icon',
	'background',
	'background hover',
];
