import breakpointObjectCreator from '../breakpointObjectCreator';

const rawTransitionDuration = {
	'transition-duration': {
		type: 'number',
		default: 0.3,
	},
};

const transitionDuration = breakpointObjectCreator({
	obj: rawTransitionDuration,
	addBreakpoint: true,
});


export default transitionDuration;
