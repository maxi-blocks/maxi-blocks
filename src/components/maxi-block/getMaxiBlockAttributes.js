/**
 * Internal dependencies
 */
import {
	getAttributesValue,
	getGroupAttributes,
	getLastBreakpointAttribute,
} from '../../extensions/attributes';

/**
 * External dependencies
 */
import { isEmpty } from 'lodash';

const getMaxiBlockAttributes = props => {
	const {
		name,
		deviceType = 'g',
		baseBreakpoint,
		attributes,
		clientId,
		hasInnerBlocks,
		isChild,
		isSelected,
		hasSelectedChild,
	} = props;
	const [blockStyle, extraClassName, anchorLink, uniqueID, linkSettings] =
		getAttributesValue({
			target: ['_bs', '_ecn', '_al', '_uid', '_lse'],
			props: attributes,
		});

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

	const scrollSettingsShared = ['_spe', '_de', '_ea', '_vpt', '_sr'];

	const scrollSettingsVertical = [
		...scrollSettingsShared,
		'_of_sta',
		'_of.m',
		'_of_e',
	];

	const scrollSettingsRotate = [
		...scrollSettingsShared,
		'_rot_sta',
		'_rot.m',
		'_rot_e',
	];

	const scrollSettingsFade = [
		...scrollSettingsShared,
		'_o_sta',
		'_o.m',
		'_o_e',
	];

	const scrollSettingsBlur = [
		...scrollSettingsShared,
		'_blu_sta',
		'_blu.m',
		'_blu_e',
	];

	const scrollSettingsScale = [
		...scrollSettingsShared,
		'_sc_sta',
		'_sc.m',
		'_sc_e',
	];

	const scrollTypes = ['_v', '_ho', '_rot', '_sc', '_fa', '_blu'];

	const dataScrollTypeValue = () => {
		let responseString = '';
		scrollTypes.forEach(type => {
			if (
				getAttributesValue({
					target: `sc${type}.s`,
					props: attributes,
					breakpoint: deviceType,
				})
			)
				responseString += `${type} `;
		});
		return responseString?.trim();
	};

	const enabledScrolls = dataScrollTypeValue();

	const scroll = {};

	if (!isEmpty(enabledScrolls)) {
		scroll['data-scroll-effect-type'] = enabledScrolls;
		scrollTypes.forEach(type => {
			if (enabledScrolls.includes(type)) {
				let responseString = '';
				let scrollSettings;

				switch (type) {
					case '_v':
						scrollSettings = scrollSettingsVertical;
						break;
					case '_ho':
						scrollSettings = scrollSettingsVertical;
						break;
					case '_rot':
						scrollSettings = scrollSettingsRotate;
						break;
					case '_fa':
						scrollSettings = scrollSettingsFade;
						break;
					case '_blu':
						scrollSettings = scrollSettingsBlur;
						break;
					case '_sc':
						scrollSettings = scrollSettingsScale;
						break;
					default:
						break;
				}

				scrollSettings.forEach(setting => {
					const scrollSettingValue = getAttributesValue({
						target: `sc${type}${setting}`,
						props: attributes,
						breakpoint: deviceType,
					});

					responseString += `${scrollSettingValue} `;
				});

				if (!isEmpty(responseString))
					scroll[`data-scroll-effect${type}-g`] =
						responseString.trim();
			}
		});
	}

	const displayValue = getLastBreakpointAttribute({
		target: '_d',
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
		isChild,
		isSelected,
		hasSelectedChild,
		// Necessary for the memo() of MaxiBlocks component
		attributes,
		...scroll,
	};
};

export default getMaxiBlockAttributes;
