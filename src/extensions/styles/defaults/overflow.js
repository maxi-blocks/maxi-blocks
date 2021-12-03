import breakpointObjectCreator from '../breakpointObjectCreator';

const rawOverflow = {
	label: 'Overflow',
	'overflow-x': {
		type: 'string',
	},
	'overflow-y': {
		type: 'string',
	},
};

const overflow = breakpointObjectCreator({
	obj: rawOverflow,
	addBreakpoint: true,
});

export default overflow;
