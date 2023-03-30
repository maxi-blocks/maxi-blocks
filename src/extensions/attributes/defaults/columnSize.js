import breakpointAttributesCreator from '../breakpointAttributesCreator';

const columnSize = breakpointAttributesCreator({
	obj: {
		_cs: {
			type: 'number',
			default: 90,
			longLabel: 'column-size',
		},
		_cfc: {
			type: 'boolean',
			longLabel: 'column-fit-content',
		},
	},
});

export default columnSize;
