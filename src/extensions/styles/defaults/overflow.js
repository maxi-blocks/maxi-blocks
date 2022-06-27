import breakpointAttributesCreator from '../breakpointAttributesCreator';

const rawOverflow = {
	'overflow-x': {
		type: 'string',
		default: 'visible',
	},
	'overflow-y': {
		type: 'string',
		default: 'visible',
	},
};

const overflow = breakpointAttributesCreator({
	obj: rawOverflow,
});

export default overflow;
