import { background, backgroundColor } from './background';
import boxShadow from './boxShadow';
import prefixAttributesCreator from '../prefixAttributesCreator';
import attributesShorter from '../dictionary/attributesShorter';

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

export default attributesShorter(mapPopup, 'mapPopup');
