import transitionDefault from '../../extensions/styles/transitions/transitionDefault';

const transitionObj = {
	...transitionDefault,
	block: {
		'box shadow': {
			title: 'Box shadow',
			target: ' hr.maxi-divider-block__divider',
			property: 'box-shadow',
		},
	},
};

export default transitionObj;
