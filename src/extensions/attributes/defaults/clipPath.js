import breakpointAttributesCreator from '../breakpointAttributesCreator';

export const clipPathRaw = {
	_cp: {
		type: 'string',
		default: 'none',
		longLabel: 'clip-path',
	},
	'_cp.s': {
		type: 'boolean',
		default: false,
		longLabel: 'clip-path-status',
	},
};

const clipPath = {
	...breakpointAttributesCreator({
		obj: clipPathRaw,
	}),
	'_cp.sh': {
		type: 'boolean',
		default: false,
		longLabel: 'clip-path-status-hover',
	},
};

export default clipPath;
