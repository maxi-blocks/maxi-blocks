export const selectorsAccordion = {
	accordion: {
		normal: {
			title: 'accordion',
			target: '',
		},
		hover: {
			title: 'accordion on hover',
			target: ':hover',
		},
	},
	'before accordion': {
		normal: {
			label: 'accordion ::before',
			target: '::before',
		},
		hover: {
			label: 'accordion ::before on hover',
			target: ':hover::before',
		},
	},
	'after accordion': {
		normal: {
			label: 'accordion ::after',
			target: '::after',
		},
		hover: {
			label: 'accordion :after on hover',
			target: ':hover::after',
		},
	},
};

export const categoriesAccordion = [
	'accordion',
	'before accordion',
	'after accordion',
	'background',
	'background hover',
];
