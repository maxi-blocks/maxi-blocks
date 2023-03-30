import breakpointAttributesCreator from '../breakpointAttributesCreator';

const rawOverflow = {
	_ox: {
		type: 'string',
		default: 'visible',
		longLabel: 'overflow-x',
	},
	_oy: {
		type: 'string',
		default: 'visible',
		longLabel: 'overflow-y',
	},
};

const overflow = breakpointAttributesCreator({
	obj: rawOverflow,
});

export default overflow;
