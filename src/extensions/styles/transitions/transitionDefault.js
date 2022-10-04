const transitionDefault = {
	canvas: {
		border: {
			title: 'Border',
			target: ['', ' > .maxi-background-displayer'],
			property: ['border', 'top', 'left'],
			hoverProp: 'border-status-hover',
		},
		'box shadow': {
			title: 'Box shadow',
			target: '',
			property: 'box-shadow',
			hoverProp: 'box-shadow-status-hover',
		},
		'background / layer': {
			title: 'Background / Layer',
			target: ' > .maxi-background-displayer > div',
			property: false,
			hoverProp: 'block-background-status-hover',
		},
	},
};

export default transitionDefault;
