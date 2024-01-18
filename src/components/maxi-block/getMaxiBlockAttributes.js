/**
 * Internal dependencies
 */
import {
	getGroupAttributes,
	getLastBreakpointAttribute,
} from '../../extensions/styles';

/**
 * External dependencies
 */
import { isEmpty } from 'lodash';

const getMaxiBlockAttributes = props => {
	const {
		name,
		deviceType,
		baseBreakpoint,
		attributes,
		clientId,
		hasInnerBlocks,
		isChild,
		isSelected,
		hasSelectedChild,
		repeaterStatus,
	} = props;
	const {
		blockStyle,
		extraClassName,
		anchorLink,
		uniqueID,
		linkSettings,
		'dc-status': dcStatus,
		'dc-hide': dcHide,
	} = attributes;

	const isRepeater = !!repeaterStatus;

	const motion = {
		...getGroupAttributes(attributes, [
			'motion',
			'numberCounter',
			'shapeDivider',
			'hover',
		]),
	};

	const background = {
		...getGroupAttributes(attributes, ['blockBackground']),
	};
	const hasLink =
		linkSettings && !isEmpty(linkSettings) && !isEmpty(linkSettings.url);

	const displayValue = getLastBreakpointAttribute({
		target: 'display',
		breakpoint: deviceType,
		attributes,
		forceSingle: true,
	});

	return {
		clientId,
		deviceType,
		baseBreakpoint,
		blockName: name,
		blockStyle,
		extraClassName,
		anchorLink,
		uniqueID,
		displayValue,
		motion,
		background,
		hasLink,
		hasInnerBlocks,
		isRepeater,
		isChild,
		isSelected,
		hasSelectedChild,
		dcStatus,
		dcHide,
		// Necessary for the memo() of MaxiBlocks component
		attributes,
	};
};

export default getMaxiBlockAttributes;
