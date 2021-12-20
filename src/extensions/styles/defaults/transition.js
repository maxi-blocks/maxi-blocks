import breakpointAttributesCreator from '../breakpointAttributesCreator';

const transitionDuration = breakpointAttributesCreator({
	obj: {
		'transition-duration': {
			type: 'number',
			default: 0.3,
		},
	},
});

export default transitionDuration;
