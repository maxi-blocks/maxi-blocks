export const selectorsSvgIcon = {
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
	svg: {
		normal: {
			label: 'svg',
			target: ' .maxi-svg-icon-block__icon svg',
		},
		hover: {
			label: 'svg on hover',
			target: ' .maxi-svg-icon-block__icon svg:hover',
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
};

export const categoriesSvgIcon = [
	'canvas',
	'before canvas',
	'after canvas',
	'canvas background',
	'svg',
];
