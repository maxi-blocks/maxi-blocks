/**
 * WordPress dependencies
 */
const { applyFormat } = wp.richText;

/**
 * Internal dependencies
 */
import getFormattedString from './getFormattedString';
import GetCurrentFormatClassName from './getCurrentFormatClassName';
import flatFormatsWithClass from './flatFormatsWithClass';
import getMultiFormatObj from './getMultiFormatObj';
import defaultCustomFormat from './custom/default';

/**
 * External dependencies
 */
import { inRange } from 'lodash';

/**
 * General
 */
const formatName = 'maxi-blocks/text-custom';

/**
 * Generates a format and unique className
 *
 * @param {Object} 	formatValue 		RichText format value
 * @param {Object} 	typography 			Text Maxi typography
 * @param {boolean} isHover 			Is the requested typography under hover state
 *
 * @returns {string} New format and unique className
 */
const getFormatClassName = (formatValue, typography, isHover) => {
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

/**
 * Applies a new custom format
 *
 * @param {Object} 	[$0]					Optional named arguments.
 * @param {Object} 	[$0.formatValue]		RichText format value
 * @param {string} 	[$0.formatName]			RichText format type
 * @param {boolean} [$0.isList]				Text Maxi block has list mode active
 * @param {string} 	[$0.formatClassName]	Maxi Custom format className
 *
 * @returns {string} Format applied content
 */
const applyCustomFormat = ({
	formatValue,
	formatName,
	isList,
	formatClassName,
}) => {
	return getFormattedString({
		formatValue,
		formatName,
		isList,
		attributes: {
			attributes: {
				className: formatClassName,
			},
		},
	});
};

/**
 * Merges a new value comparing with the default typography object
 *
 * @param {Object} 	typography				MaxiBlocks typography
 * @param {Object} 	value 					Requested values to implement
 * 											on typography object
 * @param {string} 	breakpoint				Device type breakpoint
 *
 * @returns {Object} Cleaned value
 */
const mergeNewValue = (typography, value, breakpoint) => {
	Object.entries(value).forEach(([target, val]) => {
		if (typography[breakpoint][target] === val)
			value[target] = defaultCustomFormat[breakpoint][target];
	});

	return value;
};

/**
 * Sets a new custom format
 *
 * @param {Object} 	[$0]						Optional named arguments.
 * @param {Object} 	[$0.formatValue]			RichText format value
 * @param {Object} 	[$0.typography]				MaxiBlocks typography
 * @param {string} 	[$0.formatClassName]		Maxi Custom format className
 * @param {Object} 	[$0.defaultCustomFormat]	Maxi Custom format className
 * @param {string} 	[$0.breakpoint]				Device type breakpoint
 * @param {Object}	[$0.value]					Requested values to implement
 * 												on typography object
 * @param {Object} 	[$0.isList]					Text Maxi block has list mode active
 *
 * @returns {Object} Formatted typography, content and RichText format
 */
const setNewFormat = ({
	formatValue,
	typography,
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
				...mergeNewValue(typography, value, breakpoint),
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

/**
 * Updates the existent custom format
 *
 * @param {Object} 	[$0]						Optional named arguments.
 * @param {Object} 	[$0.typography]				MaxiBlocks typography
 * @param {string} 	[$0.currentClassName]		Maxi Custom format className
 * @param {string} 	[$0.breakpoint]				Device type breakpoint
 * @param {Object}	[$0.value]					Requested values to implement
 * 												on typography object
 * @param {Object} 	[$0.isHover]				Is the requested typography under hover state
 *
 * @returns {Object} Updated Maxi typography object
 */
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
				...mergeNewValue(typography, value, breakpoint),
			},
		};
	else
		typography.customFormats[currentClassName][breakpoint] = {
			...typography.customFormats[currentClassName][breakpoint],
			...mergeNewValue(typography, value, breakpoint),
		};

	return { typography };
};

/**
 * Generates new custom format
 *
 * @param {Object} 	[$0]						Optional named arguments.
 * @param {Object} 	[$0.formatValue]			RichText format value
 * @param {Object} 	[$0.typography]				MaxiBlocks typography
 * @param {string} 	[$0.currentClassName]		Maxi Custom format className
 * @param {string} 	[$0.formatClassName]		Maxi Custom format className
 * @param {string} 	[$0.breakpoint]				Device type breakpoint
 * @param {Object}	[$0.value]					Requested values to implement
 * 												on typography object
 * @param {Object} 	[$0.isHover]				Is the requested typography under hover state
 *
 * @returns {Object} Maxi typography and RichText format value with new custom format instance
 */
const generateNewCustomFormat = ({
	formatValue,
	typography,
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

/**
 * Merge new custom format
 *
 * @param {Object} 	[$0]						Optional named arguments.
 * @param {Object} 	[$0.formatValue]			RichText format value
 * @param {Object} 	[$0.typography]				MaxiBlocks typography
 * @param {string} 	[$0.currentClassName]		Maxi Custom format className
 * @param {string} 	[$0.formatClassName]		Maxi Custom format className
 * @param {string} 	[$0.breakpoint]				Device type breakpoint
 * @param {Object}	[$0.value]					Requested values to implement
 * 												on typography object
 * @param {Object} 	[$0.isHover]				Is the requested typography under hover state
 * @param {Object} 	[$0.isList]					Text Maxi block has list mode active
 *
 * @returns {Object} Maxi typography, Text Maxi content and RichText format value
 * 					 with new custom format instance
 */
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
				format.type === formatName &&
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

/**
 * Merge new custom format
 *
 * @param {Object} 	[$0]						Optional named arguments.
 * @param {Object} 	[$0.formatValue]			RichText format value
 * @param {Object} 	[$0.typography]				MaxiBlocks typography
 * @param {string} 	[$0.breakpoint]				Device type breakpoint
 * @param {Object}	[$0.value]					Requested values to implement
 * 												on typography object
 * @param {Object}	[$0.multiFormatObj]			Classes with its positions
 * @param {Object} 	[$0.isList]					Text Maxi block has list mode active
 * @param {Object} 	[$0.isHover]				Is the requested typography under hover state
 *
 * @returns {Object} Maxi typography, Text Maxi content and RichText format value
 * 					 with new custom format instance
 */
const mergeMultipleFormats = ({
	formatValue,
	typography,
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
			newFormatValue,
			newTypography,
			isHover
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

/**
 * Sets Maxi Custom format
 *
 * @param {Object} 	[$0]						Optional named arguments.
 * @param {Object} 	[$0.formatValue]			RichText format value
 * @param {Object} 	[$0.typography]				MaxiBlocks typography
 * @param {string} 	[$0.breakpoint]				Device type breakpoint
 * @param {Object}	[$0.value]					Requested values to implement
 * 												on typography object
 * @param {Object} 	[$0.isList]					Text Maxi block has list mode active
 * @param {Object} 	[$0.isHover]				Is the requested typography under hover state
 *
 * @returns {Object} Maxi typography, Text Maxi content and RichText format value
 * 					 with new custom format instance
 */
const setFormatWithClass = ({
	formatValue,
	typography,
	breakpoint = 'general',
	value,
	isList,
	isHover = false,
}) => {
	const multiFormatObj = getMultiFormatObj(formatValue);
	const currentClassName = GetCurrentFormatClassName(formatValue);
	const formatClassName = getFormatClassName(
		formatValue,
		typography,
		isHover
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
