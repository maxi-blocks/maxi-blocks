import breakpointObjectCreator from '../breakpointObjectCreator';

const rawColumnSize = {
	'column-size': {
		type: 'number',
		default: 90,
	},
};

const columnSize = breakpointObjectCreator({
	obj: rawColumnSize
});

export default columnSize;
