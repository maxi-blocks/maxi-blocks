import transitionDefault from '../../extensions/styles/transitions/transitionDefault';

const prefix = 'button-';

const transitionObj = {
	...transitionDefault,
	block: {
		typography: {
			title: 'Typography',
			target: ' .maxi-button-block__content',
			property: 'typography',
			limitless: true,
			prefix,
		},
		'button background': {
			title: 'Button background',
			target: ' .maxi-button-block__button',
			property: 'background',
			prefix,
		},
		border: {
			title: 'Border',
			target: ' .maxi-button-block__button',
			property: 'border',
			prefix,
		},
		'box shadow': {
			title: 'Box shadow',
			target: ' .maxi-button-block__button',
			property: 'box-shadow',
			prefix,
		},
		icon: {
			title: 'Icon',
			target: [
				' .maxi-button-block__icon__default-icon svg > *',
				' .maxi-button-block__icon__default-icon svg',
				' .maxi-button-block__icon__default-icon',
			],
			property: 'icon',
			limitless: true,
		},
		'close icon': {
			title: 'Close icon',
			target: [
				' .maxi-button-block__icon__close-icon svg > *',
				' .maxi-button-block__icon__close-icon svg',
				' .maxi-button-block__icon__close-icon',
			],
			property: 'icon',
			limitless: true,
			prefix: 'close-',
		},
	},
};

export default transitionObj;
