import breakpointObjectCreator from '../breakpointObjectCreator';

const zIndex = breakpointObjectCreator({
	obj: {
		'z-index': {
			type: 'number',
		},
	},
});

export default zIndex;
