/**
 * Internal dependencies
 */
import __experimentalGetFormattedString from './getFormattedString';

const toggleFormat = ({
	formatValue,
	formatName,
	isActive,
	isList,
	formatClassName,
}) => {
	return __experimentalGetFormattedString({
		formatValue,
		formatName,
		isActive,
		isList,
		attributes: {
			attributes: {
				className: formatClassName,
			},
		},
	});
};

const setFormatWithClass = ({
	currentClassName,
	formatClassNamePrefix,
	defaultObject,
	formatValue,
	formatName,
	isActive,
	isList,
	content,
	typography,
	value,
	breakpoint = 'general',
	toggleConditional,
	deleteConditional,
	isHover = false,
}) => {
	const formatClassName = `${formatClassNamePrefix}${
		Object.keys(typography.customFormats).length
	}${(isHover && ':hover') || ''}`;

	const newContent =
		(toggleConditional &&
			toggleFormat({
				formatValue,
				formatName,
				isActive,
				isList,
				formatClassName,
			})) ||
		content;

	if (!currentClassName || !typography.customFormats[currentClassName]) {
		const newCustomFormat = {
			[formatClassName]: {
				...defaultObject,
				[breakpoint]: value,
			},
		};

		typography.customFormats = Object.assign(typography.customFormats, {
			...newCustomFormat,
		});
	} else if (deleteConditional) {
		delete typography.customFormats[currentClassName];
	} else {
		typography.customFormats[currentClassName][breakpoint] = value;
	}

	return {
		typography,
		newContent,
	};
};

export default setFormatWithClass;
