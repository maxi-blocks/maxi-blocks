import transitionDefault from '../../extensions/styles/transitions/transitionDefault';

const prefix = 'divider-';

const transitionObj = {
	...transitionDefault,
	block: {
		'box shadow': {
			title: 'Box shadow',
			target: ' hr.maxi-divider-block__divider',
			property: 'box-shadow',
			prefix,
		},
	},
};

export default transitionObj;
