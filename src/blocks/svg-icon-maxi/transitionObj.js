import transitionDefault from '../../extensions/styles/transitions/transitionDefault';

const transitionObj = {
	...transitionDefault,
	block: {
		border: {
			title: 'Border',
			target: ' .maxi-svg-icon-block__icon',
			property: 'border',
			hoverProp: 'svg-border-status-hover',
		},
		'box shadow': {
			title: 'Box shadow',
			target: ' .maxi-svg-icon-block__icon',
			property: 'box-shadow',
			hoverProp: 'svg-box-shadow-status-hover',
		},
	},
};

export default transitionObj;
