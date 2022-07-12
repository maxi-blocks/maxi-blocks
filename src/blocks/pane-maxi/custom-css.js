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
	header: {
		normal: {
			label: 'pane header',
			target: ' .maxi-pane-block__header',
		},
		hover: {
			label: 'pane header on hover',
			target: ' .maxi-pane-block__header:hover',
		},
	},
	content: {
		normal: {
			label: 'pane content',
			target: ' .maxi-pane-block__content',
		},
		hover: {
			label: 'pane content on hover',
			target: ' .maxi-pane-block__content:hover',
		},
	},
};

export const categoriesPane = [
	'pane',
	'before pane',
	'after pane',
	'header',
	'content',
	'background',
	'background hover',
];
