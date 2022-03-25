import breakpointAttributesCreator from '../breakpointAttributesCreator';

const columnSize = breakpointAttributesCreator({
	obj: {
		'column-size': {
			type: 'number',
			default: 90,
		},
		'column-fit-content': {
			type: 'boolean',
		},
	},
});

export default columnSize;
