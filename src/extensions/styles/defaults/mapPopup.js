import { background, backgroundColor } from './background';
import { svg } from './svg';
import { typography } from './typography';
import boxShadow from './boxShadow';
import prefixAttributesCreator from '../prefixAttributesCreator';

const prefix = 'popup-';

const mapPopup = {
	'map-marker-heading-level': {
		type: 'string',
		default: 'h6',
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
		obj: boxShadow,
		prefix,
	}),
};

export default mapPopup;
