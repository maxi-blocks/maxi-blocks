export const selectorsContainer = {
	'container': {
		normal: {
			label: 'container',
			target: ' .maxi-container-block__container',
		},
		hover: {
			label: 'container on hover',
			target: ' .maxi-container-block__container:hover',
		},
	},
	'before container': {
		normal: {
			label: 'container :before',
			target: ' .maxi-container-block__container::before',
		},
		hover: {
			label: 'container :before on hover',
			target: ' .maxi-container-block__container::before',
		},
	},
	'after container': {
		normal: {
			label: 'container :after',
			target: ' .maxi-container-block__container::after',
		},
		hover: {
			label: 'container :after on hover',
			target: ' .maxi-container-block__container:hover::after',
		},
	},
};

export const categoriesContainer = [
	'container',
	'before container',
	'after container',
];
