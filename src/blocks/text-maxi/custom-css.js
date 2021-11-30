export const selectorsText = {
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
			label: 'canvas :before',
			target: ':before',
		},
		hover: {
			label: 'canvas :before on hover',
			target: ':hover:before',
		},
	},
	'after canvas': {
		normal: {
			label: 'canvas :after',
			target: ':after',
		},
		hover: {
			label: 'canvas :after on hover',
			target: ':hover:after',
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
	text: {
		normal: {
			label: 'text',
			target: ' .maxi-text-block__content',
		},
		hover: {
			label: 'text on hover',
			target: ' .maxi-text-block__content:hover',
		},
	},
	'before text': {
		normal: {
			label: 'text :before',
			target: ' .maxi-text-block__content::before',
		},
		hover: {
			label: 'text :before on hover',
			target: ' .maxi-text-block__content:hover::before',
		},
	},
	'after text': {
		normal: {
			label: 'text :after',
			target: ' .maxi-text-block__content::after',
		},
		hover: {
			label: 'text :after on hover',
			target: ' .maxi-text-block__content:hover::after',
		},
	},
	'links': {
		normal: {
			label: 'links',
			target: ' .maxi-text-block--link',
		},
		hover: {
			label: 'links hover',
			target: ' .maxi-text-block--link:hover',
		},
	},
	'lists':{
		ordered: {
			label: 'Ordered list',
			target: ' ol.maxi-text-block__content',
		},
		unordered: {
			label: 'Unordered list',
			target: ' ul.maxi-text-block__content',
		},
	},
};

export const categoriesText = [
	'canvas',
	'before canvas',
	'after canvas',
	'canvas background',
	'text',
	'links',
	'lists',
];
