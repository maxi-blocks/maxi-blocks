import transitionDefault from '../../extensions/styles/transitions/transitionDefault';

const prefix = 'svg-';

const transitionObj = {
	...transitionDefault,
	block: {
		border: {
			title: 'Border',
			target: ' .maxi-svg-icon-block__icon',
			property: 'border',
			prefix,
		},
		'box shadow': {
			title: 'Box shadow',
			target: ' .maxi-svg-icon-block__icon',
			property: 'box-shadow',
			prefix,
		},
	},
};

export default transitionObj;
