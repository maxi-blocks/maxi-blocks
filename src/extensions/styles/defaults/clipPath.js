import breakpointAttributesCreator from '../breakpointAttributesCreator';

const clipPath = breakpointAttributesCreator({
	obj: {
		'clip-path': {
			type: 'string',
		},
		'clip-path-status': {
			type: 'boolean',
			default: false,
		},
	},
});

export default clipPath;
