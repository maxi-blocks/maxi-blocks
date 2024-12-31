import breakpointAttributesCreator from '@extensions/styles/breakpointAttributesCreator';

const opacity = breakpointAttributesCreator({
	obj: {
		opacity: {
			type: 'number',
		},
	},
});

export default opacity;
