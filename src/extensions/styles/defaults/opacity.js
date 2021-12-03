import breakpointObjectCreator from '../breakpointObjectCreator';

const rawOpacity = {
	'opacity': {
		type: 'number',
	}
};

const opacity = breakpointObjectCreator({
	obj: rawOpacity
});

export default opacity;
