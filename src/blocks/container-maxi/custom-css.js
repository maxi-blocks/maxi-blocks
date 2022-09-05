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
	'top shape divider': {
		normal: {
			label: 'top shape divider',
			target: ' .maxi-shape-divider__top',
		},
		hover: {
			label: 'top shape divider on hover',
			target: ' .maxi-shape-divider__top:hover',
		},
	},
	'bottom shape divider': {
		normal: {
			label: 'bottom shape divider',
			target: ' .maxi-shape-divider__bottom',
		},
		hover: {
			label: 'bottom shape divider on hover',
			target: ' .maxi-shape-divider__bottom:hover',
		},
	},
};

export const categoriesContainer = [
	'container',
	'before container',
	'after container',
	'top shape divider',
	'bottom shape divider',
	'background',
	'background hover',
];
