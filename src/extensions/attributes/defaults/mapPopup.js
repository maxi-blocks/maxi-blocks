import { background, backgroundColor } from './background';
import boxShadow from './boxShadow';
import prefixAttributesCreator from '../prefixAttributesCreator';

const prefix = 'p-';
const longPrefix = 'popup-';

const mapPopup = {
	...prefixAttributesCreator({
		obj: background,
		prefix,
		longPrefix,
		diffValAttr: {
			[`${prefix}b_am-g`]: 'color', // background-active-media-general
		},
	}),
	...prefixAttributesCreator({
		obj: backgroundColor,
		prefix,
		longPrefix,
	}),
	...prefixAttributesCreator({
		obj: boxShadow,
		prefix,
		longPrefix,
	}),
};

export default mapPopup;
