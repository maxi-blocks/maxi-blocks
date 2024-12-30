import breakpointAttributesCreator from '@extensions/styles/breakpointAttributesCreator';

const breakpoints = breakpointAttributesCreator({
	obj: {
		breakpoints: {
			type: 'number',
		},
	},
});

export default breakpoints;
