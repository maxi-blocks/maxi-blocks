export const selectorsText = {
	'text wrapper': {
		normal: {
			label: 'text wrapper',
			target: '',
		},
		hover: {
			label: 'text wrapper on hover',
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
			label: 'text ::before',
			target: ' .maxi-text-block__content::before',
		},
		hover: {
			label: 'text ::before on hover',
			target: ' .maxi-text-block__content:hover::before',
		},
	},
	'after text': {
		normal: {
			label: 'text ::after',
			target: ' .maxi-text-block__content::after',
		},
		hover: {
			label: 'text ::after on hover',
			target: ' .maxi-text-block__content:hover::after',
		},
	},
	links: {
		normal: {
			label: 'links',
			target: ' .maxi-text-block--link',
		},
		hover: {
			label: 'links hover',
			target: ' .maxi-text-block--link:hover',
		},
	},
	lists: {
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
	'text wrapper',
	'text',
	'links',
	'lists',
	'before text',
	'after text',
	'background',
	'background hover',
];
