export const selectorsMap = {
	map: {
		normal: {
			label: 'map',
			target: '',
		},
		hover: {
			label: 'map on hover',
			target: ':hover',
		},
	},
	'before map': {
		normal: {
			label: 'map ::before',
			target: '::before',
		},
		hover: {
			label: 'map ::before on hover',
			target: ':hover::before',
		},
	},
	'after map': {
		normal: {
			label: 'map ::after',
			target: '::after',
		},
		hover: {
			label: 'map ::after on hover',
			target: ':hover::after',
		},
	},
	popup: {
		normal: {
			label: 'popup',
			target: ' .maxi-map-block__popup',
		},
		hover: {
			label: 'popup on hover',
			target: ' .maxi-map-block__popup:hover',
		},
	},
	'after popup': {
		normal: {
			label: 'popup ::after',
			target: ' .maxi-map-block__popup::after',
		},
		hover: {
			label: 'popup ::after on hover',
			target: ' .maxi-map-block__popup:hover::after',
		},
	},
	'popup arrow': {
		normal: {
			label: 'popup arrow',
			target: ' .maxi-map-block__popup::before',
		},
		hover: {
			label: 'popup arrow on hover',
			target: ' .maxi-map-block__popup:hover::before',
		},
	},
	title: {
		normal: {
			label: 'title',
			target: ' .maxi-map-block__popup__content__title',
		},
		hover: {
			label: 'title on popup hover',
			target: ' .maxi-map-block__popup:hover .maxi-map-block__popup__content__title',
		},
	},
	'after title': {
		normal: {
			label: 'title ::after',
			target: ' .maxi-map-block__popup__content__title::after',
		},
		hover: {
			label: 'title ::after on popup hover',
			target: ' .maxi-map-block__popup:hover .maxi-map-block__popup__content__title::after',
		},
	},
	description: {
		normal: {
			label: 'description',
			target: ' .maxi-map-block__popup__content__description',
		},
		hover: {
			label: 'address on map hover',
			target: ' .maxi-map-block__popup:hover .maxi-map-block__popup__content__description',
		},
	},
	'after description': {
		normal: {
			label: 'description ::after',
			target: ' .maxi-map-block__popup__content__description::after',
		},
		hover: {
			label: 'description ::after on map hover',
			target: ' .maxi-map-block__popup:hover .maxi-map-block__popup__content__description::after',
		},
	},
};

export const categoriesMap = [
	'map',
	'before map',
	'after map',
	'popup',
	'after popup',
	'popup arrow',
	'title',
	'after title',
	'before title',
	'description',
	'after description',
	'before description',
];
