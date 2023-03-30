import breakpointAttributesCreator from '../breakpointAttributesCreator';

const opacity = breakpointAttributesCreator({
	obj: {
		_o: {
			type: 'number',
			longLabel: 'opacity',
		},
	},
});

export default opacity;
