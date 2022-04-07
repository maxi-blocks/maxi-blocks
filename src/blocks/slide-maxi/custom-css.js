export const selectorsSlide = {
	slide: {
		normal: {
			label: 'slide',
			target: '.maxi-slide-block',
		},
		hover: {
			label: 'slide on hover',
			target: '.maxi-slide-block:hover',
		},
	},
	'before slide': {
		normal: {
			label: 'slide :before',
			target: '.maxi-slide-block::before',
		},
		hover: {
			label: 'slide :before on hover',
			target: '.maxi-slide-block:hover::before',
		},
	},
	'after slide': {
		normal: {
			label: 'slide :after',
			target: '.maxi-slide-block::after',
		},
		hover: {
			label: 'slide :after on hover',
			target: '.maxi-slide-block:hover::after',
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
