import transitionDefault from '../../extensions/styles/transitions/transitionDefault';

const transitionObj = {
	...transitionDefault,
	block: {
		border: {
			title: 'Border',
			target: ' .maxi-number-counter__box',
			property: 'border',
			hoverProp: 'number-counter-border-status-hover',
		},
		'box shadow': {
			title: 'Box shadow',
			target: ' .maxi-number-counter__box',
			property: 'box-shadow',
			hoverProp: 'number-counter-box-shadow-status-hover',
		},
	},
};

export default transitionObj;
