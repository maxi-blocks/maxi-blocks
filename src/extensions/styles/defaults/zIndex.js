import breakpointAttributesCreator from '../breakpointAttributesCreator';

const zIndex = breakpointAttributesCreator({
	obj: {
		'z-index': {
			type: 'number',
		},
	},
});

export default zIndex;
