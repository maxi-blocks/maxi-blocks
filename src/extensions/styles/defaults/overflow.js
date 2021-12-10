import breakpointObjectCreator from '../breakpointObjectCreator';

const rawOverflow = {
	'overflow-x': {
		type: 'string',
	},
	'overflow-y': {
		type: 'string',
	},
};

const overflow = breakpointObjectCreator({
	obj: rawOverflow,
});

export default overflow;
