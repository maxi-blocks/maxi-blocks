export const selectorsPane = {
	pane: {
		normal: {
			label: 'pane',
			target: '',
		},
		hover: {
			label: 'pane on hover',
			target: ':hover',
		},
	},
	'before pane': {
		normal: {
			label: 'pane ::before',
			target: '::before',
		},
		hover: {
			label: 'pane ::before on hover',
			target: ':hover::before',
		},
	},
	'after pane': {
		normal: {
			label: 'pane ::after',
			target: '::after',
		},
		hover: {
			label: 'pane :after on hover',
			target: ':hover::after',
		},
	},
};

export const categoriesPane = [
	'pane',
	'before pane',
	'after pane',
	'background',
	'background hover',
];
