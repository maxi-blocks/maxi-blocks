import { background, backgroundColor } from './background';
import boxShadow from './boxShadow';
import prefixAttributesCreator from '../prefixAttributesCreator';

const prefix = 'p-'; // popup-

const mapPopup = {
	...prefixAttributesCreator({
		obj: background,
		prefix,
		diffValAttr: {
			[`${prefix}bam-general`]: 'color', // background-active-media-general
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
