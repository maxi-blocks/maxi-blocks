import breakpointAttributesCreator from '../breakpointAttributesCreator';

const customCss = breakpointAttributesCreator({
	obj: {
		cc: {
			type: 'object',
			longLabel: 'custom-css',
		},
	},
});

export default customCss;
