export const selectorsNumberCounter = {
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
			label: 'canvas ::before',
			target: '::before',
		},
		hover: {
			label: 'canvas ::before on hover',
			target: ':hover::before',
		},
	},
	'after canvas': {
		normal: {
			label: 'canvas ::after',
			target: '::after',
		},
		hover: {
			label: 'canvas ::after on hover',
			target: ':hover::after',
		},
	},
	circle: {
		normal: {
			label: 'circle',
			target: ' .maxi-number-counter__box__circle',
		},
		hover: {
			label: 'circle on hover',
			target: ' .maxi-number-counter__box__circle:hover',
		},
	},
	number: {
		normal: {
			label: 'number',
			target: ' .maxi-number-counter__box__text',
		},
		hover: {
			label: 'number on hover',
			target: ' .maxi-number-counter__box__text:hover',
		},
	},
	'before number': {
		normal: {
			label: 'number ::before',
			target: ' .maxi-number-counter__box__text:::before',
		},
		hover: {
			label: 'number ::before on hover',
			target: ' .maxi-number-counter__box__text:hover:::before',
		},
	},
	'after number': {
		normal: {
			label: 'number ::after',
			target: ' .maxi-number-counter__box__text::after',
		},
		hover: {
			label: 'number ::after on hover',
			target: ' .maxi-number-counter__box__text:hover::after',
		},
	},
};

export const categoriesNumberCounter = [
	'canvas',
	'before canvas',
	'after canvas',
	'number',
	'before number',
	'after number',
	'circle',
	'background',
	'background hover',
];
