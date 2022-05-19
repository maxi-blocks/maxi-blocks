import breakpointAttributesCreator from '../breakpointAttributesCreator';

const transition = breakpointAttributesCreator({
	obj: {
		'transition-duration': {
			type: 'number',
			default: 0.3,
		},
		'transition-delay': {
			type: 'number',
			default: 0,
		},
		'easing': {
			type: 'string',
			default: 'ease',
		}
	}
});

export default transition;
