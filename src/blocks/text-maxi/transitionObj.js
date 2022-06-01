import transitionDefault from '../../extensions/styles/transitions/transitionDefault';

const transitionObj = {
	canvas: {
		...transitionDefault.canvas,
		typography: {
			title: 'Typography',
			target: ' .maxi-text-block__content, .maxi-text-block--link, .maxi-text-block--link span',
			limitless: true,
		},
	},
};

export default transitionObj;
