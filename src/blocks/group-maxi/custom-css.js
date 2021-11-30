export const selectorsGroup = {
	'group': {
		normal: {
			label: 'group',
			target: '',
		},
		hover: {
			label: 'group on hover',
			target: ' :hover',
		},
	},
	'before group': {
		normal: {
			label: 'group :before',
			target: ' ::before',
		},
		hover: {
			label: 'group :before on hover',
			target: ' :hover::before',
		},
	},
	'after group': {
		normal: {
			label: 'group :after',
			target: ' ::after',
		},
		hover: {
			label: 'group :after on hover',
			target: ' :hover::after',
		},
	},
};

export const categoriesGroup = [
	'group',
	'before group',
	'after group',
];
