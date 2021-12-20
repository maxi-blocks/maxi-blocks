import breakpointAttributesCreator from '../breakpointAttributesCreator';

const columnSize = breakpointAttributesCreator({
	obj: {
		'column-size': {
			type: 'number',
			default: 90,
		},
	},
});

export default columnSize;
