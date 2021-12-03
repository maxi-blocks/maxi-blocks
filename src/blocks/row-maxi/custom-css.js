export const selectorsRow = {
	'row': {
		normal: {
			label: 'row',
			target: '.maxi-row-block',
		},
		hover: {
			label: 'row on hover',
			target: '.maxi-row-block:hover',
		},
	},
	'before row': {
		normal: {
			label: 'row :before',
			target: '.maxi-row-block::before',
		},
		hover: {
			label: 'row ::before on hover',
			target: '.maxi-row-block:hover::before',
		},
	},
	'after row': {
		normal: {
			label: 'row ::after',
			target: '.maxi-row-block::after',
		},
		hover: {
			label: 'row :after on hover',
			target: '.maxi-row-block:hover::after',
		},
	},
};

export const categoriesRow = [
	'row',
	'before row',
	'after row',
];
