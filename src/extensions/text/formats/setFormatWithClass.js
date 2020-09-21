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
import { flattenDeep, uniq, compact } from 'lodash';

/**
 * Content
 */
const formatName = 'maxi-blocks/text-custom';

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

const getFormatsClassName = ({ formats, start, end }) => {
	return compact(
		uniq(
			flattenDeep(
				formats.map((formatEl, i) => {
					return formatEl.map(format => {
						if (
							format.type === formatName &&
							i >= start &&
							i <= end
						)
							return format.attributes.className;

						return null;
					});
				})
			)
		)
	);
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
	isHover,
}) => {
	const newFormatValue = applyFormat(formatValue, {
		type: formatName,
		attributes: {
			attributes: {
				className: formatClassName,
			},
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
}) => {
	const { start, end, formats } = formatValue;

	const isFullFormat = !formats.some((formatEl, i) => {
		return formatEl.some(format => {
			return (
				format.attributes.className === currentClassName &&
				(i < start || i >= end)
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
		// isActive,
		// isList,
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
}) => {
	let newTypography = { ...typography };
	let newContent = '';
	let newFormatValue = { ...formatValue };

	const formatsCurrentClassName = getFormatsClassName(formatValue);

	formatsCurrentClassName.forEach(oldFormatClassName => {
		const formatClassName = `maxi-text-block__custom-format--${
			Object.keys(newTypography.customFormats).length
		}${(isHover && ':hover') || ''}`;

		const {
			typography: newCustomTypography,
			content: newCustomContent,
			formatValue: newCustomFormatValue,
		} = mergeNewFormat({
			typography: newTypography,
			formatValue: newFormatValue,
			currentClassName: oldFormatClassName,
			formatClassName,
			breakpoint,
			value,
			isHover,
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

const setNewFormat = ({
	typography,
	formatValue,
	formatClassName,
	defaultCustomFormat,
	breakpoint,
	value,
}) => {
	const newCustomStyle = {
		[formatClassName]: {
			...defaultCustomFormat,
			[breakpoint]: { ...defaultCustomFormat[breakpoint], ...value },
		},
	};

	const newFormatValue = applyFormat(formatValue, {
		type: formatName,
		// isActive,
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
		// isActive,
		// isList,
		formatClassName,
	});

	return {
		typography,
		content: newContent,
		formatValue: newFormatValue,
	};
};

const setFormatWithClass = ({
	formatValue,
	isActive,
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

	const hasMultiCustomFormat = getFormatsClassName(formatValue).length > 1;

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
			})) ||
		(hasCustomFormat &&
			hasMultiCustomFormat &&
			mergeMultipleFormats({
				typography,
				formatValue,
				breakpoint,
				value,
			}));

	return {
		typography: newTypography,
		content: newContent,
		formatValue: newFormatValue,
	};
};

export default setFormatWithClass;
