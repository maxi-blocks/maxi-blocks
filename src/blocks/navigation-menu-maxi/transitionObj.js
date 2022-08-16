import transitionDefault from '../../extensions/styles/transitions/transitionDefault';

const transitionObj = {
	...transitionDefault,
	block: {
		typography: {
			title: 'Typography',
			target: ' .menu-item__content',
			hoverProp: 'menu-item-typography-status-hover',
			property: 'typography',
			limitless: true,
		},
		'menu item effect': {
			title: 'Menu item effect',
			target: [
				' .menu-item__content::before',
				' .menu-item__content::after',
			],
			hoverProp: 'effect-status-hover',
			limitless: true,
		},
	},
};

export default transitionObj;
