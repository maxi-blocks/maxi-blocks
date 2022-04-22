import breakpointAttributesCreator from '../breakpointAttributesCreator';

export const rawSize = {
	'size-advanced-options': {
		type: 'boolean',
		default: false,
	},
};

export const rawMaxWidth = {
	'max-width-unit': {
		type: 'string',
		default: 'px',
	},
	'max-width': {
		type: 'number',
	},
};

export const rawWidth = {
	'width-unit': {
		type: 'string',
		default: 'px',
	},
	width: {
		type: 'number',
	},
	'width-fit-content': {
		type: 'bool',
		default: false,
	},
};

export const rawMinWidth = {
	'min-width-unit': {
		type: 'string',
		default: 'px',
	},
	'min-width': {
		type: 'number',
	},
};

export const rawMaxHeight = {
	'max-height-unit': {
		type: 'string',
		default: 'px',
	},
	'max-height': {
		type: 'number',
	},
};

export const rawHeight = {
	'height-unit': {
		type: 'string',
		default: 'px',
	},
	height: {
		type: 'number',
	},
	'force-aspect-ratio': {
		type: 'boolean',
	},
};

export const rawMinHeight = {
	'min-height-unit': {
		type: 'string',
		default: 'px',
	},
	'min-height': {
		type: 'number',
	},
};

export const maxWidth = breakpointAttributesCreator({ obj: rawMaxWidth });
export const width = breakpointAttributesCreator({ obj: rawWidth });
export const minWidth = breakpointAttributesCreator({ obj: rawMinWidth });
export const maxHeight = breakpointAttributesCreator({ obj: rawMaxHeight });
export const height = breakpointAttributesCreator({ obj: rawHeight });
export const minHeight = breakpointAttributesCreator({ obj: rawMinHeight });

const size = {
	...rawSize,
	...maxWidth,
	...width,
	...minWidth,
	...maxHeight,
	...height,
	...minHeight,
};

export default size;
