/**
 * WordPress dependencies
 */
import { applyFormat } from '@wordpress/rich-text';

/**
 * Internal dependencies
 */
import applyCustomFormat from './applyCustomFormat';
import getCurrentFormatClassName from './getCurrentFormatClassName';
import flatFormatsWithClass from './flatFormatsWithClass';
import getMultiFormatObj from './getMultiFormatObj';
import removeCustomFormat from './removeCustomFormat';
import getFormatType from './getFormatType';
import updateCustomFormatStyle from './updateCustomFormatStyle';
import getCustomFormat from './getCustomFormat';
import getIsFullFormat from './getIsFullFormat';
import getHasCustomFormat from './getHasCustomFormat';

/**
 * External dependencies
 */
import { isEmpty, isNil, isBoolean } from 'lodash';

/**
 * Generates a format and unique className
 *
 * @param {Object}  formatValue RichText format value
 * @param {Object}  typography  Text Maxi typography
 * @param {boolean} isHover     Is the requested typography under hover state
 * @returns {string} New format and unique className
 */
export const getFormatClassName = (typography, isHover) => {
	const customFormatsClasses = Object.keys(
		typography[`custom-formats${isHover ? '-hover' : ''}`] || {}
	);

	let num = 0;
	let currentClassName = `maxi-text-block__custom-format--${num}${
		isHover ? '--hover' : ''
	}`;

	while (customFormatsClasses.includes(currentClassName)) {
		num += 1;
		currentClassName = `maxi-text-block__custom-format--${num}${
			isHover ? '--hover' : ''
		}`;
	}

	return currentClassName;
};

/**
 * Sets a new custom format
 *
 * @param {Object} [$0]                     Optional named arguments.
 * @param {Object} [$0.formatValue]         RichText format value
 * @param {Object} [$0.typography]          MaxiBlocks typography
 * @param {string} [$0.formatClassName]     Maxi Custom format className
 * @param {Object} [$0.defaultCustomFormat] Maxi Custom format className
 * @param {string} [$0.breakpoint]          Device type breakpoint
 * @param {Object} [$0.value]               Requested values to implement
 *                                          on typography object
 * @param {Object} [$0.isList]              Text Maxi block has list mode active
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
	textLevel,
	styleCard,
}) => {
	const newTypography = updateCustomFormatStyle({
		typography,
		currentClassName: formatClassName,
		breakpoint,
		value,
		isHover,
		textLevel,
		styleCard,
	});

	const newFormatValue = applyFormat(formatValue, {
		type: getFormatType(isHover),
		attributes: {
			className: formatClassName,
		},
	});

	const { content: newContent } = applyCustomFormat({
		formatValue,
		formatName: getFormatType(isHover),
		isList,
		attributes: {
			attributes: {
				className: formatClassName,
			},
		},
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
 * @param {Object} [$0]                  Optional named arguments.
 * @param {Object} [$0.formatValue]      RichText format value
 * @param {Object} [$0.typography]       MaxiBlocks typography
 * @param {string} [$0.currentClassName] Maxi Custom format className
 * @param {string} [$0.formatClassName]  Maxi Custom format className
 * @param {string} [$0.breakpoint]       Device type breakpoint
 * @param {Object} [$0.value]            Requested values to implement
 *                                       on typography object
 * @param {Object} [$0.isHover]          Is the requested typography under hover state
 * @returns {Object} Maxi typography and RichText format value with new custom format instance
 */
const updateCustomFormat = ({
	formatValue,
	typography,
	currentClassName,
	formatClassName,
	breakpoint,
	value,
	isHover,
	isList,
	textLevel,
	styleCard,
}) => {
	if (!typography[`custom-formats${isHover ? '-hover' : ''}`])
		typography[`custom-formats${isHover ? '-hover' : ''}`] = {};

	typography[`custom-formats${isHover ? '-hover' : ''}`][formatClassName] = {
		...getCustomFormat(typography, currentClassName, isHover),
	};

	const { typography: newTypography } = updateCustomFormatStyle({
		typography,
		currentClassName: formatClassName,
		breakpoint,
		value,
		isHover,
		textLevel,
		styleCard,
	});

	if (!isEmpty(getCustomFormat(newTypography, formatClassName, isHover))) {
		const { content: newContent, formatValue: newFormatValue } =
			applyCustomFormat({
				formatValue,
				formatName: getFormatType(isHover),
				isList,
				attributes: {
					attributes: {
						className: formatClassName,
					},
				},
			});

		return {
			typography: newTypography,
			formatValue: newFormatValue,
			content: newContent,
		};
	}

	const { content: newContent, formatValue: newFormatValue } =
		removeCustomFormat({
			formatValue,
			className: currentClassName,
			isList: false,
			isHover,
		});

	return {
		typography: newTypography,
		formatValue: newFormatValue,
		content: newContent,
	};
};

export const checkFormatCoincidence = ({
	typography,
	className,
	breakpoint,
	value,
	isHover,
	textLevel,
	styleCard,
}) => {
	const clonedTypography = { ...typography };
	const { 'custom-formats': customFormats } = clonedTypography;

	if (isNil(customFormats)) return false;

	const {
		'custom-formats': { [className]: updatedFormat },
	} = updateCustomFormatStyle({
		typography: clonedTypography,
		currentClassName: className,
		breakpoint,
		value,
		isHover,
		textLevel,
		styleCard,
	}).typography;

	let coincidence = false;

	if (updatedFormat)
		Object.entries(customFormats).forEach(([key, value]) => {
			if (
				key !== className &&
				Object.keys(value).length === Object.keys(updatedFormat).length
			) {
				const hasCoincidence = !Object.entries(value).some(
					([target, content]) => {
						if (
							updatedFormat[target] &&
							updatedFormat[target] === content
						)
							return false;

						return true;
					}
				);

				if (hasCoincidence) coincidence = key;
			}
		});

	return coincidence;
};

/**
 * Merge new custom format
 *
 * @param {Object} [$0]                  Optional named arguments.
 * @param {Object} [$0.formatValue]      RichText format value
 * @param {Object} [$0.typography]       MaxiBlocks typography
 * @param {string} [$0.currentClassName] Maxi Custom format className
 * @param {string} [$0.formatClassName]  Maxi Custom format className
 * @param {string} [$0.breakpoint]       Device type breakpoint
 * @param {Object} [$0.value]            Requested values to implement
 *                                       on typography object
 * @param {Object} [$0.isHover]          Is the requested typography under hover state
 * @param {Object} [$0.isList]           Text Maxi block has list mode active
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
	textLevel,
	isWholeSegment = null,
	styleCard,
}) => {
	const isFullFormat = getIsFullFormat(formatValue, currentClassName);
	const classCoincidence = checkFormatCoincidence({
		typography,
		className: currentClassName || formatClassName,
		value,
		breakpoint,
		isHover,
		textLevel,
		styleCard,
	});

	let newTypography = { ...typography };
	let newFormatValue = { ...formatValue };
	let newContent = '';

	const useCurrent =
		currentClassName &&
		(isFullFormat || (isBoolean(isWholeSegment) && isWholeSegment));

	if (!classCoincidence) {
		if (!useCurrent) {
			const {
				typography: preformattedTypography,
				formatValue: preformattedFormatValue,
				content: preformattedContent,
			} = updateCustomFormat({
				typography,
				formatValue,
				currentClassName,
				formatClassName,
				breakpoint,
				value,
				isHover,
				isList,
				textLevel,
				styleCard,
			});

			newTypography = preformattedTypography;
			newFormatValue = preformattedFormatValue;
			newContent = preformattedContent;
		}

		const { typography: cleanedTypography } = updateCustomFormatStyle({
			typography: newTypography,
			currentClassName: useCurrent ? currentClassName : formatClassName,
			breakpoint,
			value,
			isHover,
			textLevel,
			styleCard,
		});

		newTypography = cleanedTypography;
	}

	const customFormats = getCustomFormat(
		newTypography,
		useCurrent ? currentClassName : formatClassName,
		isHover
	);

	if (!classCoincidence && isEmpty(customFormats)) {
		const { formatValue: cleanedFormatValue, content: cleanedContent } =
			removeCustomFormat({
				formatValue,
				className: useCurrent ? currentClassName : formatClassName,
				isList,
			});

		newFormatValue = cleanedFormatValue;
		newContent = cleanedContent;
	} else {
		const { formatValue: cleanedFormatValue, content: cleanedContent } =
			applyCustomFormat({
				formatValue: newFormatValue || formatValue,
				formatName: getFormatType(isHover),
				isList,
				attributes: {
					attributes: {
						className:
							classCoincidence ||
							(useCurrent ? currentClassName : formatClassName),
					},
				},
			});

		newFormatValue = cleanedFormatValue;
		newContent = cleanedContent;
	}

	if (classCoincidence) {
		const wholeContentMultiObj = getMultiFormatObj({
			...newFormatValue,
			start: 0,
			end: newFormatValue.text.length,
		});

		const isRemovable = !Object.values(wholeContentMultiObj).some(
			({ className }) => className === currentClassName
		);

		if (isRemovable)
			delete newTypography['custom-formats'][currentClassName];
	}
	return {
		typography: newTypography,
		content: newContent,
		formatValue: newFormatValue,
	};
};

/**
 * Merge new custom format
 *
 * @param {Object} [$0]                Optional named arguments.
 * @param {Object} [$0.formatValue]    RichText format value
 * @param {Object} [$0.typography]     MaxiBlocks typography
 * @param {string} [$0.breakpoint]     Device type breakpoint
 * @param {Object} [$0.value]          Requested values to implement
 *                                     on typography object
 * @param {Object} [$0.multiFormatObj] Classes with its positions
 * @param {Object} [$0.isList]         Text Maxi block has list mode active
 * @param {Object} [$0.isHover]        Is the requested typography under hover state
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
	isWholeContent,
	textLevel,
	styleCard,
}) => {
	let newTypography = { ...typography };
	let newContent = '';
	let newFormatValue = { ...formatValue };

	Object.values(multiFormatObj).forEach((format, i) => {
		const newMultiFormatObj = getMultiFormatObj(
			{
				...newFormatValue,
				start: formatValue.start,
				end: formatValue.end,
			},
			isHover,
			isWholeContent
		);

		if (!Object.keys(newMultiFormatObj)[i]) return;

		const formatClassName = getFormatClassName(newTypography, isHover);
		const { className, start, end } = Object.values(newMultiFormatObj)[i];

		newFormatValue = {
			...newFormatValue,
			start,
			end,
		};

		// Determines if the whole currentClassName custom format segment is inside
		// the selected content
		const isWholeSegment = className
			? getIsFullFormat(formatValue, className)
			: false;

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
					textLevel,
					isWholeSegment,
					styleCard,
			  })
			: setNewFormat({
					typography: newTypography,
					formatValue: newFormatValue,
					formatClassName,
					breakpoint,
					value,
					isList,
					isHover,
					textLevel,
					styleCard,
			  });

		newTypography = newCustomTypography;
		newContent = newCustomContent;
		newFormatValue = {
			...newCustomFormatValue,
			start: formatValue.start,
			end: formatValue.end,
		};
	});

	if (isWholeContent) {
		Object.entries(value).forEach(([key, val]) => {
			newTypography[`${key}-${breakpoint}${isHover ? '-hover' : ''}`] =
				val;
		});
	}

	return {
		typography: newTypography,
		content: newContent,
		formatValue: newFormatValue,
	};
};

/**
 * Sets Maxi Custom format
 *
 * @param {Object} [$0]             Optional named arguments.
 * @param {Object} [$0.formatValue] RichText format value
 * @param {Object} [$0.typography]  MaxiBlocks typography
 * @param {string} [$0.breakpoint]  Device type breakpoint
 * @param {Object} [$0.value]       Requested values to implement
 *                                  on typography object
 * @param {Object} [$0.isList]      Text Maxi block has list mode active
 * @param {Object} [$0.isHover]     Is the requested typography under hover state
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
	textLevel = 'p',
	returnFormatValue = false,
	styleCard,
}) => {
	// Fixes first render when pasting content
	if (!formatValue || !typography) return {};

	const { start, end, formats } = formatValue;

	const isWholeContent = end - start === formats.length;
	const multiFormatObj = getMultiFormatObj(
		formatValue,
		isHover,
		isWholeContent
	);
	const currentClassName = getCurrentFormatClassName(formatValue, isHover);
	const formatClassName = getFormatClassName(typography, isHover);
	const hasCustomFormat = getHasCustomFormat(formatValue, isHover);
	const hasMultiCustomFormat = Object.keys(multiFormatObj).length > 1;

	const {
		typography: preformattedTypography,
		content: preformattedContent,
		formatValue: preformattedFormatValue,
	} = (!hasCustomFormat &&
		setNewFormat({
			typography,
			formatValue,
			formatClassName,
			breakpoint,
			value,
			isList,
			isHover,
			textLevel,
			styleCard,
		})) ||
	(hasCustomFormat &&
		!hasMultiCustomFormat &&
		!isWholeContent &&
		mergeNewFormat({
			typography,
			formatValue,
			currentClassName,
			formatClassName,
			breakpoint,
			value,
			isList,
			isHover,
			textLevel,
			styleCard,
		})) ||
	(hasCustomFormat &&
		(hasMultiCustomFormat || isWholeContent) &&
		mergeMultipleFormats({
			typography,
			formatValue,
			breakpoint,
			value,
			isList,
			multiFormatObj,
			isHover,
			isWholeContent,
			textLevel,
			styleCard,
		}));

	const {
		typography: newTypography,
		content: newContent,
		formatValue: newFormatValue,
	} = flatFormatsWithClass({
		formatValue: preformattedFormatValue || formatValue,
		typography: preformattedTypography || typography,
		changedTypography: preformattedTypography || typography,
		content: preformattedContent,
		isList,
		returnFormatValue: true,
		value,
		breakpoint,
		textLevel,
		isHover,
		styleCard,
	});

	return {
		...newTypography,
		content: newContent,
		...(returnFormatValue ? { formatValue: newFormatValue } : {}),
	};
};

export default setFormatWithClass;
