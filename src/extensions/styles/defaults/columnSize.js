import breakpointAttributesCreator from '../breakpointAttributesCreator';

const columnSize = breakpointAttributesCreator({
	obj: {
		'column-size': {
			type: 'string',
			default: '90',
		},
	},
});

export default columnSize;
