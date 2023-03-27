import breakpointAttributesCreator from '../breakpointAttributesCreator';

const opacity = breakpointAttributesCreator({
	obj: {
		o: {
			type: 'number',
			longLabel: 'opacity',
		},
	},
});

export default opacity;
