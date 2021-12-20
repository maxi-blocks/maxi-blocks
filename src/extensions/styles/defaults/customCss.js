import breakpointAttributesCreator from '../breakpointAttributesCreator';

const customCss = breakpointAttributesCreator({
	obj: {
		'custom-css': {
			type: 'object',
		},
	},
});

export default customCss;
