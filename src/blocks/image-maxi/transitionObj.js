import transitionDefault from '../../extensions/styles/transitions/transitionDefault';

const transitionObj = {
	...transitionDefault,
	block: {
		border: {
			title: 'Border',
			target: ' .maxi-image-block-wrapper img',
			property: 'border',
		},
		'box shadow': {
			title: 'Box shadow',
			target: ' .maxi-image-block-wrapper img',
			property: 'box-shadow',
		},
	},
};

export default transitionObj;
