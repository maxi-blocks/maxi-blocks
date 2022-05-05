export const selectorsContainer = {
	container: {
		normal: {
			label: 'container',
			target: '',
		},
		hover: {
			label: 'container on hover',
			target: ':hover',
		},
	},
	'before container': {
		normal: {
			label: 'container ::before',
			target: '::before',
		},
		hover: {
			label: 'container ::before on hover',
			target: ':hover::before',
		},
	},
	'after container': {
		normal: {
			label: 'container ::after',
			target: '::after',
		},
		hover: {
			label: 'container :after on hover',
			target: ':hover::after',
		},
	},
};

export const categoriesContainer = [
	'container',
	'before container',
	'after container',
	'background',
	'background hover',
];
