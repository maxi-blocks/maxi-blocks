import transitionDefault from '../../extensions/styles/transitions/transitionDefault';

const transitionObj = {
	...transitionDefault,
	block: {
		typography: {
			title: 'Typography',
			target: ' .maxi-button-block__content',
			limitless: true,
		},
		'button background': {
			title: 'Button background',
			target: ' .maxi-button-block__button',
			property: 'background',
		},
		border: {
			title: 'Border',
			target: ' .maxi-button-block__button',
			property: 'border',
		},
		'box shadow': {
			title: 'Box shadow',
			target: ' .maxi-button-block__button',
			property: 'box-shadow',
		},
	},
};

export default transitionObj;
