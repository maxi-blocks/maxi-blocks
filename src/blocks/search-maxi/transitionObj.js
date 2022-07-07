import {
	closeIconPrefix,
	searchButtonPrefix,
	searchInputPrefix,
} from './prefixes';

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
			prefix: closeIconPrefix,
		},
		typography: {
			title: 'Typography',
			target: ' .maxi-search-block__input__content',
			property: 'typography',
			limitless: true,
			prefix: searchButtonPrefix,
		},
		border: {
			title: 'Border',
			target: ' .maxi-search-block__button',
			property: 'border',
			prefix: searchButtonPrefix,
		},
		'button background': {
			title: 'button background',
			target: ' .maxi-search-block__button',
			property: 'background',
			prefix: searchButtonPrefix,
		},
	},
	input: {
		typography: {
			title: 'Typography',
			target: ' .maxi-search-block__input',
			property: 'typography',
			limitless: true,
			prefix: searchInputPrefix,
		},
		border: {
			title: 'Border',
			target: ' .maxi-search-block__input',
			property: 'border',
			prefix: searchInputPrefix,
		},
		'input background': {
			title: 'Input background',
			target: ' .maxi-search-block__input',
			property: 'background',
			prefix: searchInputPrefix,
		},
	},
};

export default transitionObj;
