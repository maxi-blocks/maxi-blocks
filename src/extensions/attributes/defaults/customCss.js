import breakpointAttributesCreator from '../breakpointAttributesCreator';

const customCss = breakpointAttributesCreator({
	obj: {
		_ccs: {
			type: 'object',
			longLabel: 'custom-css',
		},
	},
});

export default customCss;
