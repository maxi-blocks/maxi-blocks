import transitionDefault from '../../extensions/styles/transitions/transitionDefault';

const transitionObj = {
	canvas: {
		...transitionDefault.canvas,
		typography: {
			title: 'Typography',
			target: ' .maxi-text-block__content',
			property: 'typography',
			limitless: true,
		},
		link: {
			title: 'Link',
			target: [' .maxi-text-block--link', ' .maxi-text-block--link span'],
			property: 'color',
			ignoreHoverProp: true,
		},
	},
};

export default transitionObj;
