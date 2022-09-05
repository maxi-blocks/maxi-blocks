import transitionDefault from '../../extensions/styles/transitions/transitionDefault';

const prefix = 'button-';

const transitionObj = {
	...transitionDefault,
	block: {
		typography: {
			title: 'Typography',
			target: ' .maxi-button-block__content',
			property: 'typography',
			limitless: true,
		},
		'button background': {
			title: 'Button background',
			target: ' .maxi-button-block__button',
			property: 'background',
			prefix,
		},
		border: {
			title: 'Border',
			target: ' .maxi-button-block__button',
			property: 'border',
			prefix,
		},
		'box shadow': {
			title: 'Box shadow',
			target: ' .maxi-button-block__button',
			property: 'box-shadow',
			prefix,
		},
		'icon colour': {
			title: 'Icon colour',
			target: ' .maxi-button-block__icon svg *:not(g)',
			property: ['fill', 'stroke'],
			hoverProp: 'icon-status-hover',
		},
		'icon width': {
			title: 'Icon width',
			target: ' .maxi-button-block__icon svg',
			property: ['width', 'height'],
			hoverProp: 'icon-status-hover',
		},
		'icon background': {
			title: 'Icon background',
			target: ' .maxi-button-block__icon',
			property: 'background',
			hoverProp: 'icon-status-hover',
		},
		'icon border': {
			title: 'Icon border',
			target: ' .maxi-button-block__icon',
			property: 'border',
			hoverProp: 'icon-status-hover',
		},
	},
};

export default transitionObj;
