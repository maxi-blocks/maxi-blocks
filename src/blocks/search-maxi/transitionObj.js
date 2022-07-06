const transitionObj = {
	block: {
		border: {
			title: 'Border',
			target: ['', ' > .maxi-background-displayer'],
			property: ['border', 'top', 'left'],
		},
		'box shadow': {
			title: 'Box shadow',
			target: '',
			property: 'box-shadow',
		},
	},
	button: {
		icon: {
			title: 'Icon',
			target: [
				' .maxi-search-block__button__icon svg > *',
				' .maxi-search-block__button__icon svg',
				' .maxi-search-block__button__icon',
			],
			property: 'icon',
			limitless: true,
		},
		'close icon': {
			title: 'Close icon',
			target: [
				' .maxi-search-block__button__close-icon svg > *',
				' .maxi-search-block__button__close-icon svg',
				' .maxi-search-block__button__close-icon',
			],
			property: 'icon',
			limitless: true,
			prefix: 'close-',
		},
		typography: {
			title: 'Typography',
			target: ' .maxi-search-block__input__content',
			property: 'typography',
			limitless: true,
			prefix: 'search-button-',
		},
		border: {
			title: 'Border',
			target: ' .maxi-search-block__button',
			property: 'border',
			prefix: 'search-button-',
		},
		'button background': {
			title: 'button background',
			target: ' .maxi-search-block__button',
			property: 'background',
			prefix: 'search-button-',
		},
	},
	input: {
		typography: {
			title: 'Typography',
			target: ' .maxi-search-block__input',
			property: 'typography',
			limitless: true,
			prefix: 'search-input-',
		},
		border: {
			title: 'Border',
			target: ' .maxi-search-block__input',
			property: 'border',
			prefix: 'search-input-',
		},
		'input background': {
			title: 'Input background',
			target: ' .maxi-search-block__input',
			property: 'background',
			prefix: 'search-input-',
		},
	},
};

export default transitionObj;
