const transitionDefault = {
	canvas: {
		border: {
			title: 'Border',
			target: ['', ' > .maxi-background-displayer'],
			property: ['border', 'border-radius', 'top', 'left'],
			hoverProp: 'bo.sh',
		},
		'box shadow': {
			title: 'Box shadow',
			target: '',
			property: 'box-shadow',
			hoverProp: 'bs.sh',
		},
		'background / layer': {
			title: 'Background / Layer',
			target: ' > .maxi-background-displayer > div',
			property: false,
			hoverProp: 'bb.sh',
		},
		opacity: {
			title: 'Opacity',
			target: '',
			property: 'opacity',
			hoverProp: '_o.sh',
		},
	},
};

export default transitionDefault;
