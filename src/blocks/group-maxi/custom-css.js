export const selectorsGroup = {
	'group': {
		normal: {
			label: 'group',
			target: '.maxi-group-block',
		},
		hover: {
			label: 'group on hover',
			target: '.maxi-group-block:hover',
		},
	},
	'before group': {
		normal: {
			label: 'group :before',
			target: '.maxi-group-block::before',
		},
		hover: {
			label: 'group :before on hover',
			target: '.maxi-group-block:hover::before',
		},
	},
	'after group': {
		normal: {
			label: 'group ::after',
			target: '.maxi-group-block::after',
		},
		hover: {
			label: 'group :after on hover',
			target: '.maxi-group-block:hover::after',
		},
	},
};

export const categoriesGroup = [
	'group',
	'before group',
	'after group',
];
