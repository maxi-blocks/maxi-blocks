import transitionDefault from '../../extensions/styles/transitions/transitionDefault';

const transitionObj = {
	...transitionDefault,
	block: {
		typography: {
			title: 'Typography',
			target: ' .maxi-navigation-link-block__content',
			hoverProp: 'menu-item-typography-status-hover',
			property: 'typography',
			limitless: true,
		},
		// 'button background': {
		// 	title: 'Button background',
		// 	target: ' .maxi-button-block__button',
		// 	property: 'background',
		// },
		// border: {
		// 	title: 'Border',
		// 	target: ' .maxi-button-block__button',
		// 	property: 'border',
		// },
		// 'box shadow': {
		// 	title: 'Box shadow',
		// 	target: ' .maxi-button-block__button',
		// 	property: 'box-shadow',
		// },
		'menu item effect': {
			title: 'Menu item effect',
			target: ' .maxi-navigation-link-block__content::after',
			hoverProp: 'effect-status-hover',
			limitless: true,
		},
		// 'icon width': {
		// 	title: 'Icon width',
		// 	target: ' .maxi-button-block__icon svg',
		// 	property: ['width', 'height'],
		// 	hoverProp: 'icon-status-hover',
		// },
		// 'icon background': {
		// 	title: 'Icon background',
		// 	target: ' .maxi-button-block__icon',
		// 	property: 'background',
		// 	hoverProp: 'icon-status-hover',
		// },
		// 'icon border': {
		// 	title: 'Icon border',
		// 	target: ' .maxi-button-block__icon',
		// 	property: 'border',
		// 	hoverProp: 'icon-status-hover',
		// },
	},
};

export default transitionObj;
