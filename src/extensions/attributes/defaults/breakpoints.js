import breakpointAttributesCreator from '../breakpointAttributesCreator';

const breakpoints = breakpointAttributesCreator({
	obj: {
		_bp: {
			type: 'number',
			longLabel: 'breakpoints',
		},
	},
});

export default breakpoints;
