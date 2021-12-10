import breakpointObjectCreator from '../breakpointObjectCreator';

const transitionDuration = breakpointObjectCreator({
	obj: {
		'transition-duration': {
			type: 'number',
			default: 0.3,
		},
	},
});

export default transitionDuration;
