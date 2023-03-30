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
		deviceType,
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

	const scrollSettingsShared = [
		'speed',
		'delay',
		'easing',
		'viewport-top',
		'status-reverse',
	];

	const scrollSettingsVertical = [
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

	const scrollTypes = [
		'vertical',
		'horizontal',
		'rotate',
		'scale',
		'fade',
		'blur',
	];

	const dataScrollTypeValue = () => {
		let responseString = '';
		scrollTypes.forEach(type => {
			if (
				getAttributesValue({
					target: `scroll-${type}-status`,
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
					case 'vertical':
						scrollSettings = scrollSettingsVertical;
						break;
					case 'horizontal':
						scrollSettings = scrollSettingsVertical;
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

				scrollSettings.forEach(setting => {
					const scrollSettingValue = getAttributesValue({
						target: `scroll-${type}-${setting}}`,
						props: attributes,
						breakpoint: deviceType,
					});

					responseString += `${scrollSettingValue} `;
				});

				if (!isEmpty(responseString))
					scroll[`data-scroll-effect-${type}-general`] =
						responseString.trim();
			}
		});
	}

	const displayValue = getLastBreakpointAttribute({
		target: 'd-',
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
