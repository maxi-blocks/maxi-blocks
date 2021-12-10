import breakpointObjectCreator from '../breakpointObjectCreator';

const textAlignment = breakpointObjectCreator({
	obj: {
		'text-alignment': {
			type: 'string',
		},
	},
});

export default textAlignment;
