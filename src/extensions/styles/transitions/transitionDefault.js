const transitionDefault = {
	canvas: {
		border: {
			title: 'Border',
			target: ['', ' > .maxi-background-displayer'],
			property: ['border', 'top', 'left'],
		},
		'box shadow': {
			title: 'Box shadow',
			target: '',
			property: 'box-shadow',
		},
		'background / layer': {
			title: 'Background / Layer',
			target: ' > .maxi-background-displayer > div',
			property: 'background',
			limitless: true,
		},
	},
};

export default transitionDefault;
