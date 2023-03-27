import breakpointAttributesCreator from '../breakpointAttributesCreator';

const columnSize = breakpointAttributesCreator({
	obj: {
		cs: {
			type: 'number',
			default: 90,
			longLabel: 'column-size',
		},
		cfc: {
			type: 'boolean',
			longLabel: 'column-fit-content',
		},
	},
});

export default columnSize;
