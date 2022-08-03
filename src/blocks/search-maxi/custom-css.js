export const selectorsSearch = {
	block: {
		normal: {
			label: 'block',
			target: '',
		},
		hover: {
			label: 'block on hover',
			target: ':hover',
		},
	},
	'before block': {
		normal: {
			label: 'block ::before',
			target: '::before',
		},
		hover: {
			label: 'block ::before on hover',
			target: ':hover::before',
		},
	},
	'after block': {
		normal: {
			label: 'block ::after',
			target: '::after',
		},
		hover: {
			label: 'block ::after on hover',
			target: ':hover::after',
		},
	},
	button: {
		normal: {
			label: 'button',
			target: ' .maxi-search-block__button',
		},
		hover: {
			label: 'button on hover',
			target: ' .maxi-search-block__button:hover',
		},
	},
	'before button': {
		normal: {
			label: 'button ::before',
			target: ' .maxi-search-block__button::before',
		},
		hover: {
			label: 'button ::before on hover',
			target: ' .maxi-search-block__button:hover::before',
		},
	},
	'after button': {
		normal: {
			label: 'button ::after',
			target: ' .maxi-search-block__button::after',
		},
		hover: {
			label: 'button ::after on hover',
			target: ' .maxi-search-block__button:hover::after',
		},
	},
	input: {
		normal: {
			label: 'input',
			target: ' .maxi-search-block__input',
		},
		hover: {
			label: 'input on hover',
			target: ' .maxi-search-block__input:hover',
		},
	},
	'before input': {
		normal: {
			label: 'input ::before',
			target: ' .maxi-search-block__input::before',
		},
		hover: {
			label: 'input ::before on hover',
			target: ' .maxi-search-block__input:hover::before',
		},
	},
	'after input': {
		normal: {
			label: 'input ::after',
			target: ' .maxi-search-block__input::after',
		},
		hover: {
			label: 'input ::after on hover',
			target: ' .maxi-search-block__input:hover::after',
		},
	},
	'placeholder input': {
		normal: {
			label: 'input ::placeholder',
			target: ' .maxi-search-block__input::placeholder',
		},
		hover: {
			label: 'input ::placeholder on hover',
			target: ' .maxi-search-block__input:hover::placeholder',
		},
	},
	icon: {
		normal: {
			label: 'icon',
			target: ' .maxi-search-block__button__default-icon',
		},
		svg: {
			label: "icon's svg",
			target: ' .maxi-search-block__button__default-icon svg',
		},
		insideSvg: {
			label: 'everything inside svg (svg > *)',
			target: ' .maxi-search-block__button__default-icon svg > *',
		},
		path: {
			label: "svg's path",
			target: ' .maxi-search-block__button__default-icon svg path',
		},
		hover: {
			label: 'icon on hover',
			target: ' .maxi-search-block__button__default-icon:hover',
		},
		hoverSvg: {
			label: "icon's svg on hover",
			target: ' .maxi-search-block__button__default-icon:hover svg',
		},
		hoverInsideSvg: {
			label: 'everything inside svg on hover (:hover svg > *)',
			target: ' .maxi-search-block__button__default-icon:hover svg > *',
		},
		hoverPath: {
			label: "svg's path on hover",
			target: ' .maxi-search-block__button__default-icon:hover svg path',
		},
	},
	'close icon': {
		normal: {
			label: 'icon',
			target: ' .maxi-search-block__button__close-icon',
		},
		svg: {
			label: "icon's svg",
			target: ' .maxi-search-block__button__close-icon svg',
		},
		insideSvg: {
			label: 'everything inside svg (svg > *)',
			target: ' .maxi-search-block__button__close-icon svg > *',
		},
		path: {
			label: "svg's path",
			target: ' .maxi-search-block__button__close-icon svg path',
		},
		hover: {
			label: 'icon on hover',
			target: ' .maxi-search-block__button__close-icon:hover',
		},
		hoverSvg: {
			label: "icon's svg on hover",
			target: ' .maxi-search-block__button__close-icon:hover svg',
		},
		hoverInsideSvg: {
			label: 'everything inside svg on hover (:hover svg > *)',
			target: ' .maxi-search-block__button__close-icon:hover svg > *',
		},
		hoverPath: {
			label: "svg's path on hover",
			target: ' .maxi-search-block__button__close-icon:hover svg path',
		},
	},
};

export const categoriesSearch = [
	'block',
	'before block',
	'after block',
	'button',
	'before button',
	'after button',
	'input',
	'before input',
	'after input',
	'placeholder input',
	'icon',
	'close icon',
];
