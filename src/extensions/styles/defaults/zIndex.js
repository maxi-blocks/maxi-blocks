import breakpointObjectCreator from '../breakpointObjectCreator';

const rawZindex = {
	'z-index': {
		type: 'number',
	}
};

const zIndex = breakpointObjectCreator({
	obj: rawZindex
});

export default zIndex;
