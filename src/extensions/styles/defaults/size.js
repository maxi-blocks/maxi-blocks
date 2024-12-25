import breakpointAttributesCreator from '@extensions/styles/breakpointAttributesCreator';

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
		type: 'string',
	},
};

export const rawWidth = {
	'width-unit': {
		type: 'string',
		default: 'px',
	},
	width: {
		type: 'string',
	},
	'width-fit-content': {
		type: 'boolean',
		default: false,
	},
};

export const rawMinWidth = {
	'min-width-unit': {
		type: 'string',
		default: 'px',
	},
	'min-width': {
		type: 'string',
	},
};

export const rawMaxHeight = {
	'max-height-unit': {
		type: 'string',
		default: 'px',
	},
	'max-height': {
		type: 'string',
	},
};

export const rawHeight = {
	'height-unit': {
		type: 'string',
		default: 'px',
	},
	height: {
		type: 'string',
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
		type: 'string',
	},
};

export const rawFullWidth = {
	'full-width': {
		type: 'boolean',
		default: false,
	},
};

export const maxWidth = breakpointAttributesCreator({ obj: rawMaxWidth });
export const width = breakpointAttributesCreator({ obj: rawWidth });
export const minWidth = breakpointAttributesCreator({ obj: rawMinWidth });
export const maxHeight = breakpointAttributesCreator({ obj: rawMaxHeight });
export const height = breakpointAttributesCreator({ obj: rawHeight });
export const minHeight = breakpointAttributesCreator({ obj: rawMinHeight });
export const fullWidth = breakpointAttributesCreator({
	obj: rawFullWidth,
});

const size = {
	...rawSize,
	...maxWidth,
	...width,
	...minWidth,
	...maxHeight,
	...height,
	...minHeight,
	...fullWidth,
};

export default size;
