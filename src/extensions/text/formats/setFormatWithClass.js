/**
 * WordPress dependencies
 */
const { applyFormat } = wp.richText;

/**
 * Internal dependencies
 */
import __experimentalGetFormattedString from './getFormattedString';
import __experimentalGetCurrentFormatClassName from './getCurrentFormatClassName';
import defaultCustomFormat from './custom/default';

/**
 * External dependencies
 */
import { inRange } from 'lodash';

/**
 * Content
 */
const formatName = 'maxi-blocks/text-custom';

const generateMultiFormatObj = formatValue => {
	const { start, end } = formatValue;
	const formatArray = new Array([...formatValue.formats])[0];

	const response = formatArray.map((formatEl, i) => {
		if (formatEl)
			return formatEl.map(format => {
				if (format.type === formatName && i >= start && i < end)
					return format.attributes.className;

				return null;
			});

		return [null];
	});

	const obj = {};
	let array = [];
	response.forEach((format, i) => {
		if (!inRange(i, start, end)) return true;

		const prev = response[i - 1] ? response[i - 1][0] : null;
		const next = response[i + 1] ? response[i + 1][0] : null;
		const current = format ? format[0] : null;

		if (current === null && i === start) {
			array.push(i);
			return true;
		}
		if (current === null && i + 1 === end) {
			array.push(i);
			if (array.length === 2) {
				obj[Object.keys(obj).length] = {
					className: current || null,
					start: array[0],
					end: array[1],
				};
				array = [];
			}
		}

		if (array.length === 1 && i + 1 === end) {
			array.push(end);
			obj[Object.keys(obj).length] = {
				className: current || null,
				start: array[0],
				end: array[1],
			};
			array = [];

			return true;
		}
		if (prev === current && current === next) return true;
		if (prev !== current && !array.includes(i)) {
			array.push(i);
			if (current !== next && array.length !== 2) array.push(i + 1);
			if (array.length === 2) {
				obj[Object.keys(obj).length] = {
					className: current || null,
					start: array[0],
					end: array[1],
				};
				array = [];
			}
			return true;
		}
		if (prev === current && current !== next) {
			array.push(i + 1);
			if (array.length === 2) {
				obj[Object.keys(obj).length] = {
					className: current || null,
					start: array[0],
					end: array[1],
				};
				array = [];
			}
			return true;
		}

		return false;
	});

	return obj;
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
			[breakpoint]: { ...defaultCustomFormat[breakpoint], ...value },
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
}) => {
	typography.customFormats[currentClassName][breakpoint] = {
		...typography.customFormats[currentClassName][breakpoint],
		...value,
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
}) => {
	const newFormatValue = applyFormat(formatValue, {
		type: formatName,
		attributes: {
			className: formatClassName,
		},
	});

	typography.customFormats[formatClassName] = {
		...typography.customFormats[currentClassName],
	};

	const { typography: newTypography } = updateCustomFormat({
		typography,
		currentClassName: formatClassName,
		breakpoint,
		value,
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

	const {
		typography: newTypography,
		formatValue: newFormatValue,
	} = isFullFormat
		? updateCustomFormat({
				typography,
				formatValue,
				currentClassName,
				breakpoint,
				value,
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
	isHover = false,
	isList,
}) => {
	let newTypography = { ...typography };
	let newContent = '';
	let newFormatValue = { ...formatValue };

	const multiFormatObj = generateMultiFormatObj(formatValue);

	Object.values(multiFormatObj).forEach(format => {
		const formatClassName = `maxi-text-block__custom-format--${
			Object.keys(newTypography.customFormats).length
		}${(isHover && ':hover') || ''}`;
		const { className, start, end } = format;

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
		newFormatValue = newCustomFormatValue;
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
	const currentClassName = __experimentalGetCurrentFormatClassName(
		formatValue,
		formatName
	);
	const formatClassName = `maxi-text-block__custom-format--${
		Object.keys(typography.customFormats).length
	}${(isHover && ':hover') || ''}`;

	const { start, end, formats } = formatValue;

	const hasCustomFormat = formats.some((formatEl, i) => {
		return formatEl.some(format => {
			return format.type === formatName && i >= start && i <= end;
		});
	});

	const hasMultiCustomFormat =
		Object.keys(generateMultiFormatObj(formatValue)).length > 1;

	const {
		typography: newTypography,
		content: newContent,
		formatValue: newFormatValue,
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
			})) ||
		(hasCustomFormat &&
			hasMultiCustomFormat &&
			mergeMultipleFormats({
				typography,
				formatValue,
				breakpoint,
				value,
				isList,
			}));

	return {
		typography: newTypography,
		content: newContent,
		formatValue: newFormatValue,
	};
};

export default setFormatWithClass;
