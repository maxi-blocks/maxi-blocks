import breakpointAttributesCreator from '../breakpointAttributesCreator';

const opacity = breakpointAttributesCreator({
	obj: {
		opacity: {
			type: 'number',
			default: 1,
		},
	},
});

export default opacity;
