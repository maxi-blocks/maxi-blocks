import transitionDefault from '../../extensions/styles/transitions/transitionDefault';

const prefix = 'number-counter-';

const transitionObj = {
	...transitionDefault,
	block: {
		border: {
			title: 'Border',
			target: ' .maxi-number-counter__box',
			property: 'border',
			prefix,
		},
		'box shadow': {
			title: 'Box shadow',
			target: ' .maxi-number-counter__box',
			property: 'box-shadow',
			prefix,
		},
	},
};

export default transitionObj;
