export const selectorsColumn = {
	'column': {
		normal: {
			label: 'column',
			target: '',
		},
		hover: {
			label: 'column on hover',
			target: ' :hover',
		},
	},
	'before column': {
		normal: {
			label: 'column :before',
			target: ' ::before',
		},
		hover: {
			label: 'column :before on hover',
			target: ' :hover::before',
		},
	},
	'after column': {
		normal: {
			label: 'column :after',
			target: ' ::after',
		},
		hover: {
			label: 'column :after on hover',
			target: ' :hover::after',
		},
	},
};

export const categoriesColumn = [
	'column',
	'before column',
	'after column',
];
