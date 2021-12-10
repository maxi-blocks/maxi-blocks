import breakpointObjectCreator from '../breakpointObjectCreator';

const alignment = breakpointObjectCreator({
	obj: {
		alignment: {
			type: 'string',
			default: 'center',
		},
	},
});

export default alignment;
