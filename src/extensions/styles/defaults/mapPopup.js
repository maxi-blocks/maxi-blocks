import { background, backgroundColor } from './background';
import boxShadow from './boxShadow';
import prefixAttributesCreator from '@extensions/styles/prefixAttributesCreator';

const prefix = 'popup-';

const mapPopup = {
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
