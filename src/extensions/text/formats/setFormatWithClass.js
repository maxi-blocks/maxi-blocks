/**
 * WordPress dependencies
 */
const { applyFormat } = wp.richText;

/**
 * Internal dependencies
 */
import __experimentalGetFormattedString from './getFormattedString';
import __experimentalGetCurrentFormatClassName from './getCurrentFormatClassName';
import flatFormatsWithClass from './flatFormatsWithClass';
import getMultiFormatObj from './getMultiFormatObj';
import defaultCustomFormat from './custom/default';

/**
 * External dependencies
 */
import { inRange } from 'lodash';

/**
 * Content
 */
const formatName = 'maxi-blocks/text-custom';

const getFormatClassName = (typography, isHover, formatValue) => {
	const multiFormatObj = getMultiFormatObj({
		...formatValue,
		start: 0,
		end: formatValue.formats.length,
	});

	let className = `maxi-text-block__custom-format--${
		Object.keys(typography.customFormats).length
	}`;

	const isRepeat = Object.values(multiFormatObj).some(value => {
		return value.className === className;
	});

	if (isRepeat) className += Object.keys(typography.customFormats).length;
	if (isHover) className += ':hover';

	return className;
};

const applyCustomFormat = ({
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

const mergeNewValue = (value, typography, breakpoint) => {
	Object.entries(value).forEach(([target, val]) => {
		if (typography[breakpoint][target] === val)
			value[target] = defaultCustomFormat[breakpoint][target];
	});

	return value;
};

const setNewFormat = ({
	typography,
	formatValue,
	formatClassName,
	defaultCustomFormat,
	breakpoint,
	value,
	isList,
}) => {
	const newCustomStyle = {
		[formatClassName]: {
			...defaultCustomFormat,
			[breakpoint]: {
				...defaultCustomFormat[breakpoint],
				...mergeNewValue(value, typography, breakpoint),
			},
		},
	};

	const newFormatValue = applyFormat(formatValue, {
		type: formatName,
		attributes: {
			className: formatClassName,
		},
	});

	typography.customFormats = {
		...typography.customFormats,
		...newCustomStyle,
	};

	const newContent = applyCustomFormat({
		formatValue,
		formatName,
		isList,
		formatClassName,
	});

	return {
		typography,
		content: newContent,
		formatValue: newFormatValue,
	};
};

const updateCustomFormat = ({
	typography,
	currentClassName,
	breakpoint,
	value,
	isHover,
}) => {
	if (isHover && !typography.customFormats[currentClassName])
		typography.customFormats[currentClassName] = {
			...defaultCustomFormat,
			[breakpoint]: {
				...defaultCustomFormat[breakpoint],
				...mergeNewValue(value, typography, breakpoint),
			},
		};
	else
		typography.customFormats[currentClassName][breakpoint] = {
			...typography.customFormats[currentClassName][breakpoint],
			...mergeNewValue(value, typography, breakpoint),
		};

	return { typography };
};

const generateNewCustomFormat = ({
	typography,
	formatValue,
	currentClassName,
	formatClassName,
	breakpoint,
	value,
	isHover,
}) => {
	const newFormatValue = applyFormat(formatValue, {
		type: formatName,
		attributes: {
			className: formatClassName,
		},
	});

	typography.customFormats[formatClassName] = {
		...((currentClassName && {
			...typography.customFormats[currentClassName],
		}) || { ...defaultCustomFormat }),
	};

	const { typography: newTypography } = updateCustomFormat({
		typography,
		currentClassName: formatClassName,
		breakpoint,
		value,
		isHover,
	});

	return {
		typography: newTypography,
		formatValue: newFormatValue,
	};
};

const mergeNewFormat = ({
	typography,
	formatValue,
	currentClassName,
	formatClassName,
	breakpoint,
	value,
	isHover,
	isList,
}) => {
	const { start, end, formats } = formatValue;

	const isFullFormat = !formats.some((formatEl, i) => {
		return formatEl.some(format => {
			return (
				format.attributes.className === currentClassName &&
				!inRange(i, start, end)
			);
		});
	});

	const { typography: newTypography, formatValue: newFormatValue } =
		currentClassName && isFullFormat
			? updateCustomFormat({
					typography,
					formatValue,
					currentClassName,
					breakpoint,
					value,
					isHover,
			  })
			: generateNewCustomFormat({
					typography,
					formatValue,
					currentClassName,
					formatClassName,
					breakpoint,
					value,
					isHover,
			  });

	const newContent = applyCustomFormat({
		formatValue: newFormatValue || formatValue,
		formatName,
		isList,
		formatClassName: (isFullFormat && currentClassName) || formatClassName,
	});

	return {
		typography: newTypography,
		content: newContent,
		formatValue: newFormatValue || formatValue,
	};
};

const mergeMultipleFormats = ({
	typography,
	formatValue,
	breakpoint,
	value,
	multiFormatObj,
	isList,
	isHover = false,
}) => {
	let newTypography = { ...typography };
	let newContent = '';
	let newFormatValue = { ...formatValue };

	Object.values(multiFormatObj).forEach((format, i) => {
		const newMultiFormatObj = getMultiFormatObj({
			...newFormatValue,
			start: formatValue.start,
			end: formatValue.end,
		});
		const formatClassName = getFormatClassName(
			newTypography,
			isHover,
			newFormatValue
		);
		const { className, start, end } = Object.values(newMultiFormatObj)[i];

		newFormatValue = {
			...newFormatValue,
			start,
			end,
		};

		const {
			typography: newCustomTypography,
			content: newCustomContent,
			formatValue: newCustomFormatValue,
		} = className
			? mergeNewFormat({
					typography: newTypography,
					formatValue: newFormatValue,
					currentClassName: className,
					formatClassName,
					breakpoint,
					value,
					isHover,
					isList,
			  })
			: setNewFormat({
					typography: newTypography,
					formatValue: newFormatValue,
					formatClassName,
					defaultCustomFormat,
					breakpoint,
					value,
					isList,
			  });

		newTypography = newCustomTypography;
		newContent = newCustomContent;
		newFormatValue = {
			...newCustomFormatValue,
			start: formatValue.start,
			end: formatValue.end,
		};
	});

	return {
		typography: newTypography,
		content: newContent,
		formatValue: newFormatValue,
	};
};

const setFormatWithClass = ({
	formatValue,
	isList,
	typography,
	value,
	breakpoint = 'general',
	isHover = false,
}) => {
	// const multiFormatObj = getMultiFormatObj({
	// 	...formatValue,
	// 	start: 0,
	// 	end: formatValue.formats.length,
	// });
	const multiFormatObj = getMultiFormatObj(formatValue);
	const currentClassName = __experimentalGetCurrentFormatClassName(
		formatValue,
		formatName
	);
	const formatClassName = getFormatClassName(
		typography,
		isHover,
		formatValue
	);

	const { start, end, formats } = formatValue;

	const hasCustomFormat = formats.some((formatEl, i) => {
		return formatEl.some(format => {
			return format.type === formatName && i >= start && i <= end;
		});
	});
	const hasMultiCustomFormat = Object.keys(multiFormatObj).length > 1;

	const {
		typography: preformattedTypography,
		content: preformattedContent,
		formatValue: preformattedFormatValue,
	} =
		(!hasCustomFormat &&
			setNewFormat({
				typography,
				formatValue,
				formatClassName,
				defaultCustomFormat,
				breakpoint,
				value,
				isList,
			})) ||
		(hasCustomFormat &&
			!hasMultiCustomFormat &&
			mergeNewFormat({
				typography,
				formatValue,
				currentClassName,
				formatClassName,
				breakpoint,
				value,
				isList,
				isHover,
			})) ||
		(hasCustomFormat &&
			hasMultiCustomFormat &&
			mergeMultipleFormats({
				typography,
				formatValue,
				breakpoint,
				value,
				isList,
				multiFormatObj,
				isHover,
			}));

	const {
		typography: newTypography,
		content: newContent,
		formatValue: newFormatValue,
	} = flatFormatsWithClass({
		typography: preformattedTypography,
		content: preformattedContent,
		formatValue: preformattedFormatValue,
		isHover,
		isList,
	});

	return {
		typography: newTypography,
		content: newContent,
		formatValue: newFormatValue,
	};
};

export default setFormatWithClass;
