import breakpointAttributesCreator from '../breakpointAttributesCreator';

const breakpoints = breakpointAttributesCreator({
	obj: {
		bp: {
			type: 'number',
			longLabel: 'breakpoints',
		},
	},
});

export default breakpoints;
