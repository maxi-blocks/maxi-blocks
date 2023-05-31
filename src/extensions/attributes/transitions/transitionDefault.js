const transitionDefault = {
	c: {
		bo: {
			ti: 'Border',
			ta: ['', ' > .maxi-background-displayer'],
			p: ['border', 'border-radius', 'top', 'left'],
			hp: 'bo.sh',
		},
		bs: {
			ti: 'Box shadow',
			ta: '',
			p: 'box-shadow',
			hp: 'bs.sh',
		},
		bl: {
			ti: 'Background / Layer',
			ta: ' > .maxi-background-displayer > div',
			p: false,
			hp: 'bb.sh',
		},
		o: {
			ti: 'Opacity',
			ta: '',
			p: 'opacity',
			hp: '_o.sh',
		},
	},
};

export default transitionDefault;
