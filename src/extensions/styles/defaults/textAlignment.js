import breakpointObjectCreator from '../breakpointObjectCreator';

const rawTextAlignment = {
	'text-alignment': {
		type: 'string',
	}
};

const textAlignment = breakpointObjectCreator({
	obj: rawTextAlignment,
	addBreakpoint: true,
});

export default textAlignment;
