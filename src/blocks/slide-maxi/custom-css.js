export const selectorsSlide = {
	slide: {
		normal: {
			label: 'slide',
			target: '',
		},
		hover: {
			label: 'slide on hover',
			target: ':hover',
		},
	},
	'before slide': {
		normal: {
			label: 'slide :before',
			target: '::before',
		},
		hover: {
			label: 'slide :before on hover',
			target: ':hover::before',
		},
	},
	'after slide': {
		normal: {
			label: 'slide :after',
			target: '::after',
		},
		hover: {
			label: 'slide :after on hover',
			target: ':hover::after',
		},
	},
};

export const categoriesSlide = [
	'slide',
	'before slide',
	'after slide',
	'background',
	'background hover',
];
