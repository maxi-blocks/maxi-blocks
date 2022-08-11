import hoverAttributesCreator from '../hoverAttributesCreator';
import paletteAttributesCreator from '../paletteAttributesCreator';
import prefixAttributesCreator from '../prefixAttributesCreator';
import { height, width } from './size';

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
	}),
	...prefixAttributesCreator({
		obj: height,
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
