export const selectorsDivider = {
	canvas: {
		normal: {
			label: 'canvas',
			target: '',
		},
		hover: {
			label: 'canvas on hover',
			target: ':hover',
		},
	},
	'before canvas': {
		normal: {
			label: 'canvas ::before',
			target: '::before',
		},
		hover: {
			label: 'canvas ::before on hover',
			target: ':hover::before',
		},
	},
	'after canvas': {
		normal: {
			label: 'canvas ::after',
			target: '::after',
		},
		hover: {
			label: 'canvas ::after on hover',
			target: ':hover::after',
		},
	},
	divider: {
		normal: {
			label: 'divider',
			target: ' .maxi-divider-block__divider',
		},
		hover: {
			label: 'divider on hover',
			target: ' .maxi-divider-block__divider:hover',
		},
	},
	'before divider': {
		normal: {
			label: 'divider :before',
			target: ' .maxi-divider-block__divider::before',
		},
		hover: {
			label: 'divider :before on hover',
			target: ' .maxi-divider-block__divider:hover::before',
		},
	},
	'after divider': {
		normal: {
			label: 'divider :after',
			target: ' .maxi-divider-block__divider::after',
		},
		hover: {
			label: 'divider :after on hover',
			target: ' .maxi-divider-block__divider:hover::after',
		},
	},
	'canvas background': {
		normal: {
			label: 'canvas background',
			target: '',
		},
		hover: {
			label: 'canvas background on hover',
			target: ':hover',
		},
	},
};

export const categoriesDivider = [
	'canvas',
	'before canvas',
	'after canvas',
	'canvas background',
	'divider',
	'before divider',
	'after divider',
];
