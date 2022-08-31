export const selectorsSlider = {
	slider: {
		normal: {
			label: 'slider',
			target: '',
		},
		hover: {
			label: 'slider on hover',
			target: ':hover',
		},
	},
	'before slider': {
		normal: {
			label: 'slider :before',
			target: '::before',
		},
		hover: {
			label: 'slider ::before on hover',
			target: ':hover::before',
		},
	},
	'after slider': {
		normal: {
			label: 'slider ::after',
			target: '::after',
		},
		hover: {
			label: 'slider :after on hover',
			target: ':hover::after',
		},
	},
	'first arrow': {
		normal: {
			label: 'first arrow',
			target: ' .maxi-slider-block__arrow--prev',
		},
		hover: {
			label: 'first arrow on hover',
			target: ' .maxi-slider-block__arrow--prev:hover',
		},
	},
	'second arrow': {
		normal: {
			label: 'second arrow',
			target: ' .maxi-slider-block__arrow--next',
		},
		hover: {
			label: 'second arrow on hover',
			target: ' .maxi-slider-block__arrow--next:hover',
		},
	},
	'first arrow icon': {
		normal: {
			label: 'first arrow icon',
			target: ' .maxi-slider-block__arrow--prev svg',
		},
		hover: {
			label: 'first arrow icon on hover',
			target: ' .maxi-slider-block__arrow--prev:hover svg',
		},
	},
	'second arrow icon': {
		normal: {
			label: 'second arrow icon',
			target: ' .maxi-slider-block__arrow--next svg',
		},
		hover: {
			label: 'second arrow icon on hover',
			target: ' .maxi-slider-block__arrow--next:hover svg',
		},
	},
	'all dots': {
		normal: {
			label: 'all dots',
			target: ' .maxi-slider-block__dots',
		},
		hover: {
			label: 'all dots on hover',
			target: ' .maxi-slider-block__dots:hover',
		},
	},
	dot: {
		normal: {
			label: 'Each dot',
			target: ' .maxi-slider-block__dot',
		},
		hover: {
			label: 'Each dot on hover',
			target: ' .maxi-slider-block__dot:hover',
		},
	},
	'dot icon': {
		normal: {
			label: 'Each dot icon',
			target: ' .maxi-slider-block__dot svg',
		},
		hover: {
			label: 'Each dot icon on hover',
			target: ' .maxi-slider-block__dot:hover svg',
		},
	},
};

export const categoriesSlider = [
	'slider',
	'before slider',
	'after slider',
	'first arrow',
	'second arrow',
	'first arrow icon',
	'second arrow icon',
	'all dots',
	'dot',
	'dot icon',
];
