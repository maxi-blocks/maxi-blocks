import breakpointAttributesCreator from '../breakpointAttributesCreator';
import attributesShorter from '../dictionary/attributesShorter';
import paletteAttributesCreator from '../paletteAttributesCreator';
import prefixAttributesCreator from '../prefixAttributesCreator';

const prefix = 'border-';

export const rawBorder = attributesShorter(
	{
		...paletteAttributesCreator({ prefix, palette: 2 }),
		'border-style': {
			type: 'string',
			default: 'none',
		},
	},
	'border'
);

export const rawBorderWidth = attributesShorter(
	prefixAttributesCreator({
		obj: {
			'width-top': {
				type: 'number',
				default: 2,
			},
			'width-right': {
				type: 'number',
				default: 2,
			},
			'width-bottom': {
				type: 'number',
				default: 2,
			},
			'width-left': {
				type: 'number',
				default: 2,
			},
			'width-sync': {
				type: 'string',
				default: 'all',
			},
			'width-unit': {
				type: 'string',
				default: 'px',
			},
		},
		prefix,
	}),
	'border'
);

export const rawBorderRadius = attributesShorter(
	prefixAttributesCreator({
		obj: {
			'radius-top-left': {
				type: 'number',
			},
			'radius-top-right': {
				type: 'number',
			},
			'radius-bottom-right': {
				type: 'number',
			},
			'radius-bottom-left': {
				type: 'number',
			},
			'radius-sync': {
				type: 'string',
				default: 'all',
			},
			'radius-unit': {
				type: 'string',
				default: 'px',
			},
		},
		prefix,
	}),
	'border'
);

export const border = attributesShorter(
	breakpointAttributesCreator({
		obj: rawBorder,
	}),
	'border'
);
export const borderWidth = attributesShorter(
	breakpointAttributesCreator({
		obj: rawBorderWidth,
	}),
	'border'
);
export const borderRadius = attributesShorter(
	breakpointAttributesCreator({
		obj: rawBorderRadius,
	}),
	'border'
);
