import breakpointAttributesCreator from '../breakpointAttributesCreator';

const zIndex = breakpointAttributesCreator({
	obj: {
		_zi: {
			type: 'number',
			longLabel: 'z-index',
		},
	},
});

export default zIndex;
