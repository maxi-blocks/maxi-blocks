import { background, backgroundColor } from './background';
import { border, borderWidth } from './border';
import { svg } from './svg';
import { typography } from './typography';
import boxShadow from './boxShadow';
import boxShadowHover from './boxShadowHover';
import prefixAttributesCreator from '../prefixAttributesCreator';

const prefix = 'popup-';

const mapPopup = {
	'map-popup': {
		type: 'number',
		default: 1,
	},
	...typography,
	...prefixAttributesCreator({
		obj: typography,
		prefix: 'description-',
		diffValAttr: {
			'description-font-size-general': 16,
		},
	}),
	...prefixAttributesCreator({
		obj: svg,
		prefix,
		diffValAttr: {
			[`${prefix}svg-stroke-general`]: 1,
		},
	}),
	...prefixAttributesCreator({
		obj: background,
		prefix,
		diffValAttr: {
			[`${prefix}background-active-media-general`]: 'color',
		},
	}),
	...prefixAttributesCreator({
		obj: backgroundColor,
		prefix,
	}),
	...prefixAttributesCreator({
		obj: border,
		prefix,
		diffValAttr: {
			[`${prefix}border-style-general`]: 'solid',
			[`${prefix}border-palette-color-general`]: 4,
		},
	}),
	...prefixAttributesCreator({
		obj: borderWidth,
		prefix,
	}),
	...prefixAttributesCreator({
		obj: boxShadow,
		prefix,
	}),
	...prefixAttributesCreator({
		obj: boxShadowHover,
		prefix,
	}),
};

export default mapPopup;
