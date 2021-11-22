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
			label: 'map :before',
			target: ':before',
		},
		hover: {
			label: 'map :before on hover',
			target: ':hover:before',
		},
	},
	'after map': {
		normal: {
			label: 'map :after',
			target: ':after',
		},
		hover: {
			label: 'map :after on hover',
			target: ':hover:after',
		},
	},
	title: {
		normal: {
			label: 'title',
			target: ' .map-marker-info-window__title',
		},
		hover: {
			label: 'title on map hover',
			target: ':hover .map-marker-info-window__title',
		},
	},
	address: {
		normal: {
			label: 'address',
			target: ' .map-marker-info-window__address',
		},
		hover: {
			label: 'address on map hover',
			target: ':hover .map-marker-info-window__address',
		},
	},
};

export const categoriesMap = [
	'map',
	'before map',
	'after map',
	'title',
	'address',
];
