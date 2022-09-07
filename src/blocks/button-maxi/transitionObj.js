import { createIconTransitions } from '../../extensions/styles';
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
		...createIconTransitions({
			target: ' .maxi-button-block__icon',
			prefix: 'icon-',
			titlePrefix: 'icon',
		}),
	},
};

export default transitionObj;
