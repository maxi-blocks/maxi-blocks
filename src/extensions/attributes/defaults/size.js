import breakpointAttributesCreator from '../breakpointAttributesCreator';
import attributesShorter from '../dictionary/attributesShorter';

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
		type: 'string',
		default: 'normal',
	},
};

export const maxWidth = attributesShorter(
	breakpointAttributesCreator({ obj: rawMaxWidth }),
	'size'
);
export const width = attributesShorter(
	breakpointAttributesCreator({ obj: rawWidth }),
	'size'
);
export const minWidth = attributesShorter(
	breakpointAttributesCreator({ obj: rawMinWidth }),
	'size'
);
export const maxHeight = attributesShorter(
	breakpointAttributesCreator({ obj: rawMaxHeight }),
	'size'
);
export const height = attributesShorter(
	breakpointAttributesCreator({ obj: rawHeight }),
	'size'
);
export const minHeight = attributesShorter(
	breakpointAttributesCreator({ obj: rawMinHeight }),
	'size'
);
export const fullWidth = attributesShorter(
	breakpointAttributesCreator({
		obj: rawFullWidth,
	}),
	'size'
);

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

export default attributesShorter(size, 'size');
