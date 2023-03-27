import breakpointAttributesCreator from '../breakpointAttributesCreator';

const rawOverflow = {
	'overflow-x': {
		type: 'string',
		default: 'visible',
		longLabel: 'overflow-x',
	},
	'overflow-y': {
		type: 'string',
		default: 'visible',
		longLabel: 'overflow-y',
	},
};

const overflow = breakpointAttributesCreator({
	obj: rawOverflow,
});

export default overflow;
