import breakpointObjectCreator from '../breakpointObjectCreator';

const rawBreakpoints = {
	'breakpoints': {
		type: 'number',
	},
};

const breakpoints = breakpointObjectCreator({
	obj: rawBreakpoints
});

export default breakpoints;
