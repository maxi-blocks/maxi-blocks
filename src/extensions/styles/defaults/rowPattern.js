import breakpointObjectCreator from '../breakpointObjectCreator';

const rawRowPattern = {
	'row-pattern': {
		type: 'string',
	}
};

const rowPattern = breakpointObjectCreator({
	obj: rawRowPattern
});

export default rowPattern;
