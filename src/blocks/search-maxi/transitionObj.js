import { closeIconPrefix, buttonPrefix, inputPrefix } from './prefixes';

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
				' .maxi-search-block__button__default-icon svg > *',
				' .maxi-search-block__button__default-icon svg',
				' .maxi-search-block__button__default-icon',
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
			target: ' .maxi-search-block__button__content',
			property: 'typography',
			limitless: true,
			prefix: buttonPrefix,
		},
		border: {
			title: 'Border',
			target: ' .maxi-search-block__button',
			property: 'border',
			prefix: buttonPrefix,
		},
		'button background': {
			title: 'button background',
			target: ' .maxi-search-block__button',
			property: 'background',
			prefix: buttonPrefix,
		},
	},
	input: {
		typography: {
			title: 'Typography',
			target: ' .maxi-search-block__input',
			property: 'typography',
			limitless: true,
			prefix: inputPrefix,
		},
		border: {
			title: 'Border',
			target: ' .maxi-search-block__input',
			property: 'border',
			prefix: inputPrefix,
		},
		'input background': {
			title: 'Input background',
			target: ' .maxi-search-block__input',
			property: 'background',
			prefix: inputPrefix,
		},
		'icon reveal appear': {
			title: 'Icon reveal appear',
			target: ' .maxi-search-block__input',
			property: ['opacity', 'visibility', 'width'],
			prefix: inputPrefix,
			ignoreHoverProp: true,
		},
	},
};

export default transitionObj;
