/**
 * Internal dependencies
 */
import {
	getGroupAttributes,
	getLastBreakpointAttribute,
} from '../../extensions/styles';
import { scrollTypes } from '../../extensions/styles/defaults/scroll';

/**
 * External dependencies
 */
import { isEmpty, isNil } from 'lodash';

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

	const scrollSettingsShared = [
		'speed',
		'delay',
		'easing',
		'viewport-top',
		'status-reverse',
	];

	const scrollSettingsVerticalAndHorizontal = [
		...scrollSettingsShared,
		'offset-start',
		'offset-mid',
		'offset-end',
	];

	const scrollSettingsRotate = [
		...scrollSettingsShared,
		'rotate-start',
		'rotate-mid',
		'rotate-end',
	];

	const scrollSettingsFade = [
		...scrollSettingsShared,
		'opacity-start',
		'opacity-mid',
		'opacity-end',
	];

	const scrollSettingsBlur = [
		...scrollSettingsShared,
		'blur-start',
		'blur-mid',
		'blur-end',
	];

	const scrollSettingsScale = [
		...scrollSettingsShared,
		'scale-start',
		'scale-mid',
		'scale-end',
	];

	const dataScrollTypeValue = () => {
		const enabledScrolls = [];
		scrollTypes.forEach(type => {
			if (attributes[`scroll-${type}-status-general`])
				enabledScrolls.push(type);
		});
		return enabledScrolls;
	};

	const rawEnabledScrolls = dataScrollTypeValue();
	const enabledScrolls = [];

	const scroll = {};

	if (!isEmpty(rawEnabledScrolls)) {
		for (const type of rawEnabledScrolls) {
			let responseString = '';
			let scrollSettings;

			switch (type) {
				case 'vertical':
					scrollSettings = scrollSettingsVerticalAndHorizontal;
					break;
				case 'horizontal':
					scrollSettings = scrollSettingsVerticalAndHorizontal;
					break;
				case 'rotate':
					scrollSettings = scrollSettingsRotate;
					break;
				case 'fade':
					scrollSettings = scrollSettingsFade;
					break;
				case 'blur':
					scrollSettings = scrollSettingsBlur;
					break;
				case 'scale':
					scrollSettings = scrollSettingsScale;
					break;
				default:
					break;
			}

			if (!isNil(scrollSettings)) {
				let isOldScrollAttributes = true;

				for (const setting of scrollSettings) {
					const scrollSettingValue =
						attributes[`scroll-${type}-${setting}-general`];

					if (isNil(scrollSettingValue)) {
						isOldScrollAttributes = false;
						break;
					}

					responseString += `${scrollSettingValue} `;
				}

				if (isOldScrollAttributes && !isEmpty(responseString)) {
					enabledScrolls.push(type);
					scroll[`data-scroll-effect-${type}-general`] =
						responseString.trim();
				}
			}
		}

		if (!isEmpty(enabledScrolls))
			scroll['data-scroll-effect-type'] = enabledScrolls.join(' ');
	}

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
		...scroll,
	};
};

export default getMaxiBlockAttributes;
