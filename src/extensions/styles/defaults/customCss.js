import breakpointAttributesCreator from '@extensions/styles/breakpointAttributesCreator';

const customCss = breakpointAttributesCreator({
	obj: {
		'custom-css': {
			type: 'object',
		},
	},
});

export default customCss;
