export const selectorsColumn = {
	column: {
		normal: {
			label: 'column',
			target: '.maxi-column-block',
		},
		hover: {
			label: 'column on hover',
			target: '.maxi-column-block:hover',
		},
	},
	'before column': {
		normal: {
			label: 'column :before',
			target: '.maxi-column-block::before',
		},
		hover: {
			label: 'column :before on hover',
			target: '.maxi-column-block:hover::before',
		},
	},
	'after column': {
		normal: {
			label: 'column :after',
			target: '.maxi-column-block::after',
		},
		hover: {
			label: 'column :after on hover',
			target: '.maxi-column-block:hover::after',
		},
	},
};

export const categoriesColumn = [
	'column',
	'before column',
	'after column',
	'background',
	'background hover',
];
