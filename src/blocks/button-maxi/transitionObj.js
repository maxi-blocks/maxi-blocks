import transitionDefault from '../../extensions/styles/transitions/transitionDefault';

const transitionObj = {
	...transitionDefault,
	block: {
		typography: {
			title: 'Typography',
			target: ' .maxi-button-block__content',
			limitless: true,
			hoverProp: 'typography-status-hover',
		},
		'button background': {
			title: 'Button background',
			target: ' .maxi-button-block__button',
			property: 'background',
			hoverProp: 'button-background-hover-status',
		},
		border: {
			title: 'Border',
			target: ' .maxi-button-block__button',
			property: 'border',
			hoverProp: 'button-border-status-hover',
		},
		'box shadow': {
			title: 'Box shadow',
			target: ' .maxi-button-block__button',
			property: 'box-shadow',
			hoverProp: 'button-box-shadow-status-hover',
		},
	},
};

export default transitionObj;
