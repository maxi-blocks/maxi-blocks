import breakpointObjectCreator from '../breakpointObjectCreator';

const rawDisplay = {
	'display': {
		type: 'string',
	}
};

const display = breakpointObjectCreator({
	obj: rawDisplay
});

export default display;
