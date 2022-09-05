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
		colour: {
			title: 'Colour',
			target: ' .maxi-svg-icon-block__icon svg *:not(g)',
			property: ['fill', 'stroke'],
			hoverProp: 'svg-status-hover',
		},
		background: {
			title: 'Background',
			target: ' .maxi-svg-icon-block__icon',
			property: 'background',
			hoverProp: 'svg-background-hover-status',
		},
	},
};

export default transitionObj;
