import transitionDefault from '../../extensions/styles/transitions/transitionDefault';

const prefix = 'image-';

const transitionObj = {
	...transitionDefault,
	block: {
		border: {
			title: 'Border',
			target: ' .maxi-image-block-wrapper img',
			property: 'border',
			prefix,
		},
		'box shadow': {
			title: 'Box shadow',
			target: ' .maxi-image-block-wrapper img',
			property: 'box-shadow',
			prefix,
		},
	},
};

export default transitionObj;
