import breakpointAttributesCreator from '../breakpointAttributesCreator';

const rawOverflow = {
	'overflow-x': {
		type: 'string',
	},
	'overflow-y': {
		type: 'string',
	},
};

const overflow = breakpointAttributesCreator({
	obj: rawOverflow,
});

export default overflow;
