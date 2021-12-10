import breakpointObjectCreator from '../breakpointObjectCreator';

const columnSize = breakpointObjectCreator({
	obj: {
		'column-size': {
			type: 'number',
			default: 90,
		},
	},
});

export default columnSize;
