export const selectorsImage = {
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
	image: {
		normal: {
			label: 'image',
			target: ' .maxi-image-block__image',
		},
		hover: {
			label: 'image on hover',
			target: ' .maxi-image-block__image:hover',
		},
	},
	'before image': {
		normal: {
			label: 'image :before',
			target: ' .maxi-image-block__image::before',
		},
		hover: {
			label: 'image :before on hover',
			target: ' .maxi-image-block__image:hover::before',
		},
	},
	'after image': {
		normal: {
			label: 'image ::after',
			target: ' .maxi-image-block__image::after',
		},
		hover: {
			label: 'image ::after on hover',
			target: ' .maxi-image-block__image:hover::after',
		},
	},
};

export const categoriesImage = [
	'canvas',
	'before canvas',
	'after canvas',
	'image',
	'before image',
	'after image',
	'background',
	'background hover',
];
