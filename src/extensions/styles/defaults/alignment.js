import breakpointObjectCreator from '../breakpointObjectCreator';

const rawAlignment = {
	alignment: {
		type: 'string',
		default: 'center',
	},
};

const alignment = breakpointObjectCreator({
	obj: rawAlignment,
	addBreakpoint: true,
});

export default alignment;
