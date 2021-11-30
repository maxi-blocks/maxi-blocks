export const selectorsRow = {
	'row': {
		normal: {
			label: 'row',
			target: '',
		},
		hover: {
			label: 'row on hover',
			target: ' :hover',
		},
	},
	'before row': {
		normal: {
			label: 'row :before',
			target: ' ::before',
		},
		hover: {
			label: 'row :before on hover',
			target: ' :hover::before',
		},
	},
	'after row': {
		normal: {
			label: 'row :after',
			target: ' ::after',
		},
		hover: {
			label: 'row :after on hover',
			target: ' :hover::after',
		},
	},
};

export const categoriesRow = [
	'row',
	'before row',
	'after row',
];
