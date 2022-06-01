import transitionDefault from '../../extensions/styles/transitions/transitionDefault';

const transitionObj = {
	...transitionDefault,
	block: {
		border: {
			title: 'Border',
			target: ' .maxi-svg-icon-block__icon',
			property: 'border',
		},
		'box shadow': {
			title: 'Box shadow',
			target: ' .maxi-svg-icon-block__icon',
			property: 'box-shadow',
		},
	},
};

export default transitionObj;
