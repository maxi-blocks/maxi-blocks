export const selectorsSlider = {
	slider: {
		normal: {
			label: 'slider',
			target: '.maxi-slider-block',
		},
		hover: {
			label: 'slider on hover',
			target: '.maxi-slider-block:hover',
		},
	},
	'before slider': {
		normal: {
			label: 'slider :before',
			target: '.maxi-slider-block::before',
		},
		hover: {
			label: 'slider ::before on hover',
			target: '.maxi-slider-block:hover::before',
		},
	},
	'after slider': {
		normal: {
			label: 'slider ::after',
			target: '.maxi-slider-block::after',
		},
		hover: {
			label: 'slider :after on hover',
			target: '.maxi-slider-block:hover::after',
		},
	},
};

export const categoriesSlider = ['slider', 'before slider', 'after slider'];
