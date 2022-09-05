import { createIconTransitions } from '../../extensions/styles';
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
		...createIconTransitions({
			className: ' .maxi-svg-icon-block__icon',
			prefix,
			disableBackground: true,
			disableBorder: true,
			disableWidth: true,
		}),
		background: {
			title: 'Background',
			target: ' .maxi-svg-icon-block__icon',
			property: 'background',
			hoverProp: 'svg-background-hover-status',
		},
	},
};

export default transitionObj;
