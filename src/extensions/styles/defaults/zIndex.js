import breakpointAttributesCreator from '@extensions/styles/breakpointAttributesCreator';

const zIndex = breakpointAttributesCreator({
	obj: {
		'z-index': {
			type: 'number',
		},
	},
});

export default zIndex;
