/**
 * WordPress dependencies
 */
const { applyFormat } = wp.richText;

/**
 * Internal dependencies
 */
import getFormattedString from './getFormattedString';
import getCurrentFormatClassName from './getCurrentFormatClassName';
import flatFormatsWithClass from './flatFormatsWithClass';
import getMultiFormatObj from './getMultiFormatObj';

/**
 * External dependencies
 */
import { inRange, cloneDeep } from 'lodash';

/**
 * Generates custom format name
 *
 * @param {boolean} isHover 			Is the requested typography under hover state
 *
 * @returns {string} Custom format name
 */
const getFormatType = isHover => {
	return `maxi-blocks/text-custom${isHover ? '-hover' : ''}`;
};

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

	const num =
		(typography[`custom-formats${isHover ? '-hover' : ''}`] &&
			Object.keys(typography[`custom-formats${isHover ? '-hover' : ''}`])
				.length) ||
		0;

	let className = `maxi-text-block__custom-format--${num}`;

	const isRepeat = Object.values(multiFormatObj).some(value => {
		return value.className === className;
	});

	// Should be improved vvv
	if (isRepeat) className += num;
	if (isHover) className += '--hover';

	return className;
};

/**
 * Applies a new custom format
 *
 * @param {Object} 	[$0]					Optional named arguments.
 * @param {Object} 	[$0.formatValue]		RichText format value
 * @param {boolean} [$0.isList]				Text Maxi block has list mode active
 * @param {string} 	[$0.formatClassName]	Maxi Custom format className
 * @param {boolean} isHover 			Is the requested typography under hover state
 *
 * @returns {string} Format applied content
 */
const applyCustomFormat = ({
	formatValue,
	isList,
	formatClassName,
	isHover,
}) => {
	return getFormattedString({
		formatValue,
		formatName: getFormatType(isHover),
		isList,
		attributes: {
			attributes: {
				className: formatClassName,
			},
		},
	});
};

/**
 * Merges a cleaned style object comparing with the default typography properties
 *
 * @param {Object} 	typography				MaxiBlocks typography
 * @param {Object} 	value 					Requested values to implement
 * 											on typography object
 * @param {string} 	breakpoint				Device type breakpoint
 * @param {Object}  currentStyle			Current style properties
 *
 * @returns {Object} Cleaned styles properties
 */
const styleObjectManipulator = ({
	typography,
	value,
	breakpoint,
	currentStyle,
}) => {
	const style = cloneDeep(currentStyle);

	Object.entries(value).forEach(([target, val]) => {
		if (typography[`${target}-${breakpoint}`] === val)
			delete style[`${target}-${breakpoint}`];
		else style[`${target}-${breakpoint}`] = val;
	});

	return style;
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
	typography[`custom-formats${isHover ? '-hover' : ''}`] = {
		...(!!typography[`custom-formats${isHover ? '-hover' : ''}`] &&
			typography[`custom-formats${isHover ? '-hover' : ''}`]),
	}; // Be sure 'custom-formats' is an object

	typography[`custom-formats${isHover ? '-hover' : ''}`][currentClassName] = {
		...styleObjectManipulator({
			typography,
			value,
			breakpoint,
			currentStyle:
				(!!typography[`custom-formats${isHover ? '-hover' : ''}`] &&
					typography[`custom-formats${isHover ? '-hover' : ''}`][
						currentClassName
					]) ||
				{},
		}),
	};

	return { typography };
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
	breakpoint,
	value,
	isList,
	isHover,
}) => {
	const newTypography = updateCustomFormat({
		typography,
		currentClassName: formatClassName,
		breakpoint,
		value,
		isHover,
	});

	const newFormatValue = applyFormat(formatValue, {
		type: getFormatType(isHover),
		attributes: {
			className: formatClassName,
		},
	});

	const newContent = applyCustomFormat({
		formatValue,
		isList,
		formatClassName,
		isHover,
	});

	return {
		...newTypography,
		content: newContent,
		formatValue: newFormatValue,
	};
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
		type: getFormatType(isHover),
		attributes: {
			className: formatClassName,
		},
	});
	if (!typography[`custom-formats${isHover ? '-hover' : ''}`])
		typography[`custom-formats${isHover ? '-hover' : ''}`] = {};

	typography[`custom-formats${isHover ? '-hover' : ''}`][formatClassName] = {
		...((currentClassName && {
			...typography[`custom-formats${isHover ? '-hover' : ''}`][
				currentClassName
			],
		}) ||
			{}),
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
				format.type === getFormatType(isHover) &&
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
		isList,
		formatClassName: (isFullFormat && currentClassName) || formatClassName,
		isHover,
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
					breakpoint,
					value,
					isList,
					isHover,
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
	const currentClassName = getCurrentFormatClassName(formatValue, isHover);
	const formatClassName = getFormatClassName(
		formatValue,
		typography,
		isHover
	);

	const { start, end, formats } = formatValue;

	const hasCustomFormat = formats.some((formatEl, i) => {
		return formatEl.some(format => {
			return (
				format.type === getFormatType(isHover) && i >= start && i <= end
			);
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
				breakpoint,
				value,
				isList,
				isHover,
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
		...newTypography,
		content: newContent,
		formatValue: newFormatValue,
	};
};

export default setFormatWithClass;
