import breakpointAttributesCreator from '../breakpointAttributesCreator';
import hoverAttributesCreator from '../hoverAttributesCreator';
import paletteAttributesCreator from '../paletteAttributesCreator';
import prefixAttributesCreator from '../prefixAttributesCreator';
import { width } from './size';

const prefix = 'effect-';

const rawMenuItemEffect = {
	type: {
		type: 'string',
	},
	animation: {
		type: 'string',
	},
	direction: {
		type: 'string',
	},
};

const normalMenuItemEffect = {
	...prefixAttributesCreator({
		obj: rawMenuItemEffect,
		prefix,
	}),
	...prefixAttributesCreator({
		obj: width,
		prefix,
		diffValAttr: {
			[`${prefix}width-general`]: '100',
			[`${prefix}width-unit-general`]: '%',
		},
	}),
	...prefixAttributesCreator({
		obj: breakpointAttributesCreator({
			obj: {
				'thickness-unit': {
					type: 'string',
					default: 'px',
				},
				thickness: {
					type: 'string',
					default: 3,
				},
			},
		}),
		prefix,
	}),
	...paletteAttributesCreator({
		prefix,
	}),
};

const menuItemEffect = {
	...normalMenuItemEffect,
	...hoverAttributesCreator({
		obj: rawMenuItemEffect,
		newAttr: {
			'status-hover': {
				type: 'boolean',
				default: false,
			},
		},
	}),
	...prefixAttributesCreator({
		obj: normalMenuItemEffect,
		prefix: 'active-',
		newAttr: {
			'status-active': {
				type: 'boolean',
				default: false,
			},
		},
	}),
};

export default menuItemEffect;
