export const selectorsNavigationLink = {
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
};

export const categoriesNavigationLink = ['canvas'];
