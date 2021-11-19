export const selectorsButton = {
	canvas: {
		normal: {
			label: 'canvas',
			target: '',
		},
		hover: {
			label: 'canvas on hover',
			target: ':hover',
		},
	},
	'before canvas': {
		normal: {
			label: 'canvas :before',
			target: ':before',
		},
		hover: {
			label: 'canvas :before on hover',
			target: ':hover:before',
		},
	},
	'after canvas': {
		normal: {
			label: 'canvas :after',
			target: ':after',
		},
		hover: {
			label: 'canvas :after on hover',
			target: ':hover:after',
		},
	},
	button: {
		normal: {
			label: 'button',
			target: ' .maxi-button-block__button',
		},
		hover: {
			label: 'button on hover',
			target: ' .maxi-button-block__button:hover',
		},
	},
	'before button': {
		normal: {
			label: 'button :before',
			target: ' .maxi-button-block__button:before',
		},
		hover: {
			label: 'button :before on hover',
			target: ' .maxi-button-block__button:hover:before',
		},
	},
	'after button': {
		normal: {
			label: 'button :after',
			target: ' .maxi-button-block__button:after',
		},
		hover: {
			label: 'button :after on hover',
			target: ' .maxi-button-block__button:hover:after',
		},
	},
	'canvas background': {
		normal: {
			label: 'canvas background',
			target: '',
		},
		hover: {
			label: 'canvas background on hover',
			target: ':hover',
		},
	},
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

export const categoriesButton = [
	'canvas',
	'before canvas',
	'after canvas',
	'canvas background',
	'button',
	'before button',
	'after button',
	'icon',
];

export const selectorsMap = {};

export const categoriesMap = [
	'map',
	'before map',
	'after map',
	'title',
	'address',
];
