import transitionDefault from '../../extensions/styles/transitions/transitionDefault';

const transitionObj = {
	...transitionDefault,
	block: {
		border: {
			title: 'Border',
			target: ' .maxi-image-block-wrapper img',
			property: 'border',
			hoverProp: 'image-border-status-hover',
		},
		'box shadow': {
			title: 'Box shadow',
			target: ' .maxi-image-block-wrapper img',
			property: 'box-shadow',
			hoverProp: 'image-box-shadow-status-hover',
		},
	},
};

export default transitionObj;
