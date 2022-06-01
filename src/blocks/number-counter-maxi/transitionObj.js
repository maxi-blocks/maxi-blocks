import transitionDefault from '../../extensions/styles/transitions/transitionDefault';

const transitionObj = {
	...transitionDefault,
	block: {
		border: {
			title: 'Border',
			target: ' .maxi-number-counter__box',
			property: 'border',
		},
		'box shadow': {
			title: 'Box shadow',
			target: ' .maxi-number-counter__box',
			property: 'box-shadow',
		},
	},
};

export default transitionObj;
