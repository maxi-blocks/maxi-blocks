import breakpointAttributesCreator from '../breakpointAttributesCreator';

export const clipPathRaw = {
	cp: {
		type: 'string',
		default: 'none',
		longLabel: 'clip-path',
	},
	'cp.s': {
		type: 'boolean',
		default: false,
		longLabel: 'clip-path-status',
	},
};

const clipPath = {
	...breakpointAttributesCreator({
		obj: clipPathRaw,
	}),
	'cp.sh': {
		type: 'boolean',
		default: false,
		longLabel: 'clip-path-status-hover',
	},
};

export default clipPath;
